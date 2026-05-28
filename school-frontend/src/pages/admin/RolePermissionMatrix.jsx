// src/pages/admin/RolePermissionMatrix.jsx
import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import api from '../../api/axios';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../context/AuthContext';
import { FiSave, FiSearch } from 'react-icons/fi';

/**
 * Enterprise Role-Permission Matrix
 * Features:
 * - Dynamic RBAC configuration
 * - Module-wise grouping
 * - Bulk select/deselect by role or permission
 * - Unified enterprise design tokens
 */
const RolePermissionMatrix = () => {
  const toast = useToast();
  const { isSuperAdmin } = useAuth();
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [matrix, setMatrix] = useState({}); // roleId -> { permissionKey: boolean }
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      const [rolesRes, permsRes] = await Promise.all([
        api.get('/roles'),
        api.get('/roles/permissions')
      ]);
      
      setRoles(rolesRes.data);
      setPermissions(permsRes.data);
      
      // Initialize matrix from roles' current permissions
      const initialMatrix = {};
      rolesRes.data.forEach(role => {
        initialMatrix[role.id] = {};
        role.permissions.forEach(p => {
          initialMatrix[role.id][p.permissionKey] = true;
        });
      });
      setMatrix(initialMatrix);
    } catch (err) {
      toast.error('Failed to load permissions configuration.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (roleId, permKey) => {
    if (!isSuperAdmin() && permKey.startsWith('ROLES_')) {
      return;
    }
    setMatrix(prev => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [permKey]: !prev[roleId][permKey]
      }
    }));
  };

  const handleSave = async (roleId) => {
    setSavingId(roleId);
    try {
      const role = roles.find(r => r.id === roleId);
      const allowedKeys = Object.keys(matrix[roleId]).filter(k => matrix[roleId][k]);
      await api.put(`/roles/${roleId}/permissions`, allowedKeys);
      toast.success(`Permissions for ${role.name} updated successfully.`);
    } catch (err) {
      toast.error('Failed to save security configuration.');
    } finally {
      setSavingId(null);
    }
  };

  const handleSelectAllInRow = (permKey, value) => {
    if (!isSuperAdmin() && permKey.startsWith('ROLES_')) {
      return;
    }
    const newMatrix = { ...matrix };
    roles.forEach(role => {
      if (role.name !== 'SUPERADMIN') {
        if (!newMatrix[role.id]) newMatrix[role.id] = {};
        newMatrix[role.id][permKey] = value;
      }
    });
    setMatrix(newMatrix);
  };

  const handleSelectAllInCol = (roleId, value) => {
    const newMatrix = { ...matrix };
    newMatrix[roleId] = {};
    permissions.forEach(p => {
      newMatrix[roleId][p.permissionKey] = value;
    });
    setMatrix(newMatrix);
  };

  // Group permissions by their moduleName directly from the API response.
  // This correctly renders CUSTOM keys like ATTENDANCE_MARK, HOMEWORK_CREATE, etc.
  // which do not follow the strict MODULE_ACTION naming convention.
  const modulePermissionMap = permissions.reduce((acc, p) => {
    if (!acc[p.moduleName]) acc[p.moduleName] = [];
    acc[p.moduleName].push(p);
    return acc;
  }, {});
  const modules = Object.keys(modulePermissionMap);

  const hasSensitivePerms = (role) =>
    (role?.permissions || []).some(p => (p?.permissionKey || '').startsWith('ROLES_'));

  if (loading) return <><Loading fullScreen /></>;

  return (
    <>
      <PageHeader 
        title="Access Control Matrix" 
        subtitle="Manage dynamic Role-Based Access Control (RBAC) across all system modules."
        actions={
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search module..." 
              className="search-input !pl-10 !w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        }
      />

      <div className="card !p-0 overflow-hidden mb-8 animate-fade-in">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-gray-50 z-10 border-b border-gray-100">
              <tr>
                <th className="px-6 py-5 text-left text-gray-400 text-[10px] font-black uppercase tracking-widest min-w-[220px] bg-gray-50">
                  Security Module / Capability
                </th>
                {roles.map(role => (
                  <th key={role.id} className="px-4 py-5 text-center min-w-[140px]">
                    <div className="text-[11px] font-black text-gray-800 uppercase tracking-tighter">{role.name}</div>
                    {role.name !== 'SUPERADMIN' && (
                      <div className="flex justify-center gap-1.5 mt-2.5">
                        <button 
                          onClick={() => handleSelectAllInCol(role.id, true)}
                          className="text-[9px] font-black uppercase bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-md hover:bg-blue-100 transition-colors"
                        >ALL</button>
                        <button 
                          onClick={() => handleSelectAllInCol(role.id, false)}
                          className="text-[9px] font-black uppercase bg-red-50 text-red-600 px-1.5 py-0.5 rounded-md hover:bg-red-100 transition-colors"
                        >NONE</button>
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {modules
                .filter(m => m.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(module => (
                <React.Fragment key={module}>
                  <tr className="bg-blue-50/20">
                    <td colSpan={roles.length + 1} className="px-6 py-2.5 font-black text-blue-500 text-[10px] uppercase tracking-widest border-l-4 border-blue-500">
                      📦 {module}
                    </td>
                  </tr>
                  {modulePermissionMap[module].map(perm => {
                    const permKey = perm.permissionKey;
                    const isSensitive = permKey.startsWith('ROLES_');
                    const isLocked = role => role.name === 'SUPERADMIN' || (!isSuperAdmin() && isSensitive);
                    // Display name: use actionName if available, else derive from permissionKey
                    const displayName = perm.actionName
                      ? perm.actionName.toLowerCase()
                      : permKey.replace(module + '_', '').replace(/_/g, ' ').toLowerCase();

                    return (
                      <tr key={permKey} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-3.5 text-sm text-gray-600 font-medium border-r border-gray-50">
                          <div className="flex items-center justify-between">
                            <span className="capitalize">{displayName}</span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSelectAllInRow(permKey, true)}
                                disabled={!isSuperAdmin() && isSensitive}
                                className="text-[9px] font-bold text-gray-400 hover:text-blue-600 uppercase disabled:opacity-40 disabled:cursor-not-allowed"
                              >On</button>
                              <button
                                onClick={() => handleSelectAllInRow(permKey, false)}
                                disabled={!isSuperAdmin() && isSensitive}
                                className="text-[9px] font-bold text-gray-400 hover:text-red-500 uppercase disabled:opacity-40 disabled:cursor-not-allowed"
                              >Off</button>
                            </div>
                          </div>
                        </td>
                        {roles.map(role => (
                          <td key={`${role.id}-${permKey}`} className="p-3 text-center">
                            <label className="inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="hidden"
                                checked={matrix[role.id]?.[permKey] || false}
                                onChange={() => handleToggle(role.id, permKey)}
                                disabled={isLocked(role)}
                              />
                              <div className={`w-10 h-5 rounded-full transition-all flex items-center px-1 shadow-inner ${
                                matrix[role.id]?.[permKey] ? 'bg-green-500' : 'bg-gray-200'
                              } ${isLocked(role) ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:scale-110 active:scale-95'}`}>
                                <div className={`w-3 h-3 bg-white rounded-full shadow-md transition-transform ${
                                  matrix[role.id]?.[permKey] ? 'translate-x-5' : 'translate-x-0'
                                }`} />
                              </div>
                            </label>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in pb-12">
        {roles.filter(r => r.name !== 'SUPERADMIN').map(role => (
          <div key={role.id} className="card !p-5 flex flex-col justify-between hover:shadow-card-hover transition-all group">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-gray-800 text-sm uppercase tracking-tight">{role.name}</h3>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              </div>
              <p className="text-[10px] text-gray-400 mt-1 font-medium italic">{role.description || 'Configurable role'}</p>
            </div>
            <Button 
              variant="primary" 
              size="sm"
              loading={savingId === role.id}
              disabled={!isSuperAdmin() && hasSensitivePerms(role)}
              onClick={() => handleSave(role.id)}
              className="w-full !py-2.5 !text-[10px] !uppercase !tracking-widest"
              icon={FiSave}
            >
              Sync Rules
            </Button>
          </div>
        ))}
      </div>
    </>
  );
};

export default RolePermissionMatrix;
