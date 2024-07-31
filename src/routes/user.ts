import { Router } from "express";
import * as userController from "../controllers/userController.js";

const router = Router();

router.get("/:id", userController.getUserInformationById);

export default router;
