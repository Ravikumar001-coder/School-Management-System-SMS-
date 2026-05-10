import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiDownload, FiDatabase, FiRefreshCw, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

const BackupDashboard = () => {
    const [backups, setBackups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [restoringId, setRestoringId] = useState(null);

    const fetchBackups = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:8080/api/v1/backups', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBackups(res.data.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch backups');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBackups();
    }, []);

    const handleManualBackup = async () => {
        try {
            const token = localStorage.getItem('token');
            const toastId = toast.loading('Starting backup...');
            const res = await axios.post('http://localhost:8080/api/v1/backups/manual', null, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                toast.success('Backup completed successfully!', { id: toastId });
                fetchBackups();
            }
        } catch (error) {
            console.error(error);
            toast.error('Backup failed. Check server logs.');
        }
    };

    const handleRestore = async (id, fileName) => {
        if (!window.confirm(`DANGER: Are you sure you want to restore from ${fileName}? This will OVERWRITE current data and CANNOT be undone.`)) {
            return;
        }

        try {
            setRestoringId(id);
            const token = localStorage.getItem('token');
            const toastId = toast.loading('Restoring database...');
            const res = await axios.post(`http://localhost:8080/api/v1/backups/${id}/restore`, null, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                toast.success('Database restored successfully!', { id: toastId });
                fetchBackups();
            }
        } catch (error) {
            console.error(error);
            toast.error('Restore failed. Check server logs.');
        } finally {
            setRestoringId(null);
        }
    };

    const handleDownload = (id, fileName) => {
        const token = localStorage.getItem('token');
        axios({
            url: `http://localhost:8080/api/v1/backups/${id}/download`,
            method: 'GET',
            responseType: 'blob',
            headers: { Authorization: `Bearer ${token}` }
        }).then((response) => {
            const href = URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = href;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(href);
        }).catch((err) => {
            console.error(err);
            toast.error('Download failed');
        });
    };

    const formatBytes = (bytes, decimals = 2) => {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    const lastBackup = backups.length > 0 ? backups[0] : null;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Database Backup & Recovery</h1>
                    <p className="text-gray-600 mt-1">Manage system snapshots and data survivability</p>
                </div>
                <button
                    onClick={handleManualBackup}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700 transition"
                >
                    <FiDatabase className="mr-2" /> Run Manual Backup
                </button>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                            <FiCheckCircle size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Last Successful Backup</p>
                            <h2 className="text-xl font-bold text-gray-800 mt-1">
                                {lastBackup && lastBackup.backupStatus === 'SUCCESS'
                                    ? format(new Date(lastBackup.createdAt), 'PPpp')
                                    : 'No recent backup'}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                            <FiDatabase size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Total Backups</p>
                            <h2 className="text-2xl font-bold text-gray-800 mt-1">{backups.length}</h2>
                        </div>
                    </div>
                </div>

                <div className="bg-red-50 p-6 rounded-lg shadow border border-red-200">
                    <div className="flex items-start">
                        <FiAlertTriangle className="text-red-500 mt-1 mr-3 flex-shrink-0" size={24} />
                        <div>
                            <h3 className="text-red-800 font-bold">Data Recovery Warning</h3>
                            <p className="text-sm text-red-600 mt-1">
                                Restoring a backup will instantly overwrite current live data.
                                Ensure you have a recent snapshot before proceeding.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* History Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">Backup History</h3>
                    <button onClick={fetchBackups} className="text-gray-500 hover:text-indigo-600">
                        <FiRefreshCw />
                    </button>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading history...</div>
                ) : backups.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No backups found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Triggered By</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {backups.map((b) => (
                                    <tr key={b.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {format(new Date(b.createdAt), 'MMM dd, yyyy HH:mm:ss')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {b.fileName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatBytes(b.fileSize)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                {b.createdBy}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {b.backupStatus === 'SUCCESS' ? (
                                                <span className="text-green-600 font-semibold flex items-center">
                                                    <FiCheckCircle className="mr-1" /> Success
                                                </span>
                                            ) : (
                                                <span className="text-red-600 font-semibold flex items-center">
                                                    <FiAlertTriangle className="mr-1" /> Failed
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {b.backupStatus === 'SUCCESS' && (
                                                <div className="flex justify-end space-x-3">
                                                    <button
                                                        onClick={() => handleDownload(b.id, b.fileName)}
                                                        className="text-indigo-600 hover:text-indigo-900 flex items-center"
                                                        title="Download SQL File"
                                                    >
                                                        <FiDownload className="mr-1" /> Download
                                                    </button>
                                                    <button
                                                        onClick={() => handleRestore(b.id, b.fileName)}
                                                        disabled={restoringId === b.id}
                                                        className={`text-red-600 hover:text-red-900 flex items-center ${restoringId === b.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        title="Restore from this backup"
                                                    >
                                                        <FiRefreshCw className={`mr-1 ${restoringId === b.id ? 'animate-spin' : ''}`} />
                                                        {restoringId === b.id ? 'Restoring...' : 'Restore'}
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BackupDashboard;
