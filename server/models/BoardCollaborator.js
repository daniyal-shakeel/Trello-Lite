const collaboratorSchema = new mongoose.Schema(
     {
          boardId: {
               type: mongoose.Schema.Types.ObjectId,
               ref: Board.modelName,
               required: true,
          },
          collaborator: {
               type: mongoose.Schema.Types.ObjectId,
               ref: User.modelName,
               required: true,
          },
     },
     { timestamps: true }
);

const BoardCollaborator =
     mongoose.models.BoardCollaborator ||
     mongoose.model("Board Collaborator", collaboratorSchema);