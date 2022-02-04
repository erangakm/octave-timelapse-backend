import "../env";

import * as dayjs from "dayjs";
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone'
import { ImageService } from "../services/ImageService";

dayjs.extend(utc);
dayjs.extend(timezone);

const downloadImages = () => {
  const now = dayjs().tz("Australia/Melbourne");
  if (now.hour() > 18 || now.hour() < 5) {
    console.log(`Time now is ${now.format()}. Skipping image download.`);

    return;
  }

  new ImageService().downloadImages();
}

downloadImages();
