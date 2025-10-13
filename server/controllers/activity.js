import { Activity } from "../models/activity.js";
import { sanitizeObjectId } from "../utils/sanitizeObjectId.js";
import { activityResponses } from "../utils/default-values/activity.js";

const getAllActivities = async (req, res) => {
     let { _id: userId } = req.payload || {};

     let userCheck = sanitizeObjectId(userId);
     if (!userCheck.success)
          return res.json({ success: userCheck.success, message: userCheck.message });
     userId = userCheck.validId;

     try {
          const activities = await Activity.find({ user: userId })
               .populate([
                    { path: "user", select: "name" },
                    { path: "board", select: "name" },
                    { path: "task", select: "title" }
               ])
               .lean();

          if (activities.length === 0) return res.json({ success: false, message: "No activity found" });
          const formatted = activities.map(act => ({
               _id: act._id,
               user: act.user?.name || null,
               action: act.action,
               when: act.when,
               task: act.task ? act.task.title : null,
               board: act.board?.name || null,
               message: act.message,
               createdAt: act.createdAt,
               updatedAt: act.updatedAt,
               __v: act.__v
          }));

          return res.json({ success: true, message: "Activities fetched successfully", activities: formatted })
     } catch (error) {
          console.log("An error occured in getAllActivities function: ", error.message);
          return res.json({ success: false, message: "Something went wrong fetching activities" })
     }
}

const getActivitiesByTask = async (req, res) => {
     const { taskId } = req.params || {};
     if (!taskId) return res.json({ success: false, message: "Task ID is required" });

     const taskCheck = sanitizeObjectId(taskId);
     if (!taskCheck.success) {
          return res.json({
               success: taskCheck.success,
               message: taskCheck.message,
          });
     }
     const validTaskId = taskCheck.validId;

     try {
          const foundActivities = await Activity.find({ task: validTaskId })
               .populate([
                    { path: "user", select: "name" },
                    { path: "board", select: "name" },
                    { path: "task", select: "title" },
               ])
               .lean();

          if (!foundActivities || foundActivities.length === 0) {
               return res.json({
                    success: true,
                    message: "No activity found for this task. Showing mock data.",
                    activities: defaultActivities,
               });
          }

          const formatted = foundActivities.map((act) => ({
               _id: act._id,
               avatar: act.user?.name
                    ? act.user.name
                         .split(" ")
                         .map((n) => n[0])
                         .join("")
                         .toUpperCase()
                    : "U",
               name: act.user?.name || "Unknown User",
               action: act.action,
               time: act.when || "just now",
               task: act.task?.title || null,
               board: act.board?.name || null,
          }));

          return res.json({
               success: true,
               message: "Activities fetched successfully",
               activities: formatted,
               activityResponses
          });
     } catch (error) {
          console.log(
               "An error occurred in getActivitiesByTask function: ",
               error.message
          );
          return res.json({
               success: false,
               message: "Something went wrong fetching activities for this task",
          });
     }

}

export { getAllActivities, getActivitiesByTask }