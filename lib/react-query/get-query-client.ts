import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

export const getQueryClient = cache(() => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
      },
    },
  });
});
