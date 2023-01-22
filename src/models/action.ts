export interface Action<Payload = any> {
  action: string;
  payload: Payload;
}
