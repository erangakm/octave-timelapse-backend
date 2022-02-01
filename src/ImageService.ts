import { S3 } from "aws-sdk";
import * as dayjs from "dayjs";
import * as utc from "dayjs/plugin/utc";
import * as tz from 'dayjs/plugin/timezone'
import fetch from 'node-fetch';

import { imageUrls } from "./lib/imageUrls";

dayjs.extend(utc);
dayjs.extend(tz);

export class ImageService {
  private s3Bucket: S3;

  constructor() {
    this.s3Bucket = new S3({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    })
  }

  public async downloadImages(): Promise<void> {
    const now = dayjs().tz("Australia/Melbourne");
    // if (now.hour() > 18 || now.hour() < 5) {
    //   console.log(`Time now is ${now.format()}. Skipping image download.`);

    //   return;
    // }

    const time = this.getNearest30Min(now);

    await Promise.all(
      Object.keys(imageUrls).map(async (camera) => {
        const imageUrl = imageUrls[camera];
        const response = await fetch(imageUrl);

        const params: S3.PutObjectRequest = {
          Bucket: process.env.BUCKET_NAME,
          Key: `${camera}/${this.getFilenameFragment(time)}.jpeg`,
          Body: response.body,
        }

        this.s3Bucket.upload(params, (err, data) => {
          if (err != null) {
            console.error("Error occurred uploading the file", err);
          }

          console.log("Successfully uploaded image")
        });

        console.log(camera, imageUrl)
      })
    )
  }

  private getNearest30Min(time: dayjs.Dayjs) {
    const min = time.minute();

    return time.add(min > 30 && 1, "hours").minute(min <= 30 ? 30 : 0);
  }

  private getFilenameFragment(time: dayjs.Dayjs) {
    return `${time.format("YYYY")}_${time.format("MM")}_${time.format("DD")}_${time.format("HH")}_${time.format("mm")}`
  }
}
