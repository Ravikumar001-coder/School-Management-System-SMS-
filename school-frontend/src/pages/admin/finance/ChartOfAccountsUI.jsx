import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, Tag, message } from 'antd';
import { Folder, FileText, Plus } from 'lucide-react';
import { financeApi } from '../../../api/financeApi';

const { Option } = Select;

const ChartOfAccountsUI = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            setLoading(true);
            const res = await financeApi.getAllAccounts(1); // Demo Branch ID 1
            if (res.success) {
                // To display as a tree, we need to transform flat list to hierarchy if we had parent references.
                // For now, just show flat list.
                setAccounts(res.data.map(item => ({ ...item, key: item.id })));
            }
        } catch (error) {
            message.error('Failed to load chart of accounts');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (values) => {
        try {
            setLoading(true);
            const payload = {
                ...values,
                branch: { id: 1 },
                status: 'ACTIVE'
            };
            const res = await financeApi.createAccount(payload);
            if (res.success) {
                message.success('Account created successfully');
                setIsModalVisible(false);
                fetchAccounts();
            }
        } catch (error) {
            message.error('Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { title: 'Account Code', dataIndex: 'accountCode', key: 'accountCode' },
        { title: 'Account Name', dataIndex: 'accountName', key: 'accountName' },
        { title: 'Type', dataIndex: 'accountType', key: 'accountType' },
        { title: 'Opening Balance (₹)', dataIndex: 'openingBalance', key: 'openingBalance' },
        { 
            title: 'Status', 
            dataIndex: 'status', 
            key: 'status',
            render: (status) => <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>{status}</Tag>
        }
    ];

    return (
        <div className="bg-gray-50 min-h-screen p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Chart of Accounts</h1>
                <button className="bg-[#1E40AF] text-white px-6 py-3 rounded-[16px] min-h-[44px] font-bold text-sm shadow-md transition-all flex items-center gap-2 hover:bg-[#1E3A8A]" onClick={() => { form.resetFields(); setIsModalVisible(true); }}>
                    <Plus size={16} /> New Account
                </button>
            </div>
            
            <Card className="rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9]">
                <Table 
                    columns={columns} 
                    dataSource={accounts} 
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            <Modal
                title="Create New Ledger Account"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form layout="vertical" form={form} onFinish={handleCreate}>
                    <Form.Item label="Account Code" name="accountCode" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Account Name" name="accountName" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Account Type" name="accountType" rules={[{ required: true }]}>
                        <Select>
                            <Option value="ASSET">Asset</Option>
                            <Option value="LIABILITY">Liability</Option>
                            <Option value="EQUITY">Equity</Option>
                            <Option value="INCOME">Income</Option>
                            <Option value="EXPENSE">Expense</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Normal Balance" name="normalBalanceType" rules={[{ required: true }]}>
                        <Select>
                            <Option value="DEBIT">Debit (Dr)</Option>
                            <Option value="CREDIT">Credit (Cr)</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Opening Balance" name="openingBalance" initialValue={0}>
                        <Input type="number" />
                    </Form.Item>
                    <div className="text-right">
                        <Button onClick={() => setIsModalVisible(false)} className="mr-2">Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={loading}>Save Account</Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default ChartOfAccountsUI;
