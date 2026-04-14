// utils/generateWatermark.ts
import { Svg, Text, G } from 'react-native-svg';
import React from 'react';

/**
 * 生成水印 SVG 组件和 Base64 Data URL
 * @param content 水印内容
 * @param fontSize 字体大小（默认 16）
 * @param color 文字颜色（默认 #F5F6F7）
 * @returns { svgComponent: React.ReactNode, base64Svg: string }
 */
export function generateWatermark(
  content: string,
  fontSize: number = 16,
  color: string = '#F5F6F7'
) {
  const textWidth = fontSize * content.length * 0.6;
  const rotate = Math.PI / 6;
  const width = textWidth * Math.cos(rotate) * 2;
  const height = textWidth * Math.sin(rotate) * 2;

  // SVG XML 字符串
  const svgXml = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <g transform="rotate(-30 ${width / 2} ${height / 2})">
        <text x="0" y="${textWidth}" font-size="${fontSize}" fill="${color}" font-family="Arial">
          ${content}
        </text>
      </g>
    </svg>
  `;

  // 转换为 Base64
  const base64Svg = `data:image/svg+xml;base64,${Buffer.from(svgXml).toString('base64')}`;

  return base64Svg;
}