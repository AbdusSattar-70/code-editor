import { STATUS } from "@/lib/constants";

export type Status = (typeof STATUS)[keyof typeof STATUS];
export type Stats = {
  credits: number;
  minerals: number;
  energy: number;
};

export type Asteroid = {
  id: number;
  mineral: string;
  richness: number;
  tapped: boolean;
  color: string;
};

export type Bubble = {
  id: number;
  left: string;
  top: string;
  size: number;
  color: string;
  duration: number;
};
