import path from 'path';

export const getIconsConfig = () => {
  const root = path.resolve(process.cwd(), '..','..')
  const icons = path.resolve(root, 'packages/icon/src')
  return {
    iconDirs: [path.resolve(icons, 'icon')],
    symbolId: 'icon-[dir]-[name]',
  }
}
