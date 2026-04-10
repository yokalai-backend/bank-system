import verifyToken from "@utils/shared/verify.token";
import { FastifyInstance } from "fastify";
import { me, myWallet, updateMe } from "./user.controller";
import { updateUserSchema } from "./user.schema";
import { validateBody } from "@utils/shared/validate";
import usersActive from "plugins/users.active";

export default function routeName(app: FastifyInstance) {
  app.register(verifyToken);

  app.register(usersActive);

  app.get("/me", me);

  app.get("/my-wallet", myWallet);

  app.post(
    "/update-me",
    { preValidation: validateBody(updateUserSchema) },
    updateMe,
  );

  app.put("/ex", () => console.log("Example"));
}
