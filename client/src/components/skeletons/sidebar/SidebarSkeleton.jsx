import "./SidebarSkeleton.css"

const SidebarSkeleton = () => {
  return (
    <div className="sidebar-skeleton">
      {/* Header Section */}
      <div className="sidebar-skeleton__header">
        <div className="skeleton skeleton-logo"></div>
        <div className="skeleton skeleton-header-text"></div>
      </div>

      {/* Menu Items */}
      <div className="sidebar-skeleton__menu">
        <div className="skeleton skeleton-menu-item"></div>
        <div className="skeleton skeleton-menu-item"></div>
        <div className="skeleton skeleton-menu-item"></div>
        <div className="skeleton skeleton-menu-item"></div>
      </div>
    </div>
  );
};

export default SidebarSkeleton;