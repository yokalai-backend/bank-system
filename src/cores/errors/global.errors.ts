import { FastifyReply } from "fastify";
import { ZodError } from "zod";
import AppError from "./app.error";

export default function globalErrors(error: any, reply: FastifyReply) {
  console.error(error);

  if (error instanceof AppError) {
    const errors = {
      message: error.message,
      code: error.code,
    };

    return reply.notok(errors, error.statusCode);
  }

  if (error instanceof ZodError) {
    const errors = {
      message: error.issues,
      code: "INVALID_TYPE",
    };

    return reply.notok(errors, 400);
  }

  return reply.notok(
    {
      code: "INTERNAL_ERROR",
      message: "Something went wrong",
    },
    500,
  );
}
