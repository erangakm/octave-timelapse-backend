import { S3 } from "aws-sdk";

const BUCKET_NAME = "octave-timelapse-images";

export class ImageService {
  constructor() {
    console.log(process.env.AWS_ACCESS_KEY_ID, "ACCESS KEY ID>>>>>>>")
    // const s3Bucket = new S3({

    // })
  }

  public async downloadImages(): Promise<void> {
    console.log("called downloadImages()")
  }
}
