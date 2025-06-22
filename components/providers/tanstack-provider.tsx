"use client";

import { QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";
import { ReactNode } from "react";
import { getQueryClient } from "@/lib/react-query/get-query-client";

export function TanstackProviders({
  children,
  state,
}: {
  children: ReactNode;
  state?: unknown;
}) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={state}>{children}</HydrationBoundary>
    </QueryClientProvider>
  );
}
