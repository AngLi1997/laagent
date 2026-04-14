import { VueElement } from 'vue';

export interface TabsPaneType {
  key: string | number;
  tab: string | VueElement;
  title?: string;
}

export type KEY = string | number;