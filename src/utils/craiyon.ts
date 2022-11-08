import { Image } from 'canvas';
import { Client } from 'craiyon';
import sharp from 'sharp';
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
    const images: Image[] = [];

    for await (const imageData of data.images) {
      const image = await this.preprocessImage(imageData.asBuffer());
      images.push(image);
    }

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

  private async resizeAndConvertToPNGBuffer(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer)
      .resize(Craiyon.CRAIYON_IMAGE_WIDTH, Craiyon.CRAIYON_IMAGE_HEIGHT)
      .toFormat('png')
      .toBuffer();
  }

  private async preprocessImage(buffer: Buffer): Promise<Image> {
    const image = new Image();
    image.src = await this.resizeAndConvertToPNGBuffer(buffer);
    image.width = Craiyon.CRAIYON_IMAGE_WIDTH;
    image.height = Craiyon.CRAIYON_IMAGE_HEIGHT;

    return image;
  }
}

export default Craiyon;
