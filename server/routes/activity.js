import express from "express";
import { getAllActivities, getActivitiesByTask } from "../controllers/activity.js";

const activityRouter = express.Router();

activityRouter.get('/getAllActivities', getAllActivities)
activityRouter.get('/task/:taskId', getActivitiesByTask)

export { activityRouter }