import React, { useState } from 'react';
import { Card, Button, Form, Select, DatePicker, message, Steps } from 'antd';
import { Download, CheckCircle } from 'lucide-react';
import { financeApi } from '../../../api/financeApi';

const { Option } = Select;

const exportSteps = [
    { title: 'Select Period & Modules', description: 'Choose what data to export' },
    { title: 'Generate XML', description: 'System generates Tally compatible file' },
    { title: 'Download', description: 'Import directly into Tally' },
];

const TallyExportUI = () => {
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(false);
    const [xmlData, setXmlData] = useState(null);
    const [form] = Form.useForm();

    const handleGenerate = async (values) => {
        try {
            setLoading(true);
            const res = await financeApi.exportTally(1, values.dateRange[0].format('YYYY-MM-DD'), values.dateRange[1].format('YYYY-MM-DD'));
            if (res.success) {
                setXmlData(res.data);
                setCurrent(1);
                message.success('Tally Export Generated Successfully');
            } else {
                message.error(res.message || 'Failed to generate Tally Export');
            }
        } catch (error) {
            message.error('Failed to generate Tally Export');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!xmlData) return;
        const blob = new Blob([xmlData], { type: 'text/xml' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Tally_Export_${new Date().getTime()}.xml`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Tally ERP 9 Integration</h1>
            
            <div className="flex gap-6">
                <div className="w-1/3">
                    <Card className="h-full">
                        <Steps orientation="vertical" current={current} items={exportSteps} />
                    </Card>
                </div>
                
                <div className="w-2/3">
                    <Card className="h-full">
                        {current === 0 && (
                            <Form layout="vertical" form={form} onFinish={handleGenerate}>
                                <Form.Item label="Branch" name="branchId" initialValue={1}>
                                    <Select disabled>
                                        <Option value={1}>Main Branch</Option>
                                    </Select>
                                </Form.Item>
                                
                                <Form.Item label="Date Range" name="dateRange" rules={[{ required: true }]}>
                                    <DatePicker.RangePicker className="w-full" />
                                </Form.Item>

                                <Form.Item label="Modules to Export" name="modules" initialValue={['vouchers', 'ledgers']}>
                                    <Select mode="multiple">
                                        <Option value="vouchers">Journal Vouchers</Option>
                                        <Option value="ledgers">Chart of Accounts (Ledgers)</Option>
                                        <Option value="expenses">Expense Vouchers</Option>
                                        <Option value="fees">Fee Receipts</Option>
                                    </Select>
                                </Form.Item>

                                <div className="text-right mt-6">
                                    <Button type="primary" htmlType="submit" loading={loading} icon={<CheckCircle size={16} />}>
                                        Generate Tally XML
                                    </Button>
                                </div>
                            </Form>
                        )}

                        {current === 1 && (
                            <div className="text-center py-10">
                                <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-gray-800">Export Ready!</h2>
                                <p className="text-gray-500 mb-6">Your data has been formatted for Tally ERP 9 XML.</p>
                                
                                <div className="space-x-4">
                                    <Button onClick={() => { setCurrent(0); setXmlData(null); form.resetFields(); }}>Start Over</Button>
                                    <Button type="primary" className="bg-blue-600" onClick={handleDownload} icon={<Download size={16} />}>
                                        Download XML File
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default TallyExportUI;
