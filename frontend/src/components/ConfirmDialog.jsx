import { FaExclamationTriangle } from "react-icons/fa";

function ConfirmDialog({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
        <FaExclamationTriangle className="confirm-icon" />
        <h3>{title}</h3>
        <p>{message}</p>

        <div className="confirm-actions">
          <button className="confirm-cancel" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className="confirm-delete" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
