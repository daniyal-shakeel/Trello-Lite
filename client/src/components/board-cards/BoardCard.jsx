import Task from "../task/Task";
import "./BoardCard.css";

const Board = ({ status= "To Do", tasks = [] }) => {
  const filteredTasks = tasks.filter((task) => task.status === status);

  return (
    <div id="board" className="board">
      {/* Header */}
      <div className="board__header">
        <h1 className="board__status">{status}</h1>
        <p className="board__count">{filteredTasks.length}</p>
      </div>

      {/* Tasks */}
      <div className="board__tasks">
        {filteredTasks.map((task) => (
          <Task
            key={task._id}
            title={task?.title}
            description={task?.description}
            avatar={task?.avatar}
            name={task?.name}
            time={task?.time}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;