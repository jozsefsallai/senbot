import { Image } from 'canvas';
import { Client, CraiyonOutput } from 'craiyon';
import { buildCollage } from './collage';

class Craiyon {
  static CRAIYON_IMAGE_WIDTH = 256;
  static CRAIYON_IMAGE_HEIGHT = 256;

  private client: Client;

  constructor() {
    this.client = new Client();
  }

  public async generate(prompt: string): Promise<Buffer> {
    const data = await this.client.generate({ prompt });
    const images = this.mapImages(data);

    const canvas = await buildCollage(
      images,
      3,
      3,
      Craiyon.CRAIYON_IMAGE_WIDTH,
      Craiyon.CRAIYON_IMAGE_HEIGHT,
      10,
      '#111827',
    );

    const buffer = canvas.toBuffer();
    return buffer;
  }

  private mapImages(data: CraiyonOutput): Image[] {
    return data.images.map((img) => {
      const image = new Image();
      image.src = img.asBuffer();
      image.width = Craiyon.CRAIYON_IMAGE_WIDTH;
      image.height = Craiyon.CRAIYON_IMAGE_HEIGHT;

      return image;
    });
  }
}

export default Craiyon;
