import React from 'react';

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="dialog-overlay">
      <div className="dialog dialog--sm" role="alertdialog">
        <div className="dialog-header">
          <div className="dialog-icon dialog-icon--danger">⚠️</div>
          <div>
            <h2 className="dialog-title">تأكيد الحذف</h2>
          </div>
          <button className="dialog-close" onClick={onCancel}>×</button>
        </div>
        <div className="dialog-body">
          <p style={{ color: 'var(--text-sub)', fontSize: '15px', lineHeight: '1.7' }}>{message}</p>
          <p style={{ color: 'var(--danger)', fontSize: '13px', marginTop: '8px' }}>
            ⚠️ هذا الإجراء لا يمكن التراجع عنه
          </p>
        </div>
        <div className="dialog-footer">
          <button className="btn-cancel" onClick={onCancel}>إلغاء</button>
          <button className="btn-submit btn-submit--danger" onClick={onConfirm}>
            🗑 حذف نهائياً
          </button>
        </div>
      </div>
    </div>
  );
}
