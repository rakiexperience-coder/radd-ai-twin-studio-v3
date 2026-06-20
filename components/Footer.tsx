import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const AI_TWIN_TIPS = [
  "AI Twin Tip: Upload a clear, well-lit photo for best results ✨",
  "Studio Insight: Simple backgrounds help your AI twin shine 💫",
  "Creator Note: Gold accents and neutral tones photograph beautifully 📸",
  "Quick Reminder: Let your twin reflect your unique energy 💎",
];

const RotatingTips: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % AI_TWIN_TIPS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden sm:block">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="font-medium tracking-wide"
          style={{
            color: "#a4823f",
            fontSize: "0.9rem",
          }}
        >
          {AI_TWIN_TIPS[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#f9f9f6] py-6 px-6 lg:px-8 border-t border-[#a4823f]/20 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4">
        
        {/* Left: Created by Text */}
        <p
          className="text-sm sm:text-base text-center font-semibold tracking-wide"
          style={{ color: "#a4823f" }}
        >
          Created by Raki AI Digital DEN © 2025 RADD AI Twin Studio App. All Rights Reserved.
        </p>

        {/* Right: Rotating Tips */}
        <RotatingTips />
      </div>
    </footer>
  );
};
