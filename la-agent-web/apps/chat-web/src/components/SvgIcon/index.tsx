// src/components/Icon.tsx
import React, { memo } from 'react';
import iconMap from './iconMap';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string; // 对应 SVG 文件名（不含 .svg 后缀），例如 "arrow"
  size?: number;
  color?: string;
}

const Icon: React.FC<IconProps> = memo(({
  name,
  size = 24,
  color,
  ...rest
}) => {
  if (!name || typeof name !== 'string') {
    console.error('Invalid "name" prop provided to SvgIcon.');
    return null;
  }

  const SvgIcon = iconMap[name];

  if (!SvgIcon) {
    console.warn(`Icon "${name}" does not exist in iconMap.`);
    return null;
  }

  return (
    <SvgIcon
      width={size}
      height={size}
      // 如果传入 color 属性，使用它来设置填充颜色， 没有不要fill
      {...color ? { fill: color } : {}}
      {...rest}
    />
  );
});

export default Icon;
