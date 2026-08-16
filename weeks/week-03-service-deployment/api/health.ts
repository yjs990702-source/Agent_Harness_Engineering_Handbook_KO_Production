type ResponseLike = Readonly<{
  status: (code: number) => { json: (body: unknown) => void };
}>;

export default function healthHandler(
  _request: unknown,
  response: ResponseLike,
): void {
  response.status(200).json({ status: "ok", service: "request-tracker-lab" });
}
