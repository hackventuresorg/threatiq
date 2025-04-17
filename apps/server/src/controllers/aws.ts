import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { AWS_ACCESS_KEY, AWS_BUCKET_NAME, AWS_SECRET_KEY } from '../environments';

const s3Client = new S3Client({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY
    }
})

export async function getObject(key: string) {
    const command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: key
    })
    const url = await getSignedUrl(s3Client, command);
    return url;
}

export async function putObject(key: string, contentType: string) {
    const command = new PutObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: key,
        ContentType: contentType
    });
    const url = await getSignedUrl(s3Client, command);
    return url;
}