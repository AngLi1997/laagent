import type { FlowNodeEnum } from './enum';

export interface FlowLeftToolBar {
  title: string;
  label: string;
  icon: any;
  shape: (typeof FlowNodeEnum)[keyof typeof FlowNodeEnum];
  width?: number;
  height?: number;
  [key: string]: any;
}
