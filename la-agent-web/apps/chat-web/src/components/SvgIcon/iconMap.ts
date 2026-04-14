import type React from 'react';

// 自动导入指定目录下所有 SVG 文件（设置 eager: true 进行即时导入）
const modules = import.meta.glob('../../assets/icons/*.svg', {
  eager: true,
  import: 'ReactComponent', // 直接导入 ReactComponent
});

// 构造文件名与 SVG 组件之间的映射
const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {};

for (const path in modules) {
  // 提取文件名，并去除 .svg 后缀作为图标名，例如 arrow.svg => arrow
  const fileName = path.split('/').pop() || '';
  const iconName = fileName.replace('.svg', '');
  const component = modules[path] as any;

  // 简化导入逻辑
  if (component) {
    iconMap[iconName] = component;
  }
  else {
    console.warn(`Failed to load SVG component for "${iconName}" from path: ${path}`);
  }
}

export default iconMap;
