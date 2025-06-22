import DashboardContent from "@/components/dashboard/dashboard-content";
import DBSyncErrorPage from "../DB-sync-error";
import { ROUTES } from "@/lib/constants";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { verifyUserInDB } from "@/lib/utils/verifyUserInDB";
import ClientSideRetry from "@/components/dashboard/ClientSideRetry";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect(ROUTES.AUTH);

  try {
    const user = await verifyUserInDB();

    if (user) {
      return <DashboardContent user={user} />;
    }

    return <ClientSideRetry />;
  } catch {
    return <DBSyncErrorPage message="An unknown error occurred" />;
  }
}
