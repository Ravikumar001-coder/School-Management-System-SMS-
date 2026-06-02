import React, { useState, useEffect } from 'react';
import { Card, Table, Button, DatePicker, message } from 'antd';
import { Download } from 'lucide-react';
import { financeApi } from '../../../api/financeApi';

const TrialBalanceReport = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTrialBalance();
    }, []);

    const fetchTrialBalance = async () => {
        try {
            setLoading(true);
            const res = await financeApi.getAllAccounts(1);
            if (res.success) {
                // In a real scenario, this would call a dedicated TB endpoint that aggregates balances.
                // For demo, we just show accounts and their opening balances.
                setAccounts(res.data.map(item => ({ ...item, key: item.id })));
            }
        } catch (error) {
            message.error('Failed to load trial balance');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { title: 'Account Code', dataIndex: 'accountCode' },
        { title: 'Account Name', dataIndex: 'accountName' },
        { title: 'Type', dataIndex: 'accountType' },
        { title: 'Debit (₹)', render: (_, r) => r.normalBalanceType === 'DEBIT' ? r.openingBalance : '-' },
        { title: 'Credit (₹)', render: (_, r) => r.normalBalanceType === 'CREDIT' ? r.openingBalance : '-' }
    ];

    const totalDebit = accounts.reduce((sum, a) => sum + (a.normalBalanceType === 'DEBIT' ? Number(a.openingBalance) : 0), 0);
    const totalCredit = accounts.reduce((sum, a) => sum + (a.normalBalanceType === 'CREDIT' ? Number(a.openingBalance) : 0), 0);

    return (
        <div className="bg-gray-50 min-h-screen p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Trial Balance</h1>
                <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-[16px] min-h-[44px] font-bold text-sm hover:bg-gray-200 transition-all flex items-center gap-2"><Download size={16} /> Export PDF</button>
            </div>
            
            <Card className="rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9]">
                <div className="mb-4">
                    <DatePicker.RangePicker className="mr-4" />
                    <button className="bg-[#1E40AF] text-white px-6 py-2 rounded-[16px] min-h-[44px] font-bold text-sm shadow-md transition-all hover:bg-[#1E3A8A]">Filter</button>
                </div>
                <Table 
                    columns={columns} 
                    dataSource={accounts} 
                    loading={loading}
                    pagination={false}
                    summary={() => (
                        <Table.Summary.Row className="bg-gray-50 font-bold">
                            <Table.Summary.Cell index={0} colSpan={3}>Total</Table.Summary.Cell>
                            <Table.Summary.Cell index={1}>₹{totalDebit.toFixed(2)}</Table.Summary.Cell>
                            <Table.Summary.Cell index={2}>₹{totalCredit.toFixed(2)}</Table.Summary.Cell>
                        </Table.Summary.Row>
                    )}
                />
            </Card>
        </div>
    );
};

export default TrialBalanceReport;
