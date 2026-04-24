import { Preferences } from "@capacitor/preferences";
import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: Readonly<{ children: ReactNode }>) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { value } = await Preferences.get({ key: 'habit-token' });

      if (value) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated == null) {
    return <div className="h-screen w-full bg-sky-200/70 flex items-center justify-center">Loading...</div>
  }

  if (isAuthenticated == false) {
    return <Navigate to='/login' replace />
  }

  return children;
}

export default ProtectedRoute