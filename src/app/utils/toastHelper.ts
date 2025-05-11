import { showToast } from "nextjs-toast-notify";

const toastConfig = {
  duration: 3000,
  progress: true,
  position: "top-right",
  transition: "fadeIn",
  icon: "",
  sound: true,
} as any;

export const toast = {
  success: (message: string) => showToast.success(message, toastConfig),
  error: (message: string) => showToast.error(message, toastConfig),
  warning: (message: string) => showToast.warning(message, toastConfig),
  info: (message: string) => showToast.info(message, toastConfig),
};
