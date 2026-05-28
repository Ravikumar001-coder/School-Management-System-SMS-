import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, message } from 'antd';
import { Plus } from 'lucide-react';
import { financeApi } from '../../../api/financeApi';

const VendorPaymentsUI = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        try {
            setLoading(true);
            const res = await financeApi.getVendors(1);
            if (res.success) {
                setVendors(res.data.map(item => ({ ...item, key: item.id })));
            }
        } catch (error) {
            message.error('Failed to load vendors');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (values) => {
        try {
            setLoading(true);
            const payload = {
                ...values,
                branch: { id: 1 }
            };

            const res = await financeApi.createVendor(payload);
            if (res.success) {
                message.success('Vendor registered successfully');
                setIsModalVisible(false);
                fetchVendors();
            }
        } catch (error) {
            message.error('Failed to register vendor');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { title: 'Vendor Name', dataIndex: 'vendorName' },
        { title: 'Contact Person', dataIndex: 'contactPerson' },
        { title: 'GSTIN', dataIndex: 'gstin' },
        { title: 'Payment Terms', dataIndex: 'paymentTerms' },
        { title: 'Outstanding Balance (₹)', dataIndex: 'outstandingBalance' },
        {
            title: 'Action',
            render: () => <Button type="link">Make Payment</Button>
        }
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Vendor Management & Payments</h1>
                <Button type="primary" icon={<Plus size={16} />} onClick={() => { form.resetFields(); setIsModalVisible(true); }}>
                    Register Vendor
                </Button>
            </div>
            
            <Card>
                <Table columns={columns} dataSource={vendors} loading={loading} />
            </Card>

            <Modal
                title="Register New Vendor"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form layout="vertical" form={form} onFinish={handleCreate}>
                    <Form.Item label="Vendor Name" name="vendorName" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item label="Contact Person" name="contactPerson">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Payment Terms" name="paymentTerms">
                            <Input placeholder="e.g. Net 30" />
                        </Form.Item>
                        <Form.Item label="GSTIN" name="gstin">
                            <Input />
                        </Form.Item>
                        <Form.Item label="PAN" name="pan">
                            <Input />
                        </Form.Item>
                    </div>
                    <Form.Item label="Bank Details" name="bankDetails">
                        <Input.TextArea rows={2} placeholder="Account No, IFSC, Bank Name" />
                    </Form.Item>

                    <div className="text-right mt-4">
                        <Button onClick={() => setIsModalVisible(false)} className="mr-2">Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={loading}>Save Vendor</Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default VendorPaymentsUI;
