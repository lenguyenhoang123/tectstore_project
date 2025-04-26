import React from 'react';
import './Modal.css';

function Modal({ open, title, children, onClose, onConfirm, confirmText = 'OK', cancelText = 'Hủy' }) {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        {title && <h3 className="modal-title">{title}</h3>}
        <div className="modal-content">{children}</div>
        <div className="modal-actions">
          <button className="modal-btn modal-cancel" onClick={onClose}>{cancelText}</button>
          {onConfirm && <button className="modal-btn modal-confirm" onClick={onConfirm}>{confirmText}</button>}
        </div>
      </div>
    </div>
  );
}

export default Modal;
