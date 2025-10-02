import { Navigate } from "react-router-dom";
import DashboardSkeleton from "../components/skeletons/dashboard/DashboardSkeleton";

const AuthRoute = ({ auth, children }) => {
  if (auth === null) return <DashboardSkeleton />;
  if (auth !== true) return <Navigate to="/login" />;
  return children;
};

export default AuthRoute;
