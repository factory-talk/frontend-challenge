// Index Page
export const tableContainerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

export const tableItemVariants = {
  initial: { opacity: 0, y: 15, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Detail Page
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 30,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -30,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.5 },
  }),
};

// Confirm Popup
export const transition = {
  duration: 0.35,
  ease: [0.59, 0, 0.35, 1],
};

export const enteringState = {
  rotateX: 0,
  skewY: 0,
  scaleY: 1,
  scaleX: 1,
  y: 0,
  transition: {
    ...transition,
    y: { type: "spring", visualDuration: 0.7, bounce: 0.2 },
  },
};

export const exitingState = {
  rotateX: -5,
  skewY: -1.5,
  scaleY: 2,
  scaleX: 0.4,
  y: 100,
};

//Add/Edit City Popup
export const initialCityPopup = {
  opacity: 0, 
  scale: 0.8, 
  x: 0, 
  y: 0 
}

export const animateCityPopup = { 
  opacity: 1, 
  scale: 1, 
  x: 0, 
  y: 0 
}

export const exitCityPopup = { 
  opacity: 0, 
  scale: 0.8, 
  x: 0, 
  y: 0 
}

export const transitionCityPopup = { 
  duration: 0.25, 
  ease: "easeInOut" 
}

// Maintenance Popup
export const initialMaintenancePopup = {
  opacity: 0,
  scale: 1,
  x: 0,
  y: 0,
};

export const animateMaintenancePopup = {
  opacity: 1,
  scale: 1,
  x: 0,
  y: 0,
};

export const exitMaintenancePopup = {
  opacity: 0,
  scale: 1,
  x: 0,
  y: 0,
};

export const transitionMaintenancePopup = {
  duration: 0.5,
  ease: "easeInOut",
};
