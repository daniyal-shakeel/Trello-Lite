import "./DashboardSkeleton.css";

const DashboardSkeleton = () => {
  return (
    <div className="dashboard-skeleton">
      {}
      <aside className="ds-sidebar">
        {[...Array(4)].map((_, i) => (
          <div className="ds-logo skeleton"></div>
        ))}

        <div className="ds-menu">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="skeleton ds-menu-item"></div>
          ))}
        </div>
      </aside>

      {}
      <main className="ds-main">
        {}
        <div className="ds-header">
          <div className="skeleton ds-title"></div>
          <div className="skeleton ds-subtitle"></div>
        </div>

        {}
        <div className="ds-stats">
          {[...Array(4)].map((_, i) => (
            <div className="skeleton ds-stat-card"></div>
          ))}
        </div>

        {}
        <div className="ds-content">
          {[...Array(9)].map((_, i) => (
            <div className="skeleton ds-board"></div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DashboardSkeleton;
