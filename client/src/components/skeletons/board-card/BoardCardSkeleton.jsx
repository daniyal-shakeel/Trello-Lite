import "./BoardCardSkeleton.css"

const BoardCardSkeleton = () => {

  return (
    <div className="board-card-skeleton">
      <div className="card-header">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-subtitle"></div>
        <div className="skeleton skeleton-text"></div>
      </div>
      <div className="card-footer">
        <div className="card-footer-left">
          <div className="skeleton skeleton-avatar"></div>
          <div className="skeleton skeleton-name"></div>
        </div>
        <div className="skeleton skeleton-badge"></div>
      </div>
    </div>
  );
};

export default BoardCardSkeleton;