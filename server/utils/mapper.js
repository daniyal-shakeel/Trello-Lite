export const mapComment = (comment, payload) => {
  console.log(comment);
  return {
    _id: comment._id,
    taskId: comment.taskId,
    avatar: comment.authorId?.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase(),
    name: comment.authorId?.name,
    time: "10 day ago",
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    text: comment.content,
    canEdit: String(comment.authorId._id) === String(payload._id),
  };
};
