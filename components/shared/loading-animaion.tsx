"use client";
import Lottie from "lottie-react";
import loading from "@/public/animation/loading.json";
export function LoadingAnimation() {
  const style = {
    height: 100,
  };
  return <Lottie animationData={loading} loop={true} style={style} />;
}
