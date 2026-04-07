import fastify from "fastify";
import globalErrors from "@errors/global.errors";
import cookie from "fastify-cookie";
import authRoute from "@auth/auth.route";
import response from "plugins/response";
import userRoute from "@user/user.route";

export default async function buildApp() {
  const app = await fastify();

  app.register(cookie);
  app.register(response);

  app.register(authRoute, { prefix: "/auth" });
  app.register(userRoute, { prefix: "/user" });

  app.setErrorHandler(async (error: any, request: any, reply: any) => {
    globalErrors(error, reply);
  });

  return app;
}
