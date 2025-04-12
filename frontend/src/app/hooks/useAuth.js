import { useState, useEffect } from "react";
import { DOMAIN } from "../config";

export function useAuth() {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isLoading: true,
    userId: null,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${DOMAIN}/api/auth/status`, {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setAuthState({
            isAuthenticated: data.authenticated,
            userId: data.userId,
            isLoading: false,
          });
        } else {
          setAuthState({
            isAuthenticated: false,
            userId: null,
            isLoading: false,
          });
        }
      } catch (error) {
        setAuthState({
          isAuthenticated: false,
          userId: null,
          isLoading: false,
        });
      }
    };

    checkAuth();
  }, []);

  return authState;
}
