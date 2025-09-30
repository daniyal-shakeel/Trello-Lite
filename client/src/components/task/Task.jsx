import "./Task.css";

const Task = ({
  title = "Demo task",
  description = "Demo description",
  avatar = "SM",
  name = "Sara Miller",
  time = "1 day ago",
}) => {
  return (
    <div id="task" className="task">
      {/* Task Content */}
      <h1 className="task__title">{title}</h1>
      <p className="task__description">{description}</p>

      {/* Footer */}
      <div className="task__footer">
        <div className="task__user">
          <div className="task__avatar">{avatar}</div>
          <h2 className="task__user-name">{name}</h2>
        </div>
        <p className="task__time">{time}</p>
      </div>
    </div>
  );
};

export default Task;
