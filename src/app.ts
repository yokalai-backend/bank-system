import fastify from "fastify";
import globalErrors from "@errors/global.errors";
import cookie from "fastify-cookie";
import authRoute from "@auth/auth.route";
import response from "plugins/response";
import userRoute from "@user/user.route";
import bankRoute from "@bank/bank.route";
import cors from "@fastify/cors";

import { connectRedis } from "cores/redis/redis";

export default async function buildApp() {
  const app = await fastify();

  await connectRedis(); // Connect to redis

  app.register(cookie);
  app.register(cors, { origin: true, credentials: true });
  app.register(response);

  app.register(authRoute, { prefix: "/auth" });
  app.register(userRoute, { prefix: "/user" });
  app.register(bankRoute, { prefix: "/bank" });

  app.setErrorHandler(async (error: any, request: any, reply: any) => {
    globalErrors(error, reply);
  });

  return app;
}
