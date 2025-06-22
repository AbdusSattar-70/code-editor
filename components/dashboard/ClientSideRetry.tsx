"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ROUTES } from "@/lib/constants";
import { useVerifiedUserInDB } from "@/hooks/useVerifiedUserInDB";
import DBSyncErrorPage from "@/app/dashboard/DB-sync-error";
import Loading from "@/app/dashboard/loading";

export default function ClientSideRetry() {
  const router = useRouter();
  const { verifiedUserInDB, isLoading, isError, error } = useVerifiedUserInDB();

  useEffect(() => {
    if (verifiedUserInDB) {
      router.replace(ROUTES.DASHBOARD);
    }

    if (
      isError &&
      typeof error?.message === "string" &&
      error.message.toLowerCase().includes("unauthorized")
    ) {
      router.replace(ROUTES.AUTH);
    }
  }, [verifiedUserInDB, isError, error, router]);

  if (isLoading) return <Loading />;

  if (isError) {
    const isUnauthorized =
      typeof error?.message === "string" &&
      error.message.toLowerCase().includes("unauthorized");

    return (
      <DBSyncErrorPage
        message={
          isUnauthorized
            ? "unauthorized. Please log in again."
            : "Could not be verified in the database."
        }
      />
    );
  }

  return null;
}
