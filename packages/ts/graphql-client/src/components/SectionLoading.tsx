import { useEffect, useState } from "react";

import { FadeIn } from "./FadeIn";

export interface SectionLoadingProps {
  quotes?: string[];
  heading?: string;
  preMessage?: string;
  className?: string;
}

export function SectionLoading({
  quotes = [],
  heading,
  preMessage,
  className = "",
}: SectionLoadingProps) {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((i) => (i + 1) % quotes.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [quotes.length]);

  return (
    <div>
      <div
        className={`flex flex-col items-center justify-center min-h-[300px] text-gray-400 opacity-50 animate-pulse ${className}`}
      >
        {heading && <p className="text-xl font-semibold mb-8">{heading}</p>}
        {preMessage && (
          <p className="text-xl italic text-center max-w-xl mb-4">
            {preMessage}
          </p>
        )}
        <LoadingSpinner />
        <FadeIn key={quoteIndex}>
          <p className="text-xl italic text-center max-w-xl mt-4">
            {quotes[quoteIndex]}
          </p>
        </FadeIn>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <svg
      className="h-12 w-12 mb-4 animate-spin text-gray-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8z"
      />
    </svg>
  );
}
