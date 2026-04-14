import type { MenuProps } from 'antd';

export interface MenuListItem {
  icon: React.ReactNode;
  title: string;
  menuItems?: MenuProps['items'];
  onClick?: (item: MenuListItem) => void;
}

export type MenuItem = Required<MenuProps>['items'][number];

export enum FeedbackEnum {
  new = 'FeedbackNew',
  history = 'FeedbackHistory',
}
