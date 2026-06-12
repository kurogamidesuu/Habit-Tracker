import { useNavigate, useSearchParams } from "react-router-dom"
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAccessToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      navigate('/login');
      return;
    }

    setAccessToken(token);
    navigate('/');
  }, [navigate, searchParams, setAccessToken]);

  return (
    <div className="h-screen w-full bg-sky-950 flex items-center justify-center gap-2">
      <div className="h-5 w-5 border-3 border-sky-50 rounded-full animate-spin" />
      <p className="text-sky-100">Logging you in...</p>
    </div>
  )
}

export default AuthCallback