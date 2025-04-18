import { spawn } from "child_process";
import { CCTV } from "../db/models";
import { groqClient } from "../ai";
import { createThreat, IThreat } from "./threat";

const FRAME_EXTRACTION_INTERVAL = 5000;

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

function startStreamWorker(rtspUrl: string, cctvId: string) {
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
        await createThreat(threat as IThreat, cctvId);
        const timestamp = new Date().toISOString();
        console.log(`Threat detected on ${rtspUrl} at ${timestamp}`);

        await CCTV.findByIdAndUpdate(cctvId, {
          $push: {
            detections: {
              timestamp: new Date(),
              threatType: threat.type || "unknown",
              confidence: threat.confidence || 0,
              imageData: frame.toString("base64"),
            },
          },
        });
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

async function analyzeFrame(imageBuffer: Buffer) {
  try {
    return await groqClient.analyzeImageBuffer(imageBuffer);
  } catch (err: any) {
    console.error("Groq API error:", err.message);
    return { detected: false };
  }
}

export { main as startRtspThreatPipeline };
