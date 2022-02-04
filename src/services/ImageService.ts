import * as dayjs from "dayjs";
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';
import fetch from 'node-fetch';

import { imageUrls } from "../lib/imageUrls";
import { S3Client } from "./S3Client";

dayjs.extend(utc);
dayjs.extend(timezone);

export class ImageService {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client();
  }

  public async downloadImages(): Promise<void> {
    const now = dayjs().tz("Australia/Melbourne");
    const time = this.getNearest30Min(now);

    await Promise.all(
      Object.keys(imageUrls).map(async (camera) => {
        const imageUrl = imageUrls[camera];
        const response = await fetch(imageUrl);

        // Upload to raw folder.
        await this.s3Client.uploadImage(time, camera, response.body, "raw");

        // Upload to hourly folder.
        await this.s3Client.uploadImage(time, camera, response.body, "hourly");

        // Upload to daily folder at 2pm.
        if (now.hour() === 14) {
          await this.s3Client.uploadImage(time, camera, response.body, "daily");
        }
      })
    )
  }

  private getNearest30Min(time: dayjs.Dayjs) {
    const min = time.minute();

    return time.add(min > 30 && 1, "hours").minute(min <= 30 ? 30 : 0);
  }
}
