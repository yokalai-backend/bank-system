import { FastifyRequest, FastifyReply } from "fastify";
import { meService, myBalanceService, updateMeService } from "./user.service";
import { UpdateUserProps } from "./user.schema";

export async function me(req: FastifyRequest, rep: FastifyReply) {
  const result = await meService(req.user.id);

  rep.ok("Here's your information", result);
}

export async function myBalance(req: FastifyRequest, rep: FastifyReply) {
  const result = await myBalanceService(req.user.id);

  rep.ok("Here's your current balance information", result);
}

export async function updateMe(
  req: FastifyRequest<{ Body: UpdateUserProps }>,
  rep: FastifyReply,
) {
  const result = await updateMeService(req.user.id, req.body);

  rep.ok("Account updated", result);
}

export async function excName4(req: FastifyRequest, rep: FastifyReply) {
  // Code goes here
}

export async function excName5(req: FastifyRequest, rep: FastifyReply) {
  // Code goes here
}
