import { MessageType } from './enum';

export type eventType = {
  type: MessageType;
  [key: string]: any;
};
