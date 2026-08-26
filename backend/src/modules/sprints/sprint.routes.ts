import { Router } from "express";

import { protect } from "@/middleware/auth.middleware";
import validateRequest from "@/middleware/validateRequest.middleware";

import {
  createSprintSchema,
  completeSprintSchema,
} from "./sprint.validator";

import {
  createSprint,
  fetchAllSprints,
  fetchSprint,
  startSprint,
  completeSprint,
  fetchSprintIssues,
} from "./sprint.controller";

const router = Router();

router.use(protect);

router.post(
  "/",
  validateRequest(createSprintSchema),
  createSprint,
);

router.get(
  "/",
  fetchAllSprints,
);

router.get(
  "/:sprintId",
  fetchSprint,
);

router.post(
  "/:sprintId/start",
  startSprint,
);

router.post(
  "/:sprintId/complete",
  validateRequest(completeSprintSchema),
  completeSprint,
);

router.get(
  "/:sprintId/issues",
  fetchSprintIssues,
);

export default router;
