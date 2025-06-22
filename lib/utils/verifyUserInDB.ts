import { cookies } from "next/headers";
import { API_ROUTES } from "@/lib/constants";
import { User } from "@/types/user";

export async function verifyUserInDB(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const res = await fetch(API_ROUTES.AUTH_USER, {
      headers: {
        Cookie: cookieHeader,
      },
    });

    const result = await res.json();

    if (!res.ok) {
      const message = result?.message || "Failed to verify user in DB";
      throw new Error(message);
    }

    if (!result?.data) return null;

    return result.data;
  } catch (error) {
    throw new Error(
      (error as Error)?.message || "Unknown error verifying user in DB"
    );
  }
}
