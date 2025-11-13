import { Router } from "express";
import {
  getAllEventsController,
  getEventBySlugController,
} from "../controllers/event.controller";

export const eventRouter = Router();

eventRouter.get("/:slug", getEventBySlugController);
eventRouter.get("/", getAllEventsController);

export default eventRouter;
