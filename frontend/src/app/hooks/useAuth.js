import { useEffect, useState } from "react";
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
          const errorData = await res.json();
          console.error("Auth error:", errorData);
          setAuthState({
            isAuthenticated: false,
            userId: null,
            isLoading: false,
          });
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
  }, []);

  return authState;
}
