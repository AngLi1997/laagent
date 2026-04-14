/**
 * 生成水印图片
 * @param content 水印内容
 * @returns 水印图片
 */
export function generateWatermark(content: string) {
  const canvas = document.createElement('canvas');
  const textWidth = 16 * content.length;
  const rotate = Math.PI / 6;
  const width = textWidth * Math.cos(rotate) * 2;
  const height = textWidth * Math.sin(rotate) * 2;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#F5F6F7';
    ctx.rotate(-1 * rotate);
    ctx.fillText(content, 0, textWidth);
  }
  return canvas.toDataURL();
}
