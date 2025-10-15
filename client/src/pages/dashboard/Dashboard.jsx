import BoardCard from "../../components/board-cards/BoardCard";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import "./Dashboard.css";
import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import BoardCardSkeleton from "../../components/skeletons/board-card/BoardCardSkeleton";
import { getApiUri } from "../../utils/getUri";

import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  defaultAnimateLayoutChanges,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableBoardCard = ({
  board,
  activeBoard,
  tasks,
  setTasks,
  setBoards,
}) => {
  const animateLayoutChanges = (args) =>
    defaultAnimateLayoutChanges({ ...args, wasDragging: true });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: board._id,
    animateLayoutChanges,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms ease",
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 1000 : "auto",
    minWidth: "300px",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <BoardCard
        activeBoard={activeBoard}
        isShared={board.isShared}
        boardId={board._id}
        name={board.name}
        status={board.status}
        tasks={tasks.filter((task) => task.boardId === board._id)}
        setTasks={setTasks}
        loading={false}
        setBoards={setBoards}
        dragListeners={listeners}
      />
    </div>
  );
};

const Dashboard = ({ setAuth, user }) => {
  const [activeBoard, setActiveBoard] = useState(null);
  const [boardLoading, setBoardLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [boards, setBoards] = useState([]);
  const [activeStatus, setActiveStatus] = useState("active");

  const [activeId, setActiveId] = useState(null);
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }

    const oldIndex = filteredBoards.findIndex((b) => b._id === active.id);
    const newIndex = filteredBoards.findIndex((b) => b._id === over.id);
    const newOrder = arrayMove(filteredBoards, oldIndex, newIndex);
    setBoards(newOrder);
    setActiveBoard(newOrder[0]?._id);
    setActiveId(null);
  };

  useEffect(() => {
    if (boards.length > 0) {
      if (!activeBoard || !boards.find((b) => b._id === activeBoard)) {
        setActiveBoard(boards[0]._id);
      }
    } else {
      setActiveBoard(null);
    }
  }, [boards, activeBoard]);

  const filteredBoards = useMemo(() => {
    return boards.filter((board) => board.status === activeStatus);
  }, [boards, activeStatus]);

  useEffect(() => console.log(boards), [boards]);

  const handleBoardChange = (boardId) => {
    setActiveBoard(boardId);
  };

  const getAllBoards = async () => {
    setBoardLoading(true);
    try {
      const res = await axios.get(getApiUri("/api/board/get-all-boards"), {
        withCredentials: true,
      });

      if (res.data.success) {
        setBoards(res.data.boards || []);
      } else {
        console.error("Failed to fetch boards:", res.data.message);
        setBoards([]);
      }
    } catch (error) {
      console.error("An error occurred in getAllBoards:", error.message);
      setBoards([]);
    } finally {
      setBoardLoading(false);
    }
  };

  const getAllTasks = async () => {
    if (!activeBoard) return;
    try {
      const res = await axios.get(
        getApiUri(`/api/task/get-all-tasks/${activeBoard}`),
        { withCredentials: true }
      );

      if (res.data.success) {
        setTasks((prev) => {
          const existingIds = new Set(prev.map((t) => t._id));
          const newTasks = res.data.tasks.filter(
            (t) => !existingIds.has(t._id)
          );
          return [...prev, ...newTasks];
        });
      } else {
        console.error("Failed to fetch tasks:", res.data.message);
        setTasks([]);
      }
    } catch (error) {
      console.error("An error occurred in getAllTasks: ", error.message);
      setTasks([]);
    }
  };

  useEffect(() => {
    getAllBoards();
  }, []);

  useEffect(() => {
    if (activeBoard && activeBoard.length > 0) getAllTasks();
  }, [activeBoard]);

  useEffect(() => console.log("tasks", tasks), [tasks]);

  return (
    <div id="dashboard-layout" className="dashboard-layout">
      <Sidebar
        getAllBoards={getAllBoards}
        setAuth={setAuth}
        activeBoard={activeBoard}
        onBoardChange={handleBoardChange}
        boardLoading={boardLoading}
        boards={filteredBoards}
        user={user}
        setBoards={setBoards}
      />
      <div className="dashboard-main">
        <Navbar
          tasks={tasks}
          setTasks={setTasks}
          activeBoard={activeBoard}
          boards={boards}
          statuses={["active", "draft", "archived"]}
          activeStatus={activeStatus}
          onStatusChange={setActiveStatus}
        />
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {boardLoading ? (
            <div id="dashboard" className="dashboard">
              {[...Array(3)].map((_, i) => (
                <BoardCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <SortableContext
              items={filteredBoards.map((board) => board._id)}
              strategy={rectSortingStrategy}
            >
              <div id="dashboard" className="dashboard">
                {filteredBoards.length > 0 ? (
                  filteredBoards
                    .sort((a, b) =>
                      a._id === activeBoard ? -1 : b._id === activeBoard ? 1 : 0
                    )
                    .map((board) => (
                      <SortableBoardCard
                        key={board._id}
                        board={board}
                        activeBoard={activeBoard}
                        tasks={tasks}
                        setTasks={setTasks}
                        setBoards={setBoards}
                      />
                    ))
                ) : (
                  <p className="no-boards-message">No boards available</p>
                )}
              </div>
            </SortableContext>
          )}

          <DragOverlay adjustScale={true}>
            {activeId ? (
              <BoardCard
                {...filteredBoards.find((b) => b._id === activeId)}
                activeBoard={activeBoard}
                tasks={tasks.filter((t) => t.boardId === activeId)}
                setTasks={setTasks}
                setBoards={setBoards}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default Dashboard;
