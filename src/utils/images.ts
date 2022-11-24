import { Image } from 'canvas';
import sharp from 'sharp';

export async function resizeAndConvertToPNGBuffer(
  buffer: Buffer,
  w: number,
  h: number,
): Promise<Buffer> {
  return sharp(buffer).resize(w, h).toFormat('png').toBuffer();
}

export async function preprocessImage(
  buffer: Buffer,
  w: number,
  h: number,
): Promise<Image> {
  const image = new Image();
  image.src = await resizeAndConvertToPNGBuffer(buffer, w, h);
  image.width = w;
  image.height = h;

  return image;
}

export async function preprocessImages(
  buffers: Buffer[],
  w: number,
  h: number,
): Promise<Image[]> {
  const images: Image[] = [];

  for await (const buffer of buffers) {
    const image = await preprocessImage(buffer, w, h);
    images.push(image);
  }

  return images;
}
