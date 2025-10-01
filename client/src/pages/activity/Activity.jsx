import React from "react"
import "./Activity.css"
import {activities} from "../../assets/data/activity.js"

const ActivityLog = () => {

  const [filterUser, setFilterUser] = React.useState("all")
  const [filterTask, setFilterTask] = React.useState("all")
  const [filterDate, setFilterDate] = React.useState("all")
  const [searchQuery, setSearchQuery] = React.useState("")

  // Get unique users and tasks
  const uniqueUsers = [...new Set(activities.map((a) => a.actor))]
  const uniqueTargets = [...new Set(activities.map((a) => a.target))]

  // Reset all filters
  const resetFilters = () => {
    setFilterUser("all")
    setFilterTask("all")
    setFilterDate("all")
    setSearchQuery("")
  }

  // Check if any filter is active
  const hasActiveFilters =
    filterUser !== "all" ||
    filterTask !== "all" ||
    filterDate !== "all" ||
    searchQuery.trim() !== ""

  // Filter activities
  const filteredActivities = React.useMemo(() => {
    let filtered = activities

    // Filter by user
    if (filterUser !== "all") {
      filtered = filtered.filter((a) => a.actor === filterUser)
    }

    // Filter by task
    if (filterTask !== "all") {
      filtered = filtered.filter((a) => a.target === filterTask)
    }

    // Filter by date
    if (filterDate !== "all") {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      
      filtered = filtered.filter((a) => {
        const activityDate = new Date(a.occurredAt)
        
        if (filterDate === "today") {
          return activityDate >= today
        } else if (filterDate === "week") {
          const weekAgo = new Date(today)
          weekAgo.setDate(weekAgo.getDate() - 7)
          return activityDate >= weekAgo
        } else if (filterDate === "month") {
          const monthAgo = new Date(today)
          monthAgo.setMonth(monthAgo.getMonth() - 1)
          return activityDate >= monthAgo
        }
        return true
      })
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (a) =>
          a.actor.toLowerCase().includes(query) ||
          a.action.toLowerCase().includes(query) ||
          a.target.toLowerCase().includes(query) ||
          a.details.toLowerCase().includes(query) ||
          (a.board && a.board.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [activities, filterUser, filterTask, filterDate, searchQuery])

  // Format timestamp
  const formatTime = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Get initials
  const getInitials = (name) => {
    const parts = name.split(" ")
    return parts.map((p) => p[0]).join("").toUpperCase().slice(0, 2)
  }

  return (
    <section className="activity-log">
      <h2 className="activity-log__title">Activity Log</h2>

      {/* Toolbar */}
      <div className="activity-log__toolbar">
        {/* Filters */}
        <div className="activity-log__filters">
          <div className="activity-log__filter">
            <label htmlFor="filter-user" className="activity-log__filter-label">
              Filter by User
            </label>
            <select
              id="filter-user"
              className="activity-log__filter-select"
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
            >
              <option value="all">All Users</option>
              {uniqueUsers.map((user) => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </select>
          </div>

          <div className="activity-log__filter">
            <label htmlFor="filter-task" className="activity-log__filter-label">
              Filter by Task
            </label>
            <select
              id="filter-task"
              className="activity-log__filter-select"
              value={filterTask}
              onChange={(e) => setFilterTask(e.target.value)}
            >
              <option value="all">All Tasks</option>
              {uniqueTargets.map((target) => (
                <option key={target} value={target}>
                  {target}
                </option>
              ))}
            </select>
          </div>

          <div className="activity-log__filter">
            <label htmlFor="filter-date" className="activity-log__filter-label">
              Filter by Date
            </label>
            <select
              id="filter-date"
              className="activity-log__filter-select"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        {/* Search and Reset */}
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
              placeholder="Search activity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {hasActiveFilters && (
            <button
              className="activity-log__reset-btn"
              onClick={resetFilters}
              title="Reset all filters"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Activity List */}
      <ul className="activity-log__list">
        {filteredActivities.length === 0 ? (
          <li className="activity-log__empty">No activities found</li>
        ) : (
          filteredActivities.map((item) => (
            <li key={item.id} className="activity-log__row">
              <div className="activity-row">
                <div className="activity-row__avatar">
                  {item.avatarUrl ? (
                    <img
                      src={item.avatarUrl}
                      alt={`${item.actor}'s avatar`}
                      className="activity-row__avatar-img"
                    />
                  ) : (
                    <div className="activity-row__avatar-initials">
                      {getInitials(item.actor)}
                    </div>
                  )}
                </div>
                <div className="activity-row__content">
                  <div className="activity-row__main">
                    <span className="activity-row__actor">{item.actor}</span>{" "}
                    <span className="activity-row__action">{item.action}</span>{" "}
                    <span className="activity-row__target">{item.target}</span>
                  </div>
                  <div className="activity-row__meta">
                    {item.board && (
                      <span className="activity-row__board">
                        Board: {item.board}
                      </span>
                    )}
                    {item.details && (
                      <span className="activity-row__details">
                        {item.details}
                      </span>
                    )}
                  </div>
                </div>
                <time className="activity-row__time" dateTime={item.occurredAt}>
                  {formatTime(item.occurredAt)}
                </time>
              </div>
            </li>
          ))
        )}
      </ul>
    </section>
  )
}

export default ActivityLog;