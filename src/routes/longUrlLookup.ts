import { Router } from "express";
import * as longUrlLookupController from "../controllers/longUrlLookupController.js";
import xss from "xss";

const router = Router();

router.get("/", longUrlLookupController.longUrlLookup);

export default router;
