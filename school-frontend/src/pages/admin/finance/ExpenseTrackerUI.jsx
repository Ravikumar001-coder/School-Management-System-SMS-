import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, DatePicker, message, Tag, Upload } from 'antd';
import { Plus, Upload as UploadIcon, CheckCircle, XCircle } from 'lucide-react';
import { financeApi } from '../../../api/financeApi';

const { Option } = Select;

const ExpenseTrackerUI = () => {
    const [expenses, setExpenses] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchExpenses();
        fetchVendors();
    }, []);

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const res = await financeApi.getExpenses(1);
            if (res.success) {
                setExpenses(res.data.map(item => ({ ...item, key: item.id })));
            }
        } catch (error) {
            message.error('Failed to load expenses');
        } finally {
            setLoading(false);
        }
    };

    const fetchVendors = async () => {
        try {
            const res = await financeApi.getVendors(1);
            if (res.success) {
                setVendors(res.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreate = async (values) => {
        try {
            setLoading(true);
            const payload = {
                expenseNo: `EXP-${Date.now()}`,
                expenseDate: values.expenseDate.format('YYYY-MM-DD'),
                category: values.category,
                amount: values.amount,
                gstAmount: values.gstAmount || 0,
                paymentMode: values.paymentMode,
                description: values.description,
                vendor: values.vendorId ? { id: values.vendorId } : null,
                branch: { id: 1 },
                status: 'DRAFT'
            };

            const res = await financeApi.createExpense(payload);
            if (res.success) {
                message.success('Expense recorded successfully');
                setIsModalVisible(false);
                fetchExpenses();
            }
        } catch (error) {
            message.error('Failed to create expense');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { title: 'Date', dataIndex: 'expenseDate' },
        { title: 'Expense No', dataIndex: 'expenseNo' },
        { title: 'Category', dataIndex: 'category' },
        { title: 'Vendor', render: (_, r) => r.vendor?.vendorName || '-' },
        { title: 'Amount (₹)', dataIndex: 'amount' },
        { 
            title: 'Status', 
            dataIndex: 'status',
            render: (s) => {
                const color = s === 'PAID' ? 'green' : s === 'DRAFT' ? 'default' : 'orange';
                return <Tag color={color}>{s}</Tag>;
            }
        },
        {
            title: 'Action',
            render: (_, r) => (
                <div className="flex space-x-2">
                    {r.status === 'DRAFT' && <Button size="small" type="primary" icon={<CheckCircle size={14}/>}>Submit</Button>}
                </div>
            )
        }
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Expense Tracking</h1>
                <Button type="primary" icon={<Plus size={16} />} onClick={() => { form.resetFields(); setIsModalVisible(true); }}>
                    Record Expense
                </Button>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
                <Card className="bg-blue-50">
                    <div className="text-blue-500 text-sm font-bold">Total Expense</div>
                    <div className="text-2xl font-bold text-gray-800">₹{expenses.reduce((sum, e) => sum + Number(e.amount), 0).toFixed(2)}</div>
                </Card>
            </div>
            
            <Card>
                <Table columns={columns} dataSource={expenses} loading={loading} />
            </Card>

            <Modal
                title="Record New Expense"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={600}
            >
                <Form layout="vertical" form={form} onFinish={handleCreate}>
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item label="Expense Date" name="expenseDate" rules={[{ required: true }]}>
                            <DatePicker className="w-full" />
                        </Form.Item>
                        <Form.Item label="Category" name="category" rules={[{ required: true }]}>
                            <Select>
                                <Option value="Maintenance">Maintenance</Option>
                                <Option value="Stationery">Stationery</Option>
                                <Option value="Utilities">Utilities</Option>
                                <Option value="Events">Events</Option>
                                <Option value="Transport">Transport</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Vendor (Optional)" name="vendorId">
                            <Select allowClear showSearch placeholder="Select Vendor">
                                {vendors.map(v => <Option key={v.id} value={v.id}>{v.vendorName}</Option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Payment Mode" name="paymentMode" rules={[{ required: true }]}>
                            <Select>
                                <Option value="Cash">Cash</Option>
                                <Option value="Card">Card</Option>
                                <Option value="UPI">UPI</Option>
                                <Option value="Bank Transfer">Bank Transfer</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Base Amount (₹)" name="amount" rules={[{ required: true }]}>
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item label="GST Amount (₹)" name="gstAmount">
                            <Input type="number" />
                        </Form.Item>
                    </div>

                    <Form.Item label="Description" name="description">
                        <Input.TextArea rows={2} />
                    </Form.Item>

                    <Form.Item label="Receipt Upload">
                        <Upload name="file" action="/upload.do" listType="picture">
                            <Button icon={<UploadIcon size={16} />}>Click to upload receipt</Button>
                        </Upload>
                    </Form.Item>

                    <div className="text-right">
                        <Button onClick={() => setIsModalVisible(false)} className="mr-2">Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={loading}>Save Draft</Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default ExpenseTrackerUI;
