import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import DepartmentDialog from './DepartmentDialog';
import ConfirmDialog from './ConfirmDialog';
import { departmentsAPI, mockDepartments } from '../api';
import '../styles/departments.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

ModuleRegistry.registerModules([AllCommunityModule]);

export default function DepartmentsPage() {
  const gridRef = useRef(null);
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);

  // Confirm delete state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingDept, setDeletingDept] = useState(null);

  // Toast state
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch departments
  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await departmentsAPI.getAll();
      setRowData(Array.isArray(data) ? data : data.data || []);
    } catch {
      // fallback to mock data if API not reachable
      setRowData(mockDepartments);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDepartments(); }, [fetchDepartments]);

  // Actions renderer
  const ActionsRenderer = useCallback((params) => (
    <div className="actions-cell">
      <button
        className="btn-action btn-edit"
        onClick={() => { setEditingDept(params.data); setDialogOpen(true); }}
        title="تعديل"
      >
        ✏️ تعديل
      </button>
      <button
        className="btn-action btn-delete"
        onClick={() => { setDeletingDept(params.data); setConfirmOpen(true); }}
        title="حذف"
      >
        🗑 حذف
      </button>
    </div>
  ), []);

  // Column definitions
  const columnDefs = useMemo(() => [
    {
      headerName: '#',
      valueGetter: 'node.rowIndex + 1',
      width: 70,
      sortable: false,
      filter: false,
      cellStyle: { textAlign: 'center', color: 'var(--text-muted)', fontWeight: '600' },
    },
    {
      headerName: 'اسم القسم (عربي)',
      field: 'nameAr',
      flex: 1.5,
      minWidth: 160,
    },
    {
      headerName: 'Department Name (EN)',
      field: 'nameEn',
      flex: 1.5,
      minWidth: 180,
      cellStyle: { fontFamily: 'sans-serif', direction: 'ltr', textAlign: 'left' },
    },
    {
      headerName: 'المدير المسؤول',
      field: 'manager',
      flex: 1.2,
      minWidth: 140,
      cellRenderer: (params) => (
        <div className="manager-cell">
          <span className="manager-avatar">{params.value?.[0] || '؟'}</span>
          {params.value}
        </div>
      ),
    },
    {
      headerName: 'عدد الموظفين',
      field: 'employeeCount',
      flex: 0.8,
      minWidth: 120,
      cellStyle: { textAlign: 'center' },
      cellRenderer: (params) => (
        <span className="badge-count">{params.value ?? 0}</span>
      ),
    },
    {
      headerName: 'الإجراءات',
      field: 'actions',
      width: 180,
      sortable: false,
      filter: false,
      cellRenderer: ActionsRenderer,
      cellStyle: { display: 'flex', alignItems: 'center' },
    },
  ], [ActionsRenderer]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    suppressMovable: true,
  }), []);

  // Save (add / edit)
  const handleSave = async (formData) => {
    try {
      if (editingDept) {
        await departmentsAPI.update(editingDept.id, formData);
        setRowData(prev => prev.map(d => d.id === editingDept.id ? { ...d, ...formData } : d));
        showToast('تم تعديل القسم بنجاح ✓');
      } else {
        const created = await departmentsAPI.create(formData).catch(() => ({
          id: Date.now(), employeeCount: 0, ...formData,
        }));
        setRowData(prev => [...prev, { id: created.id || Date.now(), employeeCount: 0, ...formData }]);
        showToast('تمت إضافة القسم بنجاح ✓');
      }
    } catch {
      showToast('حدث خطأ، يرجى المحاولة لاحقاً', 'error');
    }
    setDialogOpen(false);
    setEditingDept(null);
  };

  // Delete
  const handleDelete = async () => {
    try {
      await departmentsAPI.delete(deletingDept.id).catch(() => {});
      setRowData(prev => prev.filter(d => d.id !== deletingDept.id));
      showToast('تم حذف القسم بنجاح ✓');
    } catch {
      showToast('حدث خطأ أثناء الحذف', 'error');
    }
    setConfirmOpen(false);
    setDeletingDept(null);
  };

  return (
    <div className="page-dept">
      {/* Page Header */}
      <div className="page-top">
        <div>
          <h1 className="page-title">الأقسام</h1>
          <p className="page-sub">إدارة أقسام الشركة وبياناتها</p>
        </div>
        <button
          className="btn-add"
          onClick={() => { setEditingDept(null); setDialogOpen(true); }}
        >
          <span>+</span> إضافة قسم
        </button>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-card">
          <span className="stat-value">{rowData.length}</span>
          <span className="stat-label">إجمالي الأقسام</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{rowData.reduce((s, d) => s + (d.employeeCount || 0), 0)}</span>
          <span className="stat-label">إجمالي الموظفين</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">
            {rowData.length ? Math.round(rowData.reduce((s, d) => s + (d.employeeCount || 0), 0) / rowData.length) : 0}
          </span>
          <span className="stat-label">متوسط موظفي القسم</span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="alert-error">⚠️ {error}</div>
      )}

      {/* AG-Grid */}
      <div className="grid-card">
        <div
          className="ag-theme-alpine dept-grid"
          style={{ height: 480, width: '100%' }}
        >
          {loading ? (
            <div className="grid-loading">
              <div className="spinner" />
              <span>جاري تحميل البيانات...</span>
            </div>
          ) : (
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={8}
              paginationPageSizeSelector={[5, 8, 10, 20]}
              animateRows={true}
              rowHeight={56}
              headerHeight={48}
              enableRtl={true}
              overlayNoRowsTemplate='<span class="no-rows">لا توجد أقسام مضافة بعد</span>'
            />
          )}
        </div>
      </div>

      {/* Add/Edit Dialog */}
      {dialogOpen && (
        <DepartmentDialog
          dept={editingDept}
          onSave={handleSave}
          onClose={() => { setDialogOpen(false); setEditingDept(null); }}
        />
      )}

      {/* Confirm Delete Dialog */}
      {confirmOpen && (
        <ConfirmDialog
          message={`هل أنت متأكد من حذف قسم "${deletingDept?.nameAr}"؟`}
          onConfirm={handleDelete}
          onCancel={() => { setConfirmOpen(false); setDeletingDept(null); }}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
