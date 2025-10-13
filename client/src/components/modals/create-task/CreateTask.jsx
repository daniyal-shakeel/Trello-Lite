import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import "./CreateTask.css";
import Message from "../../../components/ui/message/Message";
import { getApiUri } from "../../../utils/getUri";

const CreateTask = ({ onClose, boards, activeBoard, tasks, setTasks }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignTo, setAssignTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [board, setBoard] = useState("");
  const [activeBoardData, setActiveBoardData] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const getBoard = async () => {
    if (!activeBoard) return;
    try {
      const res = await axios.get(
        getApiUri(`/api/board/get-board/${activeBoard}`),
        { withCredentials: true }
      );

      if (res.data.success) {
        setActiveBoardData(res.data);
        setBoard(res.data.board?.name || "");
      } else {
        console.error(res.data.message);
      }
    } catch (err) {
      console.error("Error fetching board:", err.message);
      setMessage({ type: "failure", text: err.message });
    }
  };

  useEffect(() => {
    getBoard();
  }, [activeBoard]);

  const resolveDueDate = (value) => {
    switch (value) {
      case "today":
        return moment().format("YYYY-MM-DD");
      case "tomorrow":
        return moment().add(1, "days").format("YYYY-MM-DD");
      case "3days":
        return moment().add(3, "days").format("YYYY-MM-DD");
      case "1week":
        return moment().add(7, "days").format("YYYY-MM-DD");
      case "2weeks":
        return moment().add(14, "days").format("YYYY-MM-DD");
      default:
        return "";
    }
  };

  const getTaskData = () => {
    return {
      title,
      description,
      assignTo,
      board: {
        id: activeBoard,
        name: board,
      },
      dueDate: resolveDueDate(dueDate),
    };
  };

  const addTask = async () => {
    const task = getTaskData();
    try {
      const res = await axios.post(getApiUri("/api/task/create"), task, {
        withCredentials: true,
      });

      if (res.data.success) {
        setMessage({ type: "success", text: "Task created successfully!" });
        setTasks((prev) => [...prev, res.data.task]);
        setTitle("");
        setDescription("");
        setAssignTo("");
        setDueDate("");
      } else {
        setMessage({
          type: "failure",
          text: res.data.message || "Failed to create task.",
        });
      }
    } catch (err) {
      console.error("Error in CreateTask function: ", err.message);
      setMessage({
        type: "failure",
        text: "Something went wrong. Please try again.",
      });
    }
  };
  return (
    <div className="task-modal" id="task-modal">
      <div className="task-modal__container" id="task-modal-container">
        <div className="task-modal__header" id="task-modal-header">
          <h2 className="task-modal__title" id="task-modal-title">
            Add New Task
          </h2>
          <button
            className="task-modal__close"
            id="task-modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="task-modal__body" id="task-modal-body">
          {message.text && <Message type={message.type} text={message.text} />}

          <div className="task-modal__field">
            <label className="task-modal__label" htmlFor="task-title-input">
              Task Title
            </label>
            <input
              type="text"
              id="task-title-input"
              className="task-modal__input"
              placeholder="Enter task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="task-modal__field">
            <label
              className="task-modal__label"
              htmlFor="task-description-input"
            >
              Description
            </label>
            <textarea
              id="task-description-input"
              className="task-modal__textarea"
              placeholder="Enter task description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="task-modal__field">
            <label className="task-modal__label" htmlFor="task-due-date-select">
              Due Date
            </label>
            <select
              id="task-due-date-select"
              className="task-modal__select"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            >
              <option value="">-- Select due date --</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="3days">In 3 Days</option>
              <option value="1week">In 1 Week</option>
              <option value="2weeks">In 2 Weeks</option>
              <option disabled value="custom">
                Custom...
              </option>
            </select>
          </div>

          <div className="task-modal__field">
            <label className="task-modal__label" htmlFor="task-assignee-select">
              Assign To
            </label>
            <select
              id="task-assignee-select"
              className="task-modal__select"
              value={assignTo}
              onChange={(e) => setAssignTo(e.target.value)}
            >
              <option value="">-- Select user --</option>
              {activeBoardData?.collaborators?.map((c) => (
                <option key={c.userId} value={c.userId}>
                  {c.name} ({c.email})
                </option>
              ))}
            </select>
          </div>

          <div className="task-modal__field">
            <label className="task-modal__label" htmlFor="task-board-input">
              This Task Belongs To Board
            </label>
            <input
              type="text"
              id="task-board-input"
              className="task-modal__input"
              value={board || "Loading board..."}
              disabled
            />
          </div>
        </div>

        <div className="task-modal__footer">
          <button
            className="task-modal__btn task-modal__btn--cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="task-modal__btn task-modal__btn--create"
            onClick={addTask}
            disabled={!title || !description || !board}
          >
            + Create Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;
