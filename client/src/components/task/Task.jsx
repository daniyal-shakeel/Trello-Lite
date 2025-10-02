import { useEffect, useState } from "react";
import "./Task.css";
import OpenTask from "../modals/open-task/OpenTask";

const Task = ({
  title = "Demo task",
  description = "Demo description",
  avatar = "SM",
  name = "Sara Miller",
  time = "1 day ago",
  color = "#ff0b0bff",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div onClick={() => setIsModalOpen(true)} id="task" className="task">
      {/* Task Content */}
      <div className="task__header">
        <span className="task__title">{title}</span>{" "}
        <span
          style={{
            backgroundColor: color,
          }}
          className="task__title-flag"
        ></span>
      </div>
      <p className="task__description">{description}</p>

      {/* Footer */}
      <div className="task__footer">
        <div className="task__user">
          <div className="task__avatar">{avatar}</div>
          <h2 className="task__user-name">{name}</h2>
        </div>
        <p className="task__time">{time}</p>
      </div>

      {isModalOpen && (
        <OpenTask
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          task={[]}
        />
      )}
    </div>
  );
};

export default Task;
