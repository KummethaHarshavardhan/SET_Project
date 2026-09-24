import { createContext, useCallback, useContext, useRef, useState } from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaTimes,
  FaTimesCircle,
} from "react-icons/fa";
import "../styles/toast.css";

const ToastContext = createContext(null);

const ICONS = {
  success: <FaCheckCircle />,
  error: <FaTimesCircle />,
  info: <FaInfoCircle />,
  warning: <FaExclamationCircle />,
};

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const showToast = useCallback(
    (message, type = "info", duration = 3500) => {
      const id = ++idCounter;

      setToasts((prev) => [...prev, { id, message, type }]);

      timers.current[id] = setTimeout(() => removeToast(id), duration);

      return id;
    },
    [removeToast]
  );

  const toast = {
    success: (msg, duration) => showToast(msg, "success", duration),
    error: (msg, duration) => showToast(msg, "error", duration),
    info: (msg, duration) => showToast(msg, "info", duration),
    warning: (msg, duration) => showToast(msg, "warning", duration),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}

      <div className="toast-stack" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-item toast-${t.type}`}>
            <span className="toast-icon">{ICONS[t.type]}</span>
            <span className="toast-message">{t.message}</span>
            <button
              className="toast-close"
              onClick={() => removeToast(t.id)}
              aria-label="Dismiss notification"
            >
              <FaTimes />
            </button>
            <span className="toast-progress" />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);

  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return ctx;
}
