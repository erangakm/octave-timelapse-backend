import { S3 } from "aws-sdk";
import * as dayjs from "dayjs";

export class S3Client {
  private client: S3;

  constructor() {
    this.client = new S3({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    });
  }

  public async uploadImage(
    time: dayjs.Dayjs,
    camera: string,
    image: NodeJS.ReadableStream,
    folder: string,
  ): Promise<void> {
    const params: S3.PutObjectRequest = {
      Bucket: process.env.BUCKET_NAME,
      Key: `${folder}/${camera}/${this.getFilenameFragment(time)}.jpeg`,
      Body: image,
    }

    this.client.upload(params, this.onUpload);
  }

  private onUpload(error: Error, data: S3.ManagedUpload.SendData) {
    if (error != null) {
      console.error("Error occurred uploading the file", error);
    }
    else {
      console.log(`Successfully uploaded image: ${data.Key}`)
    }
  }

  private getFilenameFragment(time: dayjs.Dayjs) {
    return `${time.format("YYYY")}_${time.format("MM")}_${time.format("DD")}_${time.format("HH")}_${time.format("mm")}`
  }
}
