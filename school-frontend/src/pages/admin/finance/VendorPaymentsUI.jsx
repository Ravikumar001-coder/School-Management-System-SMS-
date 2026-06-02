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
            render: () => <button className="text-[#1E40AF] font-bold hover:underline">Make Payment</button>
        }
    ];

    return (
        <div className="bg-gray-50 min-h-screen p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Vendor Management & Payments</h1>
                <button className="bg-[#1E40AF] text-white px-6 py-3 rounded-[16px] min-h-[44px] font-bold text-sm shadow-md transition-all flex items-center gap-2 hover:bg-[#1E3A8A]" onClick={() => { form.resetFields(); setIsModalVisible(true); }}>
                    <Plus size={16} /> Register Vendor
                </button>
            </div>
            
            <Card className="rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9]">
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
                        <button type="button" className="px-6 py-3 min-h-[44px] rounded-[16px] bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 transition-all mr-2" onClick={() => setIsModalVisible(false)}>Cancel</button>
                        <button type="submit" className="bg-[#1E40AF] text-white px-6 py-3 rounded-[16px] min-h-[44px] font-bold text-sm shadow-md transition-all hover:bg-[#1E3A8A]" disabled={loading}>Save Vendor</button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default VendorPaymentsUI;
