import { MESSAGES } from "../constants/messages.js";

const validateString = (str, allowedSpecials = "._-@") => {
  if (typeof str !== "string") {
    return { success: false, message: MESSAGES.SYSTEM.VALIDATION.VALUE_MUST_BE_STRING };
  }

  const trimmed = str.trim();
  if (trimmed.length === 0) {
    return { success: false, message: MESSAGES.SYSTEM.VALIDATION.STRING_CANNOT_BE_EMPTY };
  }

  const escaped = allowedSpecials.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  const regex = new RegExp(`^[a-zA-Z0-9 ${escaped}]+$`);

  if (!regex.test(trimmed)) {
    return {
      success: false,
      message: `String contains invalid characters. Allowed: letters, numbers, spaces, and [${allowedSpecials}]`,
    };
  }

  return { success: true, message: MESSAGES.SYSTEM.VALIDATION.VALID_STRING };
};

export { validateString };
