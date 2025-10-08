import mongoose from "mongoose";

const sanitizeObjectId = (id) => {
  if (!id) {
    return { success: false, message: "ID is required", validId: null };
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return {
      success: false,
      message: "Invalid ObjectId format",
      validId: null,
    };
  }

  return {
    success: true,
    message: "Valid id format",
    validId: new mongoose.Types.ObjectId(id),
  };
};

export { sanitizeObjectId };
