import { Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "../../constants";
import { isAdminSession, readAuthSession } from "../../utils/auth";

const AdminRouteGuard = ({ children }) => {
  const location = useLocation();
  const session = readAuthSession();

  if (!session?.accessToken) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location.pathname }} />;
  }

  if (!isAdminSession(session)) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
};

export default AdminRouteGuard;
