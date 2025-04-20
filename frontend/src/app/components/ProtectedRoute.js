"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import LoadingDots from "./LoadingDots";

export function withAuth(Component, options = {}) {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const { redirectAuthenticatedTo, redirectUnauthenticatedTo } = options;

    useEffect(() => {
      if (!isLoading) {
        if (isAuthenticated && redirectAuthenticatedTo) {
          router.push(redirectAuthenticatedTo);
        } else if (!isAuthenticated && redirectUnauthenticatedTo) {
          router.push(redirectUnauthenticatedTo);
        }
      }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <LoadingDots />
            <p className="mt-4 text-gray-600">Checking authentication...</p>
          </div>
        </div>
      );
    }

    // If we're redirecting, don't render the component
    if (
      (isAuthenticated && redirectAuthenticatedTo) ||
      (!isAuthenticated && redirectUnauthenticatedTo)
    ) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <LoadingDots />
            <p className="mt-4 text-gray-600">Redirecting...</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
