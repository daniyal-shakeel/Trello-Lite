import "./Activity.scss";
import moment from "moment";

const Activity = ({ avatar, name, action, time, activityResponses }) => {
  const readableAction =
    (activityResponses && activityResponses[action]) ||
    action.replace(/_/g, " ");

  return (
    <div className="activity-item">
      <div className="comment-avatar">{avatar}</div>
      <div className="activity-content">
        <p className="activity-text">
          <span className="activity-name">
            {name
              ? name.charAt(0).toUpperCase() + name.slice(1)
              : "Unknown User"}
            :
          </span>{" "}
          {readableAction}
        </p>
        <span className="activity-time">
          {time ? moment(time).fromNow() : "some time ago"}
        </span>
      </div>
    </div>
  );
};

export default Activity;
