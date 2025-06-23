const getBaseUrl = () =>
  process.env.NODE_ENV === "production"
    ? "https://code-editor-backend-one.vercel.app"
    : "http://localhost:3001";

export const API_ROUTES = {
  AUTH_USER: `${getBaseUrl()}/api/auth/whoami`,
};

export const RoleEnum = ["leader", "co_leader", "member"] as const;

export const ROUTES = {
  ROOT: "/",
  AUTH: "/auth",
  SIGN_IN: "/auth/sign-in",
  SIGN_UP: "/auth/sign-up",
  DASHBOARD: "/dashboard",
  DB_SYNC_ERROR: "/db-sync-error",
};

// Typing sentences
export const SENTENCES = [
  "Pay off debt and stay out for good",
  "Save more money without feeling restricted",
  "Have money saved for next month",
  "Feel confident with an irregular income",
  "Feel organized about my finances",
  "Be less stressed about money",
  "Stop arguing about money with my partner",
];

export const STATUS = {
  ONLINE: "online",
  OFFLINE: "offline",
  BACK_ONLINE: "back-online",
} as const;

export const FEEDBACK_MSG = {
  [STATUS.OFFLINE]: "Opps! You are offline.",
  [STATUS.BACK_ONLINE]: "You're back online!",
} as const;

export const COLORS = {
  bg: "#161616",
  fg: "#fff",
  neonGreen: "#39FF14",
  neonMagenta: "#FF1AFF",
  neonBlue: "#1AE0FF",
  gray: "#222",
  border: "#fff",
  inactive: "#4B4B4B",
} as const;
