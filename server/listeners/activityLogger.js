import { Activity } from "../models/activity.js";
import { emitter } from "../config/emitter.js";

emitter.on("activity", (logData) => {
  Activity.create(logData)
    .then((data) => console.log("Activity logged", data))
    .catch((err) => {
      console.error("Failed to log activity:", err.message);
    });
});

console.log("Activity listener initialized");
