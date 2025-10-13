import { useEffect, useState } from "react";
import "./Activity.scss";
import axios from "axios";
import { getApiUri } from "../../utils/getUri";
import moment from "moment";

const Activity = () => {
  const [activities, setActivities] = useState([]);
  const [logs, setLogs] = useState([]);

  const [filters, setFilters] = useState({
    user: "All Users",
    action: "All Actions",
    board: "All Boards",
    date: "All Time",
    search: "",
  });

  const getAllActivities = async () => {
    try {
      const res = await axios.get(getApiUri("/api/activity/getAllActivities"), {
        withCredentials: true,
      });
      if (res?.data?.success) {
        const fetched = res.data?.activities || [];
        setActivities(fetched);
        setLogs(fetched);
      } else {
        console.log(res?.data?.message || "Unknown error");
      }
    } catch (error) {
      console.log("An error occurred in getActivities:", error.message);
    }
  };

  useEffect(() => {
    getAllActivities();
  }, []);

  useEffect(() => {
    let filtered = [...activities];

    if (filters.user !== "All Users") {
      filtered = filtered.filter((a) => a.user === filters.user);
    }

    if (filters.action !== "All Actions") {
      filtered = filtered.filter(
        (a) => a.action.replace(/_/g, " ") === filters.action
      );
    }

    if (filters.board !== "All Boards") {
      filtered = filtered.filter((a) => a.board === filters.board);
    }

    if (filters.date !== "All Time") {
      const today = moment().startOf("day");
      if (filters.date === "Today") {
        filtered = filtered.filter((a) => moment(a.when).isSame(today, "d"));
      } else if (filters.date === "Yesterday") {
        filtered = filtered.filter((a) =>
          moment(a.when).isSame(today.clone().subtract(1, "day"), "d")
        );
      } else if (filters.date === "Last 7 Days") {
        filtered = filtered.filter((a) =>
          moment(a.when).isAfter(moment().subtract(7, "days"))
        );
      } else if (filters.date === "Last 30 Days") {
        filtered = filtered.filter((a) =>
          moment(a.when).isAfter(moment().subtract(30, "days"))
        );
      }
    }

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.user?.toLowerCase().includes(q) ||
          a.board?.toLowerCase().includes(q) ||
          a.action?.toLowerCase().includes(q) ||
          a.message?.toLowerCase().includes(q) ||
          a.task?.toLowerCase().includes(q)
      );
    }

    filtered.sort((a, b) => new Date(b.when) - new Date(a.when));

    setLogs(filtered);
  }, [filters, activities]);

  const formatTime = (iso) => {
    if (!iso) return "N/A";
    const date = moment(iso);
    if (!date.isValid()) return "Invalid Date";
    if (moment().diff(date, "days") < 7) return date.fromNow();
    return date.format("MMM D, YYYY");
  };

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "??";
    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getActionColor = (action) => {
    const colors = {
      created_task: "activity-row__action--created",
      updated_task: "activity-row__action--updated",
      deleted_task: "activity-row__action--deleted",
      created_board: "activity-row__action--created",
      updated_board: "activity-row__action--updated",
      deleted_board: "activity-row__action--deleted",
      change_board_status: "activity-row__action--status",
      added_collaborator: "activity-row__action--assigned",
      removed_collaborator: "activity-row__action--removed",
      created_comment: "activity-row__action--comment",
      updated_comment: "activity-row__action--comment-edit",
      deleted_comment: "activity-row__action--comment-del",
      assigned_task: "activity-row__action--assigned-task",
    };
    return colors[action] || "activity-row__action--default";
  };

  const renderMetadata = (activity) => {
    if (!activity) return null;
    const { message, task } = activity;
    if (message && task) return `Task: ${task} | ${message}`;
    if (message) return message;
    if (task) return `Task: ${task}`;
    return null;
  };

  const resetFilters = () => {
    setFilters({
      user: "All Users",
      action: "All Actions",
      board: "All Boards",
      date: "All Time",
      search: "",
    });
  };

  return (
    <section className="activity-log">
      <div className="activity-log__header">
        <h2 className="activity-log__title">Activity Log</h2>
        <div className="activity-log__stats">
          <div className="activity-stat">
            <span className="activity-stat__value">{logs.length}</span>
            <span className="activity-stat__label">Activities</span>
          </div>
        </div>
      </div>

      <div className="activity-log__toolbar">
        <div className="activity-log__filters">
          <div className="activity-log__filter">
            <label htmlFor="filter-user" className="activity-log__filter-label">
              User
            </label>
            <select
              id="filter-user"
              className="activity-log__filter-select"
              value={filters.user}
              onChange={(e) =>
                setFilters((f) => ({ ...f, user: e.target.value }))
              }
            >
              <option>All Users</option>
              {[...new Set(activities.map((a) => a.user || "Unknown"))].map(
                (u) => (
                  <option key={u}>{u}</option>
                )
              )}
            </select>
          </div>

          <div className="activity-log__filter">
            <label
              htmlFor="filter-action"
              className="activity-log__filter-label"
            >
              Action
            </label>
            <select
              id="filter-action"
              className="activity-log__filter-select"
              value={filters.action}
              onChange={(e) =>
                setFilters((f) => ({ ...f, action: e.target.value }))
              }
            >
              <option>All Actions</option>
              {[...new Set(activities.map((a) => a.action || "unknown"))].map(
                (act) => (
                  <option key={act}>{act.replace(/_/g, " ")}</option>
                )
              )}
            </select>
          </div>

          <div className="activity-log__filter">
            <label
              htmlFor="filter-board"
              className="activity-log__filter-label"
            >
              Board
            </label>
            <select
              id="filter-board"
              className="activity-log__filter-select"
              value={filters.board}
              onChange={(e) =>
                setFilters((f) => ({ ...f, board: e.target.value }))
              }
            >
              <option>All Boards</option>
              {[...new Set(activities.map((a) => a.board || "No Board"))].map(
                (b) => (
                  <option key={b}>{b}</option>
                )
              )}
            </select>
          </div>

          <div className="activity-log__filter">
            <label htmlFor="filter-date" className="activity-log__filter-label">
              Time Period
            </label>
            <select
              id="filter-date"
              className="activity-log__filter-select"
              value={filters.date}
              onChange={(e) =>
                setFilters((f) => ({ ...f, date: e.target.value }))
              }
            >
              <option>All Time</option>
              <option>Today</option>
              <option>Yesterday</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
        </div>

        <div className="activity-log__actions">
          <div className="activity-log__search">
            <label
              className="activity-log__search-label"
              htmlFor="activity-log-search"
            >
              Search
            </label>
            <input
              id="activity-log-search"
              className="activity-log__search-input"
              placeholder="Search activities..."
              type="search"
              value={filters.search}
              onChange={(e) =>
                setFilters((f) => ({ ...f, search: e.target.value }))
              }
            />
          </div>

          <button
            className="activity-log__reset-btn"
            title="Reset all filters"
            onClick={resetFilters}
          >
            Reset Filters
          </button>
        </div>
      </div>

      <ul className="activity-log__list">
        {logs.length === 0 && (
          <li className="activity-log__empty">No activities found.</li>
        )}
        {logs.map((item, i) => (
          <li key={item._id || i} className="activity-log__row">
            <div className="activity-row">
              <div className="activity-row__avatar">
                <div className="activity-row__avatar-initials">
                  {getInitials(item.user)}
                </div>
              </div>

              <div className="activity-row__content">
                <div className="activity-row__main">
                  <span className="activity-row__actor">
                    {item.user || "Unknown User"}
                  </span>
                  <span
                    className={`activity-row__action ${getActionColor(
                      item.action
                    )}`}
                  >
                    {(item.action || "unknown").replace(/_/g, " ")}
                  </span>
                  {item.board && (
                    <span className="activity-row__entity">{item.board}</span>
                  )}
                </div>

                <div className="activity-row__meta">
                  {renderMetadata(item) && (
                    <span className="activity-row__details">
                      {renderMetadata(item)}
                    </span>
                  )}
                </div>
              </div>

              <time className="activity-row__time" dateTime={item.when}>
                {formatTime(item.when)}
              </time>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Activity;
