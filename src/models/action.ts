export interface Action<Payload = unknown> {
  action: string;
  payload: Payload;
}
