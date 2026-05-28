import React, { useState } from 'react';
import { Modal, Input, Select, Button } from 'antd';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';
import api from '../../../api/axios';
import toast from 'react-hot-toast';

const { TextArea } = Input;
const { Option } = Select;

const AlertResolutionModal = ({ isOpen, onClose, alert, onResolved }) => {
    const [loading, setLoading] = useState(false);
    const [notes, setNotes] = useState('');
    const [assignedTo, setAssignedTo] = useState('ADMIN');

    if (!alert) return null;

    const handleResolve = async () => {
        if (!notes) {
            toast.error('Resolution notes are required');
            return;
        }

        setLoading(true);
        try {
            await api.put(`/dashboard/alerts/${alert.id}/resolve`, {
                notes,
                assignedTo
            });
            toast.success('Alert resolved successfully');
            if (onResolved) onResolved();
            onClose();
        } catch (error) {
            console.error('Failed to resolve alert', error);
            toast.error('Failed to resolve alert');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 text-rose-600">
                    <ShieldAlert size={20} />
                    <span>Resolve Alert: {alert.title}</span>
                </div>
            }
            open={isOpen}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose} disabled={loading}>
                    Cancel
                </Button>,
                <Button 
                    key="submit" 
                    type="primary" 
                    danger
                    loading={loading} 
                    onClick={handleResolve}
                    className="bg-rose-600"
                >
                    Mark as Resolved
                </Button>
            ]}
        >
            <div className="py-4 space-y-4">
                <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-700">
                    <strong>Message:</strong> {alert.message}
                </div>
                
                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Assign Resolution To:</label>
                    <Select 
                        value={assignedTo} 
                        onChange={setAssignedTo} 
                        className="w-full"
                    >
                        <Option value="ADMIN">System Administrator</Option>
                        <Option value="HR">HR Department</Option>
                        <Option value="FINANCE">Finance Department</Option>
                        <Option value="TRANSPORT">Transport Warden</Option>
                    </Select>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Resolution Notes / Action Taken: *</label>
                    <TextArea 
                        rows={4} 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Detail the steps taken to resolve this alert..."
                        required
                    />
                </div>
            </div>
        </Modal>
    );
};

export default AlertResolutionModal;
