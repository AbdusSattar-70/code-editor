import { SkeletonCard } from "@/components/shared/skeleton-card";
import { ROUTES } from "@/lib/constants";
import { SignIn } from "@clerk/nextjs";
const signInPath = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? ROUTES.SIGN_IN;
const signUpUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? ROUTES.SIGN_UP;
const redirectUrl =
  process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL ?? ROUTES.DASHBOARD;

export default function SignInPage() {
  return (
    <main className="flex items-center justify-center min-h-screen p-4 bg-background">
      <SignIn
        path={signInPath}
        routing="path"
        signUpUrl={signUpUrl}
        forceRedirectUrl={redirectUrl}
        fallback={<SkeletonCard />}
      />
    </main>
  );
}
