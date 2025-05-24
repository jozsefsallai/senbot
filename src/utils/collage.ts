import { createCanvas, Canvas, Image } from '@napi-rs/canvas';

async function buildCollage(
  imgs: Image[],
  rows: number,
  cols: number,
  imgw: number,
  imgh: number,
  gap: number,
  bgColor: string,
): Promise<Canvas> {
  const width = gap * (cols + 1) + imgw * cols;
  const height = gap * (rows + 1) + imgh * rows;

  const canvas = createCanvas(width, height);

  const ctx = canvas.getContext('2d');

  ctx.beginPath();
  ctx.rect(0, 0, width, height);
  ctx.fillStyle = bgColor;
  ctx.fill();

  let x = gap;
  let y = gap;

  for (let i = 0; i < imgs.length; ++i) {
    const img = imgs[i];
    ctx.drawImage(img, x, y, imgw, imgh);

    if ((i + 1) % cols === 0) {
      x = gap;
      y += gap + imgh;
    } else {
      x += gap + imgw;
    }
  }

  return canvas;
}

export { buildCollage };
