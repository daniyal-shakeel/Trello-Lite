const validateString = (str, allowedSpecials = "._-@") => {
  if (typeof str !== "string") {
    return { success: false, message: "Value must be a string" };
  }

  const trimmed = str.trim();
  if (trimmed.length === 0) {
    return { success: false, message: "String cannot be empty" };
  }

  const escaped = allowedSpecials.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  const regex = new RegExp(`^[a-zA-Z0-9 ${escaped}]+$`);

  if (!regex.test(trimmed)) {
    return {
      success: false,
      message: `String contains invalid characters. Allowed: letters, numbers, spaces, and [${allowedSpecials}]`,
    };
  }

  return { success: true, message: "Valid string" };
};

export { validateString };
