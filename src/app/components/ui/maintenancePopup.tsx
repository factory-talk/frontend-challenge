"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { initialMaintenancePopup, exitMaintenancePopup, animateMaintenancePopup, transitionMaintenancePopup } from "../../utils/animations/motionConfig";

export default function MaintenancePopup() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      if (window.innerWidth < 640) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    checkDevice();

    window.addEventListener("resize", checkDevice);

    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isMobile && (
        <motion.div
          className="fixed inset-0 bg-black/80 flex justify-center items-center z-[9999]"
          initial={initialMaintenancePopup}
          animate={animateMaintenancePopup}
          exit={exitMaintenancePopup}
          transition={transitionMaintenancePopup}
        >
          <div className="p-6 rounded-lg text-center shadow-md max-w-md mx-auto">
            <img
              src="/maintenance.png"
              alt="Under Development"
              className="w-100 h-100 mx-auto"
            />
            <h2 className="text-2xl text-white font-semibold mb-2">
              Under Development
            </h2>
            <p className="text-md text-gray-400">
              This page is currently only functional on mobile devices. Please
              visit from your mobile.
            </p>
            <p className="text-md text-danger">
              screen width must be &lt; 640px
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
