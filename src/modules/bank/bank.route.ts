import verifyToken from "@utils/shared/verify.token";
import { FastifyInstance } from "fastify";
import { deposit, myBalance, witdrawl } from "@bank/bank.controller";
import { validateBody } from "@utils/shared/validate";
import { transaction } from "./bank.schema";
import usersActive from "plugins/users.active";

export default function bankRoute(app: FastifyInstance) {
  app.register(verifyToken);
  app.register(usersActive);

  app.get("/my-balance", myBalance);

  app.post(
    "/withdrawl",
    { preValidation: validateBody(transaction) },
    witdrawl,
  );

  app.post("/deposit", { preValidation: validateBody(transaction) }, deposit);

  app.post("/ex", () => console.log("Example"));

  app.delete("/ex", () => console.log("Example"));
}
