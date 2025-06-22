import { SkeletonCard } from "@/components/shared/skeleton-card";
import { ROUTES } from "@/lib/constants";
import { SignUp } from "@clerk/nextjs";

const signUpPath = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? ROUTES.SIGN_UP;
const signInUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? ROUTES.SIGN_IN;
const redirectUrl =
  process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL ?? ROUTES.DASHBOARD;

export default function SignUpPage() {
  return (
    <main className="flex items-center justify-center min-h-screen p-4 bg-background">
      <SignUp
        path={signUpPath}
        routing="path"
        signInUrl={signInUrl}
        forceRedirectUrl={redirectUrl}
        fallback={<SkeletonCard />}
      />
    </main>
  );
}
