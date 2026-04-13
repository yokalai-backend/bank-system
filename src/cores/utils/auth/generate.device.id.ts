import { FastifyReply, FastifyRequest } from "fastify";

export default function generateDeviceId(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  let deviceId = req.cookies.deviceId;

  if (!deviceId) {
    deviceId = crypto.randomUUID();

    rep.setCookie("deviceId", deviceId, {
      path: "/",
      httpOnly: true,
    });
  }

  return deviceId;
}
