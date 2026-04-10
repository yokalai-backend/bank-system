import { Roles } from "@auth/auth.type";

declare module "fastify" {
  interface FastifyRequest {
    user: {
      id: string;
      username: string;
      role: Roles;
    };
  }
}
