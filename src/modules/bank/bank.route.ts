import verifyToken from "@utils/shared/verify.token";
import { FastifyInstance } from "fastify";
import {
  addBalance,
  deposit,
  myBalance,
  transfer,
  witdrawl,
} from "@bank/bank.controller";
import { validateBody, validateParams } from "@utils/shared/validate";
import { transactionAmount, transferTo } from "./bank.schema";
import usersActive from "plugins/users.active";

export default function bankRoute(app: FastifyInstance) {
  app.register(verifyToken);
  app.register(usersActive);

  app.get("/my-balance", myBalance);

  app.post(
    "/withdrawl",
    { preValidation: validateBody(transactionAmount) },
    witdrawl,
  );

  app.post(
    "/deposit",
    { preValidation: validateBody(transactionAmount) },
    deposit,
  );

  app.post(
    "/transfer-to/:id",
    {
      preValidation: [
        validateParams(transferTo),
        validateBody(transactionAmount),
      ],
    },
    transfer,
  );

  app.post(
    "/add-balance",
    { preValidation: validateBody(transactionAmount) },
    addBalance,
  );
}
