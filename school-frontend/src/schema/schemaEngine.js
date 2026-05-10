// src/schema/schemaEngine.js

/**
 * entitySchema — The "One Source of Truth" for ERP domains.
 * 
 * This engine generates derived configurations for:
 * - SmartTable (Columns, Actions)
 * - FormEngine (Fields, Validation)
 * - FilterEngine (Query parameters)
 * - ExportEngine (CSV/PDF mapping)
 * - RBAC (Permissions)
 */
export const entitySchema = (config) => {
  const {
    entity,
    permissions = {},
    fields = [],
    actions = [],
    routes = {}
  } = config;

  return {
    entity,
    
    // ── TABLE CONFIG ──
    getTableConfig: () => ({
      columns: fields
        .filter(f => f.showInTable !== false)
        .map(f => ({
          key: f.key,
          title: f.label,
          render: f.render,
          sortable: f.sortable ?? true,
          width: f.width
        })),
      actions: actions.filter(a => a.scope === 'row' || a.scope === 'bulk'),
      permissions: permissions.table
    }),

    // ── FORM CONFIG ──
    getFormConfig: (mode = 'create') => ({
      fields: fields
        .filter(f => f.showInForm !== false)
        .map(f => ({
          ...f,
          required: mode === 'create' ? f.required : (f.requiredOnEdit ?? f.required)
        })),
      permissions: permissions.form
    }),

    // ── FILTER CONFIG ──
    getFilterConfig: () => ({
      filters: fields
        .filter(f => f.filterable)
        .map(f => ({
          key: f.key,
          label: f.label,
          type: f.filterType || (f.type === 'select' ? 'select' : 'text'),
          options: f.options
        }))
    }),

    // ── EXPORT CONFIG ──
    getExportConfig: () => ({
      columns: fields
        .filter(f => f.exportable !== false)
        .map(f => ({
          key: f.key,
          title: f.label
        }))
    })
  };
};
