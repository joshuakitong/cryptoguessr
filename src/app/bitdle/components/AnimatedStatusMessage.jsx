import { useEffect, useState } from "react";

export default function StatusMessage({ displayStatusMessage }) {
  const [visibleMessage, setVisibleMessage] = useState("");
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (!displayStatusMessage) return;

    setVisibleMessage(displayStatusMessage);
    setAnimate(true);

    const timeout = setTimeout(() => setAnimate(false), 500);

    return () => clearTimeout(timeout);
  }, [displayStatusMessage]);

  return (
    <div
      className={`mt-4 text-md sm:text-lg text-center ${
        animate ? "animate-fade-in-out" : ""
      }`}
    >
      {visibleMessage}
    </div>
  );
}