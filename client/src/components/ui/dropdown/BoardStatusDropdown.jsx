import "./BoardStatusDropdown.css";

const BoardStatusDropdown = ({
  title,
  statuses = [],
  activeStatus,
  onStatusChange,
}) => {
  const handleSelect = (status) => {
    onStatusChange(status);
  };

  return (
    <div className="board-status-dropdown">
      <div className="dropdown-menu">
        <div className="dropdown-header">{title}</div>
        {statuses.map((status) => (
          <div
            key={status}
            className={`dropdown-item ${
              activeStatus === status ? "active" : ""
            }`}
            onClick={() => handleSelect(status)}
          >
            {activeStatus === status && <span className="dot" />}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardStatusDropdown;
