import React, { useState, useEffect } from 'react';
import { Card, Table, Button, message, Tag } from 'antd';
import { Plus } from 'lucide-react';
import { financeApi } from '../../../api/financeApi';
import JournalEntryForm from './JournalEntryForm';

const JournalEntryUI = () => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        try {
            setLoading(true);
            const res = await financeApi.getJournalEntries(1);
            if (res.success) {
                setEntries(res.data.map(item => ({ ...item, key: item.id })));
            }
        } catch (error) {
            message.error('Failed to load journal entries');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { title: 'Voucher No', dataIndex: 'voucherNo' },
        { title: 'Date', dataIndex: 'entryDate' },
        { title: 'Total Debit', dataIndex: 'totalDebit', render: (val) => `₹${val}` },
        { title: 'Total Credit', dataIndex: 'totalCredit', render: (val) => `₹${val}` },
        { title: 'Status', dataIndex: 'status', render: (status) => <Tag color={status === 'POSTED' ? 'green' : 'orange'}>{status}</Tag> }
    ];

    return (
        <div className="bg-gray-50 min-h-screen p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Journal Entries</h1>
                <button className="bg-[#1E40AF] text-white px-6 py-3 rounded-[16px] min-h-[44px] font-bold text-sm shadow-md transition-all flex items-center gap-2 hover:bg-[#1E3A8A]" onClick={() => setIsModalVisible(true)}>
                    <Plus size={16} /> New Entry
                </button>
            </div>
            
            <Card className="rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9]">
                <Table columns={columns} dataSource={entries} loading={loading} />
            </Card>

            <JournalEntryForm
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSuccess={fetchEntries}
            />
        </div>
    );
};

export default JournalEntryUI;
