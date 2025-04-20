import { useEffect, useState } from "react";
import { DOMAIN } from "../config";

export function useAuth() {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isLoading: true,
    userId: null,
  });

  const refreshToken = async () => {
    try {
      const res = await fetch(`${DOMAIN}/api/auth/refresh-token`, {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setAuthState({
          isAuthenticated: data.authenticated,
          userId: data.userId,
          isLoading: false,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication status...");
        const res = await fetch(`${DOMAIN}/api/auth/status`, {
          credentials: "include",
        });

        console.log("Auth status response:", res.status);

        if (res.ok) {
          const data = await res.json();
          console.log("Auth data received:", data);
          setAuthState({
            isAuthenticated: data.authenticated,
            userId: data.userId,
            isLoading: false,
          });
        } else {
          // Try to refresh the token if status check fails
          const refreshed = await refreshToken();
          if (!refreshed) {
            setAuthState({
              isAuthenticated: false,
              userId: null,
              isLoading: false,
            });
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setAuthState({
          isAuthenticated: false,
          userId: null,
          isLoading: false,
        });
      }
    };

    checkAuth();

    // Set up periodic token refresh (every hour)
    const refreshInterval = setInterval(() => {
      refreshToken();
    }, 3600000); // 1 hour in milliseconds

    return () => clearInterval(refreshInterval);
  }, []);

  return authState;
}
