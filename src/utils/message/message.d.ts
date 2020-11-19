import { MsgKey } from "./messagesKeys";
export interface Msg {
  key: MsgKey;
  value: any;
  description?: string;
}
