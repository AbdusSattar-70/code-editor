import { FC, ReactNode } from "react";
import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Loader2Icon } from "lucide-react";

export const ClerkLoadingButton: FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <ClerkLoading>
        <button
          disabled
          type="button"
          aria-busy="true"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
        >
          <Loader2Icon
            className="animate-spin ml-2 h-4 w-4"
            aria-hidden="true"
          />
          <span className="ml-2">Loading...</span>
        </button>
      </ClerkLoading>

      <ClerkLoaded>{children}</ClerkLoaded>
    </>
  );
};
