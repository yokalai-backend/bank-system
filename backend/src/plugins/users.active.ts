import fp from "fastify-plugin";
import Errors from "@errors/errors";
import { FastifyInstance, FastifyRequest } from "fastify";
import { queryOne } from "@utils/shared/query";

function isUserActive(app: FastifyInstance) {
  app.addHook("preHandler", async (req: FastifyRequest) => {
    const userId = req.user.id;

    const result = await queryOne<{ id: string }>(
      `SELECT id FROM users WHERE id = $1 AND is_active = true`,
      [userId],
    );

    if (!result?.id) {
      throw Errors.notFound("User not found", "USER_NOT_FOUND");
    }
  });
}

export default fp(isUserActive);
