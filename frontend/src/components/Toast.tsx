"use client";

interface ToastProps {
  message: string;
}

export default function Toast({ message }: ToastProps) {
  return (
    <div className="fixed left-1/2 top-5 z-50 -translate-x-1/2">
      <div
        className="
          rounded-xl
          bg-slate-900
          px-5 py-3
          text-sm
          font-medium
          text-white
          shadow-lg
          ring-1 ring-white/10
          animate-toast-in
        "
      >
        {message}
      </div>
    </div>
  );
}
