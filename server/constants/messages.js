export const MESSAGES = {
  // Authentication & User Management
  AUTH: {
    SUCCESS: {
      LOGIN_SUCCESS: "Login successful",
      LOGOUT_SUCCESS: "Logout successful",
      REGISTRATION_SUCCESS: "Registration successful",
      TOKEN_VERIFIED: "Token verified successfully",
    },
    ERROR: {
      INVALID_CREDENTIALS: "Invalid credentials",
      TOKEN_VERIFICATION_FAILED: "Token verificatin failed",
      UNAUTHORIZED: "Unauthorized access",
      SESSION_EXPIRED: "Session expired",
    },
    VALIDATION: {
      ALL_FIELDS_REQUIRED: "All fields are required",
      EMAIL_ALREADY_REGISTERED: "Email already registered",
      INVALID_EMAIL_FORMAT: "Invalid email format",
      PASSWORD_TOO_SHORT: "Password must be at least 6 characters",
    },
    GENERAL: {
      SOMETHING_WENT_WRONG: "Something went wrong",
    },
  },

  // Board Management
  BOARD: {
    SUCCESS: {
      CREATED_SUCCESSFULLY: "Board created",
      UPDATED_SUCCESSFULLY: "Board updated successfully",
      DELETED_SUCCESSFULLY: "Board deleted",
      STATUS_CHANGED: "Board status changed successfully",
      COLLABORATOR_ADDED: "Collaborator added successfully",
      COLLABORATOR_REMOVED: "Collaborator removed successfully",
    },
    ERROR: {
      NOT_FOUND: "Board not found or you are not authorized",
      CREATION_FAILED: "Failed to create board",
      UPDATE_FAILED: "Failed to update board",
      DELETE_FAILED: "Error in deleting board",
      ALREADY_EXISTS: "Board already exists",
      UNAUTHORIZED_ACCESS: "You are not authorized to access this board",
    },
    VALIDATION: {
      NAME_REQUIRED: "Name is required",
      INVALID_BOARD_ID: "Board ID is required",
      INVALID_BOARD_ID_FORMAT: "Invalid Board ID format",
      STATUS_REQUIRED: "Status is required",
      BOARD_ID_REQUIRED: "Board Id required",
    },
    INFO: {
      NO_BOARDS_FOUND: "No boards found",
      NO_COLLABORATORS_FOUND: "No collaborators found",
    },
  },

  // Task Management
  TASK: {
    SUCCESS: {
      CREATED_SUCCESSFULLY: "Task created successfully",
      UPDATED_SUCCESSFULLY: "Task updated successfully",
      DELETED_SUCCESSFULLY: "Task deleted",
      ASSIGNED_SUCCESSFULLY: "Task assigned successfully",
      STATUS_CHANGED: "Task status updated successfully",
    },
    ERROR: {
      NOT_FOUND: "Task not found",
      CREATION_FAILED: "Failed to create task",
      UPDATE_FAILED: "Failed to update task",
      DELETE_FAILED: "Error in deleting task",
      ASSIGNMENT_FAILED: "Failed to assign task",
    },
    VALIDATION: {
      TASK_ID_REQUIRED: "TaskId is required",
      TASK_ID_REQUIRED_ALT: "Task Id required",
      BOARD_ID_REQUIRED: "boardId is required",
      BOARD_ID_REQUIRED_ALT: "Board Id required",
      TITLE_REQUIRED: "Task title is required",
      USER_ID_REQUIRED: "User Id required",
      TITLE_UNCHANGED: "Title unchanged",
    },
    INFO: {
      NO_TASKS_FOUND: "No tasks found",
    },
  },

  // Comment Management
  COMMENT: {
    SUCCESS: {
      CREATED_SUCCESSFULLY: "Comment created successfully",
      UPDATED_SUCCESSFULLY: "Comment updated successfully",
      DELETED_SUCCESSFULLY: "Comment deleted",
      FETCHED_SUCCESSFULLY: "Comments fetched successfully",
    },
    ERROR: {
      NOT_FOUND: "Comment not found",
      CREATION_FAILED: "Error in create comment",
      UPDATE_FAILED: "Failed to update comment",
      DELETE_FAILED: "Error in deleting comment",
      FETCH_FAILED: "Comments fetching failed",
      DUPLICATE_COMMENT: "Duplicate comment",
    },
    VALIDATION: {
      TASK_ID_REQUIRED: "Task Id is required",
      TASK_ID_REQUIRED_ALT: "Task Id required",
      COMMENT_ID_REQUIRED: "Comment Id is required",
      COMMENT_ID_REQUIRED_ALT: "Comment Id required",
      USER_ID_REQUIRED: "User Id required",
      CONTENT_REQUIRED: "Comment content is required",
    },
    INFO: {
      NO_COMMENTS_FOUND: "No comments found",
    },
    GENERAL: {
      SOMETHING_WENT_WRONG: "Something went wrong",
    },
  },

  // Activity Management
  ACTIVITY: {
    SUCCESS: {
      FETCHED_SUCCESSFULLY: "Activities fetched successfully",
      LOGGED_SUCCESSFULLY: "Activity logged successfully",
    },
    ERROR: {
      FETCH_FAILED: "Something went wrong fetching activities",
      LOG_FAILED: "Failed to log activity",
    },
    VALIDATION: {
      TASK_ID_REQUIRED: "Task ID is required",
      BOARD_ID_REQUIRED: "Board ID is required",
      USER_ID_REQUIRED: "User ID is required",
    },
    INFO: {
      NO_ACTIVITY_FOUND: "No activity found",
    },
  },

  // User Management
  USER: {
    SUCCESS: {
      PROFILE_UPDATED: "Profile updated successfully",
      USER_FOUND: "User found successfully",
    },
    ERROR: {
      NOT_FOUND: "User not found",
      UPDATE_FAILED: "Failed to update user profile",
      FETCH_FAILED: "Failed to fetch user data",
    },
    VALIDATION: {
      USER_ID_REQUIRED: "User ID is required",
      EMAIL_REQUIRED: "Email is required",
      NAME_REQUIRED: "Name is required",
    },
  },

  // Database Operations
  DATABASE: {
    SUCCESS: {
      CONNECTED: "Database connected successfully",
      OPERATION_SUCCESS: "Database operation completed successfully",
    },
    ERROR: {
      CONNECTION_FAILED: "Database connection failed",
      OPERATION_FAILED: "Database operation failed",
      INVALID_OBJECT_ID: "Invalid ObjectId format",
    },
  },

  // Email & Notifications
  EMAIL: {
    SUCCESS: {
      SENT_SUCCESSFULLY: "Email sent successfully",
      INVITATION_SENT: "Invitation sent successfully",
    },
    ERROR: {
      SEND_FAILED: "Failed to send email",
      INVITATION_FAILED: "Failed to send invitation",
      INVALID_EMAIL: "Invalid email address",
    },
    TEMPLATES: {
      COLLABORATOR_INVITE: {
        SUBJECT: "You've been invited to collaborate on a board",
        GREETING: "Hello",
        INVITATION_TEXT:
          "You have been invited to collaborate on a board in TrelloLite.",
        FEATURES_INTRO: "With TrelloLite, you can:",
        FEATURES: [
          "View and organize tasks in a clean Kanban interface",
          "Add new tasks and update existing ones",
          "Comment on tasks and collaborate with team members",
          "Monitor project progress in real-time",
        ],
        CTA: "Start collaborating now by logging into your account.",
        FOOTER: "Best regards,<br>The TrelloLite Team",
      },
    },
  },

  // Activity Types & Descriptions
  ACTIVITY_TYPES: {
    TASK: {
      CREATED: "created task",
      UPDATED: "updated task",
      DELETED: "deleted task",
      ASSIGNED: "assigned task",
      COMPLETED: "completed task",
      MOVED: "moved task",
    },
    BOARD: {
      CREATED: "created board",
      UPDATED: "updated board",
      DELETED: "deleted board",
      SHARED: "shared board",
    },
    COMMENT: {
      ADDED: "added comment",
      UPDATED: "updated comment",
      DELETED: "deleted comment",
    },
    COLLABORATION: {
      INVITED: "invited collaborator",
      JOINED: "joined board",
      LEFT: "left board",
    },
  },

  // General System Messages
  SYSTEM: {
    SUCCESS: {
      OPERATION_COMPLETED: "Operation completed successfully",
    },
    ERROR: {
      INTERNAL_ERROR: "Internal server error",
      SERVICE_UNAVAILABLE: "Service temporarily unavailable",
      INVALID_REQUEST: "Invalid request format",
      RESOURCE_NOT_FOUND: "Requested resource not found",
    },
    VALIDATION: {
      REQUIRED_FIELD_MISSING: "Required field is missing",
      INVALID_FORMAT: "Invalid data format",
      INVALID_PARAMETERS: "Invalid parameters provided",
    },
  },
};
