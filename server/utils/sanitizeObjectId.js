import mongoose from "mongoose";
import { MESSAGES } from "../constants/messages.js";

const sanitizeObjectId = (id) => {
  if (!id) {
    return { success: false, message: MESSAGES.SYSTEM.VALIDATION.ID_REQUIRED, validId: null };
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return {
      success: false,
      message: MESSAGES.SYSTEM.VALIDATION.INVALID_OBJECT_ID_FORMAT,
      validId: null,
    };
  }

  return {
    success: true,
    message: MESSAGES.SYSTEM.VALIDATION.VALID_ID_FORMAT,
    validId: new mongoose.Types.ObjectId(id),
  };
};

export { sanitizeObjectId };
