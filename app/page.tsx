import { HeroVideo } from "@/components/shared/hero-video";
import LogoIcon from "@/components/shared/logo";
import { ROUTES } from "@/lib/constants";
import Link from "next/link";
import { ClerkLoadingButton } from "@/components/shared/clerk-loading-button";

export default function HomePage() {
  return (
    <div className="relative h-screen w-full bg-background text-foreground">
      <HeroVideo />
      <div className="absolute top-10 inset-x-0 z-30 text-center px-6 md:px-10 text-white max-w-3xl mx-auto transition-opacity duration-500">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4 drop-shadow-lg">
          How will you live your financial story?
        </h1>

        <div className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 drop-shadow-md">
          Create a friendly, flexible plan and spend it well with
          <span className="flex items-center justify-center gap-2 mt-2 text-white drop-shadow">
            <LogoIcon />
            <span className="text-xl font-bold bg-white bg-clip-text text-transparent">
              F-Ledger
            </span>
          </span>
        </div>
        <ClerkLoadingButton>
          <Link
            href={ROUTES.AUTH}
            className="px-5 py-2.5 text-lg font-medium text-white bg-blue-800 border border-blue-700 rounded-lg hover:bg-transparent hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:text-white dark:border-blue-500 dark:hover:bg-transparent dark:hover:text-blue-500 dark:focus:ring-blue-800 text-center"
          >
            Start Your Free Trial
          </Link>
        </ClerkLoadingButton>
      </div>
    </div>
  );
}
