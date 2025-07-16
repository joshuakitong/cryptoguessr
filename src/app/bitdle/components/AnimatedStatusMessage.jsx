import { useEffect, useState, useRef } from "react";

export default function StatusMessage({ displayStatusMessage }) {
  const [visibleMessage, setVisibleMessage] = useState(displayStatusMessage);
  const [animate, setAnimate] = useState(false);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      setVisibleMessage(displayStatusMessage);
      firstRender.current = false;
      return;
    }

    if (displayStatusMessage !== visibleMessage) {
      setVisibleMessage(displayStatusMessage);
      setAnimate(true);

      const timeout = setTimeout(() => {
        setAnimate(false);
      }, 500);

      return () => clearTimeout(timeout);
    }
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
