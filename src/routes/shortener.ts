import { Router } from "express";
import * as shortenerController from "../controllers/shortenerController.js";

const router = Router();

router.post("/", shortenerController.shorten);

export default router;
