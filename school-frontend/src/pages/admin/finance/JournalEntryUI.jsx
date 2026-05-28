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
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Journal Entries</h1>
                <Button type="primary" icon={<Plus size={16} />} onClick={() => setIsModalVisible(true)}>
                    New Entry
                </Button>
            </div>
            
            <Card>
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
