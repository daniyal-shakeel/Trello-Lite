import "./ActivityComponentSkeleton.scss";

const ActivityComponentSkeleton = () => {
  return (
    <div className="activity-skeleton">
      <div className="activity-avatar-skeleton"></div>

      <div className="activity-content-skeleton">
        <div className="activity-line-skeleton short"></div>
        <div className="activity-line-skeleton medium"></div>
        <div className="activity-line-skeleton long"></div>
      </div>

      <div className="activity-time-skeleton"></div>
    </div>
  );
};

export default ActivityComponentSkeleton;
