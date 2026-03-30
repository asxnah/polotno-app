import { CircleCheck, CircleX } from "lucide-react";
import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  durationMs?: number;
  onClose?: () => void;
}

export const Toast = ({
  message,
  type = "success",
  durationMs = 3000,
  onClose,
}: ToastProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, durationMs);
    return () => clearTimeout(timer);
  }, [durationMs, onClose]);

  if (!visible) return null;

  const icon =
    type === "success" ? (
      <CircleCheck size={14} className="text-green-800" />
    ) : (
      <CircleX size={14} className="text-rose-800" />
    );

  return (
    <div
      className={`fixed top-6 right-5 flex gap-2 items-center px-4 py-2 text-sm rounded-lg bg-white shadow-sm z-99`}
    >
      {icon}
      {message}
    </div>
  );
};
