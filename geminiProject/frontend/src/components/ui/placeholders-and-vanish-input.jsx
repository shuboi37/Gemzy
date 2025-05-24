"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

export function PlaceholdersAndVanishInput({
  placeholders,
  value = "",
  onChange = () => {},
  onSubmit = () => {},
  disabled = false,
}) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const intervalRef = useRef(null);

  const startAnimation = () => {
    intervalRef.current = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
  };

  useEffect(() => {
    startAnimation();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [placeholders]);

  const inputRef = useRef(null);
  const [animating, setAnimating] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !animating) {
      handleSubmit(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAnimating(true);
    setTimeout(() => {
      onChange({ target: { value: "" } });
      setAnimating(false);
    }, 1000);
    onSubmit(e);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative w-full mx-auto bg-white dark:bg-white h-12 rounded-full overflow-hidden shadow-md transition duration-200 ${
        value ? "bg-gray-50" : ""
      }`}
    >
      <input
        onChange={onChange}
        onKeyDown={handleKeyDown}
        ref={inputRef}
        value={value}
        type="text"
        className={`w-full relative text-sm sm:text-base z-50 border-2 border-green-600 dark:text-black bg-transparent text-black font-semibold h-full rounded-full focus:outline-none pl-4 sm:pl-10 pr-20 ${
          animating ? "text-transparent dark:text-transparent" : ""
        }`}
        disabled={disabled}
      />

      <div className="absolute inset-0 flex items-center rounded-full pointer-events-none">
        <AnimatePresence mode="wait">
          {!value && (
            <motion.p
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -15, opacity: 0 }}
              transition={{ duration: 0.3, ease: "linear" }}
              key={`current-placeholder-${currentPlaceholder}`}
              className="dark:text-zinc-500 text-sm sm:text-base font-normal text-neutral-500 pl-4 sm:pl-12 w-full truncate"
            >
              {placeholders[currentPlaceholder]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
