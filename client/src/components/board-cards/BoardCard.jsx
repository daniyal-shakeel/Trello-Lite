import Task from "../task/Task";
import "./BoardCard.css";
import BoardCardSkeleton from "../skeletons/board-card/BoardCardSkeleton";

const BoardCard = ({ status = "To Do", tasks = [], taskLoading }) => {
  const filteredTasks = tasks.filter((task) => task.status === status);
  if (taskLoading) {
    const skeletonCount = 3;
    return (
      <div id="board" className="board">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <BoardCardSkeleton key={i} />
        ))}
      </div>
    );
  }
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
            color={task?.color}
          />
        ))}
      </div>
    </div>
  );
};

export default BoardCard;
