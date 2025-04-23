import { spawn } from "child_process";
import { CCTV, Organization, User } from "../db/models";
import { groqClient } from "../ai";
import { createThreat, IThreat } from "./threat";
import { sendNotification } from "./notification";
import { io } from "../index";

const FRAME_EXTRACTION_INTERVAL = 5000;
const activeStreams = new Map<string, ReturnType<typeof spawn>>();
async function main() {
  console.log("Watching CCTV streams for updates...");
  CCTV.watch().on("change", (change) => {
    if (
      change.operationType === "insert" ||
      (change.operationType === "update" &&
        change.updateDescription?.updatedFields?.isActive === true)
    ) {
      const doc = change.fullDocument;
      if (doc?.isActive && doc?.fullUrl) {
        startStreamWorker(doc?.fullUrl, doc?._id as string);
      }
    }
  });

  const existingStreams = await CCTV.find({ isActive: true });
  console.log(`Found ${existingStreams.length} active streams to monitor`);

  existingStreams.forEach((stream) => {
    if (stream.fullUrl) {
      startStreamWorker(stream.fullUrl, stream?._id as string);
    }
  });
}

export function startStreamWorker(rtspUrl: string, cctvId: string) {
  console.log(`Starting stream worker for ${rtspUrl}`);

  const ffmpeg = spawn("ffmpeg", [
    "-rtsp_transport",
    "tcp",
    "-analyzeduration",
    "2000000",
    "-probesize",
    "5000000",
    "-i",
    rtspUrl,
    "-vf",
    `fps=${1000 / FRAME_EXTRACTION_INTERVAL}`,
    "-f",
    "image2pipe",
    "-vcodec",
    "mjpeg",
    "pipe:1",
  ]);
  activeStreams.set(cctvId, ffmpeg);
  let buffer = Buffer.alloc(0);
  let connectionFailed = false;

  ffmpeg.stdout.on("data", async (chunk) => {
    buffer = Buffer.concat([buffer, chunk]);

    const frameStart = buffer.indexOf(Buffer.from([0xff, 0xd8]));
    const frameEnd = buffer.indexOf(Buffer.from([0xff, 0xd9]));

    if (frameStart !== -1 && frameEnd !== -1 && frameEnd > frameStart) {
      const frame = buffer.subarray(frameStart, frameEnd + 2);
      buffer = buffer.subarray(frameEnd + 2);

      const threat = await analyzeFrame(frame);
      console.log("Threat Analysis:", threat);
      if (threat.detected) {
        io.emit("threat-detected", threat);
        await createThreat(threat as IThreat, cctvId);
        const timestamp = new Date().toISOString();
        console.log(`Threat detected on ${rtspUrl} at ${timestamp}`);

        const cctv = await CCTV.findById(cctvId);

        if (cctv) {
          await sendNotificationsToOrgUsers(
            cctv?.organization.toString() as string,
            cctv,
            threat as IThreat
          );
        }
      }
    }
  });

  ffmpeg.stderr.on("data", (data) => {
    const errorText = data.toString();

    if (
      errorText.includes("Failed to resolve hostname") ||
      errorText.includes("Connection refused") ||
      errorText.includes("Error opening input")
    ) {
      if (!connectionFailed) {
        connectionFailed = true;
        console.error(`Connection failed to RTSP stream: ${rtspUrl}`);

        CCTV.findByIdAndUpdate(cctvId, {
          connectionStatus: "failed",
          lastConnectionAttempt: new Date(),
        }).catch((err) => console.error("Failed to update CCTV status:", err));
      }
    }
  });

  ffmpeg.on("error", (err) => {
    console.error(`Error in stream worker for ${rtspUrl}:`, err.message);
  });

  ffmpeg.on("exit", (code) => {});
}

export function stopStreamWorker(rtspUrl: string, cctvId: string) {
  console.log("stop stream runn");
  console.log(`Stopping stream worker for ${rtspUrl}`);

  const ffmpeg = activeStreams.get(cctvId);
  if (ffmpeg) {
    ffmpeg.kill("SIGTERM");
    activeStreams.delete(cctvId);
    console.log(`Stream worker for ${rtspUrl} stopped`);
  } else {
    console.warn(`No active stream found for ${rtspUrl}`);
  }
}

async function analyzeFrame(imageBuffer: Buffer) {
  try {
    return await groqClient.analyzeImageBuffer(imageBuffer);
  } catch (err: any) {
    console.error("Groq API error:", err.message);
    return { detected: false };
  }
}

async function sendNotificationsToOrgUsers(orgId: string, cctv: any, threat: IThreat) {
  try {
    const organization = await Organization.findById(orgId);
    if (!organization) {
      console.error(`Organization not found: ${orgId}`);
      return;
    }

    const usersToNotify = new Set<string>();

    if (organization.createdBy) {
      const creator = await User.findById(organization.createdBy);
      if (creator && creator.clerkId) {
        usersToNotify.add(creator.clerkId);
      }
    }

    if (organization.users && organization.users.length > 0) {
      const orgUsers = await User.find({ _id: { $in: organization.users } });
      orgUsers.forEach((user) => {
        if (user.clerkId) {
          usersToNotify.add(user.clerkId);
        }
      });
    }

    const notificationData = {
      notificationType: "threat_detected",
      body: {
        risk: threat.risk_score ? `${threat.risk_score}/10` : "High",
        type: threat.type || "Unknown",
        createdAt: new Date().toISOString(),
        cctvName: cctv.name,
      },
      organization: organization.name,
      cctvId: cctv._id.toString(),
      cctvLocation: cctv.location,
      threatDetails: threat.details,
    };

    const notificationPromises = Array.from(usersToNotify).map((userId) =>
      sendNotification(userId, notificationData)
    );

    await Promise.allSettled(notificationPromises);
    console.log(`Sent threat notifications to ${notificationPromises.length} users`);
  } catch (error) {
    console.error("Error sending threat notifications:", error);
  }
}

export { main as startRtspThreatPipeline };
