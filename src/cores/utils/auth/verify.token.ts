import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import Errors from "@errors/errors";
import env from "@config/env";
import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Roles } from "@auth/auth.type";

function verifyToken(app: FastifyInstance) {
  app.addHook("preHandler", async (req: FastifyRequest, rep: FastifyReply) => {
    const headers = req.headers.authorization;

    if (!headers)
      throw Errors.authorization("No token header provided", "NO_TOKEN_HEADER");

    if (!headers.startsWith("Bearer "))
      throw Errors.authorization(
        "Invalid token format",
        "INVALID_TOKEN_FORMAT",
      );

    const token = headers.split(" ")[1];

    try {
      const user = jwt.verify(token, env.ACCESS_TOKEN) as {
        id: string;
        username: string;
        role: Roles;
      };

      req.user = user;
    } catch (error: any) {
      if (error instanceof TokenExpiredError)
        throw Errors.authorization("Token expired", "TOKEN_EXPIRED");

      if (error instanceof JsonWebTokenError)
        throw Errors.authorization("Token invalid", "TOKEN_INVALID");

      throw error;
    }
  });
}

export default fp(verifyToken);
