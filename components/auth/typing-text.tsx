"use client";
import { SENTENCES } from "@/lib/constants";
import { useEffect, useState } from "react";
import { GiPencil } from "react-icons/gi";

export function TypingText() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(true);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (typing) {
      if (text.length < SENTENCES[index].length) {
        timeout = setTimeout(() => {
          setText(SENTENCES[index].slice(0, text.length + 1));
          setCursorVisible(true);
        }, 200);
      } else {
        setCursorVisible(false);
        timeout = setTimeout(() => setTyping(false), 3000);
      }
    } else {
      if (text.length > 0) {
        timeout = setTimeout(() => {
          setText(text.slice(0, -1));
          setCursorVisible(false);
        }, 1);
      } else {
        setTyping(true);
        setIndex((prev) => (prev + 1) % SENTENCES.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [text, typing, index]);

  return (
    <div className="mt-4 text-[#d292ff]" aria-live="polite">
      {text}
      {cursorVisible && (
        <span className="pen-cursor">
          <GiPencil size={30} />
        </span>
      )}
    </div>
  );
}
