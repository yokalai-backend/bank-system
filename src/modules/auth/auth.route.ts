import { FastifyInstance } from "fastify";
import { login, logout, register } from "@auth/auth.controller";
import { validateBody } from "@utils/validate";
import { loginSchema, registerSchema } from "@auth/auth.schema";
import { refreshToken } from "@auth/auth.controller";

export default function authRoute(app: FastifyInstance) {
  app.post(
    "/register",
    { preValidation: validateBody(registerSchema) },
    register,
  );

  app.post("/login", { preValidation: validateBody(loginSchema) }, login);

  app.post("/refresh-token", refreshToken);

  app.post("/logout", logout);
}
