import verifyToken from "@utils/shared/verify.token";
import { FastifyInstance } from "fastify";
import { me, myBalance, updateMe } from "./user.controller";
import { updateUserSchema } from "./user.schema";
import { validateBody } from "@utils/shared/validate";

export default function routeName(app: FastifyInstance) {
  app.register(verifyToken);

  app.get("/me", me);

  app.get("/my-balance", myBalance);

  app.post(
    "/update-me",
    { preValidation: validateBody(updateUserSchema) },
    updateMe,
  );

  app.patch("/ex", () => console.log("Example"));

  app.put("/ex", () => console.log("Example"));
}
