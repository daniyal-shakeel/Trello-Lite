import {Navigate} from "react-router-dom"

const AuthRoute = ({ auth, children }) => {
  if (auth !== true) return <Navigate to="/login" />;
  if (auth === true) return children;
};

export default AuthRoute;
