import "./CommentsSkeleton.scss";

const CommentsSkeleton = () => {
  return (
    <div className="comment-skeleton">
      <div className="avatar-skeleton"></div>
      <div className="content-skeleton">
        <div className="line-skeleton short"></div>
        <div className="line-skeleton long"></div>
      </div>
    </div>
  );
};

export default CommentsSkeleton;
