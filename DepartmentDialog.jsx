import React, { useState, useEffect } from 'react';
import '../styles/dialog.css';

const emptyForm = { nameAr: '', nameEn: '', manager: '' };

export default function DepartmentDialog({ dept, onSave, onClose }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const isEdit = Boolean(dept);

  useEffect(() => {
    if (dept) {
      setForm({ nameAr: dept.nameAr || '', nameEn: dept.nameEn || '', manager: dept.manager || '' });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [dept]);

  const validate = () => {
    const e = {};
    if (!form.nameAr.trim()) e.nameAr = 'اسم القسم بالعربي مطلوب';
    if (!form.nameEn.trim()) e.nameEn = 'Department name in English is required';
    if (!form.manager.trim()) e.manager = 'اسم المدير المسؤول مطلوب';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSave(form);
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="dialog-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="dialog" role="dialog" aria-modal="true">
        {/* Header */}
        <div className="dialog-header">
          <div className="dialog-icon">{isEdit ? '✏️' : '🏢'}</div>
          <div>
            <h2 className="dialog-title">{isEdit ? 'تعديل القسم' : 'إضافة قسم جديد'}</h2>
            <p className="dialog-sub">{isEdit ? `تعديل بيانات: ${dept.nameAr}` : 'أدخل بيانات القسم الجديد'}</p>
          </div>
          <button className="dialog-close" onClick={onClose} title="إغلاق">×</button>
        </div>

        {/* Body */}
        <div className="dialog-body">
          {/* اسم القسم عربي */}
          <div className="field">
            <label className="field-label">
              اسم القسم (عربي) <span className="required">*</span>
            </label>
            <input
              className={`field-input ${errors.nameAr ? 'field-input--error' : ''}`}
              type="text"
              placeholder="مثال: قسم الموارد البشرية"
              value={form.nameAr}
              onChange={e => handleChange('nameAr', e.target.value)}
              autoFocus
            />
            {errors.nameAr && <p className="field-error">{errors.nameAr}</p>}
          </div>

          {/* اسم القسم إنجليزي */}
          <div className="field">
            <label className="field-label">
              Department Name (English) <span className="required">*</span>
            </label>
            <input
              className={`field-input field-input--ltr ${errors.nameEn ? 'field-input--error' : ''}`}
              type="text"
              placeholder="e.g. Human Resources"
              value={form.nameEn}
              onChange={e => handleChange('nameEn', e.target.value)}
              dir="ltr"
            />
            {errors.nameEn && <p className="field-error">{errors.nameEn}</p>}
          </div>

          {/* اسم المدير */}
          <div className="field">
            <label className="field-label">
              اسم المدير المسؤول <span className="required">*</span>
            </label>
            <input
              className={`field-input ${errors.manager ? 'field-input--error' : ''}`}
              type="text"
              placeholder="مثال: أحمد محمد"
              value={form.manager}
              onChange={e => handleChange('manager', e.target.value)}
            />
            {errors.manager && <p className="field-error">{errors.manager}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="dialog-footer">
          <button className="btn-cancel" onClick={onClose}>إلغاء</button>
          <button className="btn-submit" onClick={handleSubmit}>
            {isEdit ? '💾 حفظ التعديلات' : '✚ إضافة القسم'}
          </button>
        </div>
      </div>
    </div>
  );
}
