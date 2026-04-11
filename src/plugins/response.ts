import { FastifyInstance, FastifyReply } from "fastify";
import fp from "fastify-plugin";

type Errors = { message: string | any[]; code: string };

declare module "fastify" {
  interface FastifyReply {
    ok(message: string, data: unknown, statusCode?: number): FastifyReply;
    notok(errors: Errors, statusCode: number): FastifyReply;
  }
}

function replyResponse(app: FastifyInstance) {
  app.decorateReply(
    "ok",
    function (
      this: FastifyReply,
      message: string,
      data: unknown,
      statusCode?: number,
    ) {
      return this.code(statusCode ?? 200).send({
        success: true,
        message,
        data: data,
      });
    },
  );

  app.decorateReply(
    "notok",
    function (this: FastifyReply, errors: Errors, statusCode: number) {
      return this.code(statusCode).send({ success: false, errors });
    },
  );
}

export default fp(replyResponse);
