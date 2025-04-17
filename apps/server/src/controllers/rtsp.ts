import { spawn } from 'child_process';
import { Readable } from 'stream';
import { putObject } from './aws';

const RTSP_URL = 'rtsp://localhost:8554/mystream';
const CHUNK_DURATION = 5; 

function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

function getTimestampFilename(): string {
  const now = new Date();
  return now.toISOString().replace(/[:.]/g, '-').replace('T', '_').replace('Z', '') + '.jpg';
}



async function extractFrameAndUpload(): Promise<void> {
  const filename = getTimestampFilename();
  const key = `frames/${filename}`;
  console.log(`🎞️ Capturing frame and uploading as ${key}`);

  const ffmpeg = spawn('ffmpeg', [
    '-y',
    '-rtsp_transport', 'tcp',
    '-i', RTSP_URL,
    '-frames:v', '1',
    '-vcodec', 'mjpeg',
    '-f', 'image2',
    'pipe:1',
  ]);

  ffmpeg.stderr.on('data', (data: Buffer) => {
    // console.log(`🛠 FFmpeg: ${data.toString()}`);
    console.log("data is comming.");
  });

  ffmpeg.on('error', (err: Error) => {
    console.error(`❌ Failed to start FFmpeg: ${err.message}`);
  });

  try {
    const buffer = await streamToBuffer(ffmpeg.stdout);
    const uploadUrl = await putObject(key, 'image/jpeg');

    const res = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Length': buffer.length.toString(),
      },
      body: buffer,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`❌ Upload failed (${res.status}): ${errorText}`);
    } else {
      console.log(`✅ Frame uploaded to S3: ${key}`);
    }
  } catch (error) {
    console.error(`❌ Error: ${(error as Error).message}`);
  }
}

export function startProcessing(): void {
  console.log(`📡 Starting RTSP frame extraction from: ${RTSP_URL}`);
  console.log(`🕒 Capturing one frame every ${CHUNK_DURATION} seconds`);

  extractFrameAndUpload();
  setInterval(extractFrameAndUpload, CHUNK_DURATION * 1000);
}
