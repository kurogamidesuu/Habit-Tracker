import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children }: Readonly<{ children: ReactNode }>) => {
  const { accessToken, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <div className="h-screen w-full bg-sky-950 flex items-center justify-center text-sky-100 font-medium">
        Loading Kintsugi...
      </div>
    );
  }

  if (!accessToken) {
    return <Navigate to='/login' replace />;
  }

  return children;
}

export default ProtectedRoute