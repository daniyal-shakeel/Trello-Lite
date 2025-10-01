import "./NavbarSkeleton.css"
const NavbarSkeleton = () => {
  return (
    <nav className="navbar-skeleton">
      <div className="navbar-left">
        <div className="skeleton skeleton-logo"></div>
        <div className="skeleton skeleton-nav-item"></div>
      </div>
      <div className="navbar-right">
        <div className="skeleton skeleton-button"></div>
      </div>
    </nav>
  );
};

export default NavbarSkeleton;
