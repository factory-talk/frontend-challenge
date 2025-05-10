// ConfirmBox.tsx
import { animate, motion, AnimatePresence, useIsPresent, useMotionValue } from "framer-motion";
import { transition, enteringState, exitingState } from "../../lib/animations/motionConfig";
import { useEffect } from "react";

interface ConfirmBoxProps {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  showConfirmPopup: { visible: boolean; width: number; height: number };
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmBox({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  showConfirmPopup,
  onConfirm,
  onCancel,
}: ConfirmBoxProps) {
  return (
    <>
      <AnimatePresence>
        {showConfirmPopup.visible && (
          <div className="overlay-root" onClick={close}>
            <GradientOverlay
              size={{
                width: showConfirmPopup.width,
                height: showConfirmPopup.height,
              }}
            />
            <motion.div
              className="overlay-content bg-danger/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transition}
            >
              <motion.div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
                initial={exitingState}
                animate={enteringState}
                exit={exitingState}
                transition={transition}
                style={{
                  transformPerspective: 1000,
                  originX: 0.5,
                  originY: 0,
                }}
              >
                <header>
                  <h2 className="text-2xl text-white">{title}</h2>
                  <p className="big">{message}</p>
                </header>
                <div className="controls">
                  <button onClick={onConfirm} className="delete">
                    {confirmText}
                  </button>
                  <button
                    onClick={onCancel}
                    className="cancel text-white font-bold"
                  >
                    {cancelText}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function GradientOverlay({
  size,
}: {
  size: { width: number; height: number };
}) {
  const breathe = useMotionValue(0);
  const isPresent = useIsPresent();

  useEffect(() => {
    if (!isPresent) {
      animate(breathe, 0, { duration: 0.5, ease: "easeInOut" });
    }

    async function playBreathingAnimation() {
      await animate(breathe, 1, {
        duration: 0.5,
        delay: 0.35,
        ease: [0, 0.55, 0.45, 1],
      });

      animate(breathe, [null, 0.7, 1], {
        duration: 10,
        // repeat: Infinity,
        // repeatType: "loop",
        ease: "easeInOut",
      });
    }

    playBreathingAnimation();
  }, [isPresent]);

  const enterDuration = 0.75;
  const exitDuration = 0.5;

  const expandingCircleRadius = size.width / 3;

  return (
    <div className="gradient-container">
      <motion.div
        className="expanding-circle"
        initial={{
          scale: 0,
          opacity: 1,
          backgroundColor: "rgb(233, 167, 160)",
        }}
        animate={{
          scale: 10,
          opacity: 0.2,
          backgroundColor: "rgb(246, 63, 42)",
          transition: {
            duration: enterDuration,
            opacity: { duration: enterDuration, ease: "easeInOut" },
          },
        }}
        exit={{
          scale: 0,
          opacity: 1,
          backgroundColor: "rgb(233, 167, 160)",
          transition: { duration: exitDuration },
        }}
        style={{
          left: `calc(50% - ${expandingCircleRadius / 2}px)`,
          top: "100%",
          width: expandingCircleRadius,
          height: expandingCircleRadius,
          originX: 0.5,
          originY: 1,
        }}
      />

      <motion.div
        className="gradient-circle top-left"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 0.9,
          transition: { duration: enterDuration },
        }}
        exit={{
          opacity: 0,
          transition: { duration: exitDuration },
        }}
        style={{
          scale: breathe,
          width: size.width * 2,
          height: size.width * 2,
          top: -size.width,
          left: -size.width,
        }}
      />

      <motion.div
        className="gradient-circle bottom-right"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 0.9,
          transition: { duration: enterDuration },
        }}
        exit={{
          opacity: 0,
          transition: { duration: exitDuration },
        }}
        style={{
          scale: breathe,
          width: size.width * 2,
          height: size.width * 2,
          top: size.height - size.width,
          left: 0,
        }}
      />
    </div>
  );
}