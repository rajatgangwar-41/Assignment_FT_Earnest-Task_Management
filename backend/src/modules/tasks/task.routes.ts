import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import * as controller from "./task.controller";

const router = Router();

router.use(requireAuth);

router.get("/", controller.list);
router.post("/", controller.create);
router.get("/:id", controller.getOne);
router.patch("/:id", controller.update);
router.delete("/:id", controller.remove);
router.patch("/:id/toggle", controller.toggle);

export default router;
