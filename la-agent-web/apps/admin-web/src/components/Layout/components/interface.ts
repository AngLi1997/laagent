import { VueElement } from 'vue';

export interface TabsPaneType {
  key: string | number;
  tab: string | VueElement;
  title?: string;
  mapState?: Array<number>;
}
