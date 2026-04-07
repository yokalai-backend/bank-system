import { FastifyRequest, FastifyReply } from "fastify";
import { myBalanceService, witdrawlService } from "./bank.service";

export async function myBalance(req: FastifyRequest, rep: FastifyReply) {
  const result = await myBalanceService(req.user.id);

  rep.ok("Here's your current balance information", result);
}

export async function witdrawl(
  req: FastifyRequest<{ Body: { amount: number } }>,
  rep: FastifyReply,
) {
  const result = await witdrawlService(req.user.id, req.body.amount);

  rep.ok(result, null);
}

export async function excName2(req: FastifyRequest, rep: FastifyReply) {
  // Code goes here
}

export async function excName3(req: FastifyRequest, rep: FastifyReply) {
  // Code goes here
}

export async function excName4(req: FastifyRequest, rep: FastifyReply) {
  // Code goes here
}

export async function excName5(req: FastifyRequest, rep: FastifyReply) {
  // Code goes here
}
