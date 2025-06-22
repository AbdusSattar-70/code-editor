"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface DBSyncErrorPageProps {
  message?: string;
}

export default function DBSyncErrorPage({ message }: DBSyncErrorPageProps) {
  const router = useRouter();
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryFailed, setRetryFailed] = useState(false);
  const [problem, setProblem] = useState("");

  const handleRetry = async () => {
    try {
      setIsRetrying(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.refresh();
      setTimeout(() => {
        setIsRetrying(false);
        setRetryFailed(true);
      }, 3000);
    } catch {
      setIsRetrying(false);
      setRetryFailed(true);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 text-destructive">
        <AlertTriangle className="mx-auto mb-2 h-10 w-10" />
        <h2 className="text-xl font-semibold">
          Something went wrong with the database sync.
        </h2>
      </div>

      {message && (
        <p className="mb-6 max-w-md text-sm text-muted-foreground">{message}</p>
      )}

      <div className="flex items-center gap-3">
        {!retryFailed ? (
          <Button
            onClick={handleRetry}
            variant="outline"
            disabled={isRetrying}
            className="cursor-pointer"
          >
            {isRetrying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Retrying...
              </>
            ) : (
              "Retry"
            )}
          </Button>
        ) : (
          <Button variant="outline" onClick={() => router.push("/")}>
            Go Home
          </Button>
        )}

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="cursor-pointer">
              Contact Support
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Contact Support</DialogTitle>
            </DialogHeader>
            <Textarea
              placeholder="Describe the problem you're facing..."
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              className="min-h-[120px]"
            />
            <DialogFooter>
              <Button variant="outline" disabled={!problem.trim()} asChild>
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=a90.sattar@gmail.com&su=DB Sync Issue&body=${encodeURIComponent(
                    problem
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Send Email
                </a>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
