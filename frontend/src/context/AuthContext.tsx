import { createContext, useState, type Dispatch, type ReactNode } from "react";

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: Dispatch<React.SetStateAction<string | null>>;
}

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  setAccessToken: () => {},
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }} >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider };