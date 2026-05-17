import { Navigate } from "react-router-dom";
import { ROUTES } from "../../constants";
import { isReceptionistSession, readAuthSession } from "../../utils/auth";

const ReceptionistRouteGuard = ({ children }) => {
  const session = readAuthSession();
  if (!session?.accessToken || !isReceptionistSession(session)) {
    return <Navigate to={ROUTES.RECEPTIONIST_LOGIN} replace />;
  }

  return children;
};

export default ReceptionistRouteGuard;

