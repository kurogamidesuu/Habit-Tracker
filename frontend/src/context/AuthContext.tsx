import { createContext, useEffect, useState, type Dispatch, type ReactNode } from "react";

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: Dispatch<React.SetStateAction<string | null>>;
  isAuthLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  setAccessToken: () => {},
  isAuthLoading: true,
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });

        const data = await res.json();
        if(data.success && data.token) {
          setAccessToken(data.token);
        }
      } catch (e) {
        console.error("Silent refresh failed on app boot:", e);
      } finally {
        setIsAuthLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, isAuthLoading }} >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider };