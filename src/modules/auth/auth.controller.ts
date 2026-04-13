import { FastifyRequest, FastifyReply } from "fastify";
import {
  loginService,
  logoutService,
  refreshTokenService,
  registerService,
} from "@auth/auth.service";
import { LoginProps, RegisterProps } from "@auth/auth.schema";
import generateDeviceId from "@utils/auth/generate.device.id";

export async function register(
  req: FastifyRequest<{ Body: RegisterProps }>,
  rep: FastifyReply,
) {
  await registerService(req.body);

  rep.ok("Account is registered", null, 201);
} // Register a new account to database

export async function login(
  req: FastifyRequest<{ Body: LoginProps }>,
  rep: FastifyReply,
) {
  const { accessToken, refreshToken } = await loginService(req.body);

  rep.setCookie("refTkn", refreshToken, {
    httpOnly: true,
    path: "/auth",
    maxAge: 60 * 60 * 24 * 7,
  });

  rep.ok("Login is successfull", accessToken);
}

export async function logout(req: FastifyRequest, rep: FastifyReply) {
  const refreshToken = req.cookies.refTkn;

  await logoutService(refreshToken);

  rep.clearCookie("refTkn", { httpOnly: true, path: "/auth" });

  rep.ok("Logout is successfull", null);
}

export async function refreshToken(req: FastifyRequest, rep: FastifyReply) {
  const token = req.cookies.refTkn;

  const { newAccessToken, newRefreshToken } = await refreshTokenService(token);

  rep.setCookie("refTkn", newRefreshToken, {
    httpOnly: true,
    path: "/auth",
    maxAge: 60 * 60 * 24 * 7,
  });

  rep.ok("New access token is received", newAccessToken);
}
