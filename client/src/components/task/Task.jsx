import { useEffect, useState } from "react";
import "./Task.css";
import OpenTask from "../modals/open-task/OpenTask";
import ModalPortal from "../modals/modal-portal/ModalPortal"

const Task = ({
  task,
  setTasks = () => {
    console.log("Something went wrong at BoardCard.jsx");
  },
}) => {
  useEffect(() => console.log(task));
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div onClick={() => setIsModalOpen(true)} id="task" className="task">
      <div className="task__header">
        <span className="task__title">{task?.title || "..."}</span>
      </div>
      <p className="task__description">{task?.description || "..."}</p>

      <div className="task__footer">
        <div className="task__user">
          <div className="task__avatar">
            {task.assignee?.name ? task.assignee.name[0].toUpperCase() : "U"}
          </div>
          <h2 className="task__user-name">
            {task.assignee?.name || "Unassigned"}
          </h2>
        </div>
        <p className="task__time">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </p>
      </div>

      {isModalOpen && (
        <ModalPortal>
          <OpenTask
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            task={task}
            setTasks={setTasks}
          />
        </ModalPortal>
      )}
    </div>
  );
};

export default Task;
