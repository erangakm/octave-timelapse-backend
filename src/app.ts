import * as express from 'express';
import { ImageService } from "./ImageService";

class App {
  public express;
  constructor() {
    this.express = express();
    this.mountRoutes();
  }
  private mountRoutes(): void {
    const router = express.Router();
    const imageService = new ImageService();
    imageService.downloadImages();
    router.get('/', (req, res) => {
      res.json({ message: 'SUPP!!!!' });
    });
    this.express.use('/', router);
  }
}

export default new App().express;
