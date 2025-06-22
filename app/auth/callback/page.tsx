import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function AuthCallbackPage() {
  return (
    <AuthenticateWithRedirectCallback
      signInForceRedirectUrl={
        process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL
      }
      signInFallbackRedirectUrl={
        process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL
      }
      signUpForceRedirectUrl={
        process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL
      }
      signUpFallbackRedirectUrl={
        process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL
      }
    />
  );
}
