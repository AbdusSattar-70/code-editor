import { API_ROUTES } from "@/lib/constants";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

export function useVerifiedUserInDB() {
  const { user } = useUser();

  const fetchUserData = async () => {
    if (!user) {
      throw new Error("User not authenticated by Clerk");
    }

    try {
      const response = await fetch(API_ROUTES.AUTH_USER, {
        credentials: "include",
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || "Failed to fetch user data from DB");
      }

      const { data } = await response.json();
      return data;
    } catch (err: unknown) {
      throw new Error(
        (err as Error)?.message || "An unexpected error occurred."
      );
    }
  };

  const {
    data: verifiedUserInDB,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["verifiedUserInDB", user?.id],
    queryFn: fetchUserData,
    enabled: !!user,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
  });

  return { verifiedUserInDB, isLoading, isError, error };
}
