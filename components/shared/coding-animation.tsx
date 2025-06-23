"use client";
import Lottie from "lottie-react";
import coding from "@/public/animation/coding.json";
export function CodingAnimation() {
  const style = {
    height: 200,
  };
  return <Lottie animationData={coding} loop={true} style={style} />;
}
