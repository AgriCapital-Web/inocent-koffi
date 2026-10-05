import { Navigate } from "react-router-dom";
export default function LegacyPageRedirect() {
  return <Navigate to="/contact" replace />;
}
