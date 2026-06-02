import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, InputNumber, Switch, DatePicker, message } from 'antd';
import { Plus, Edit } from 'lucide-react';

const { Option } = Select;

const FeeStructureConfig = () => {
  const [structures, setStructures] = useState([
    { key: 1, head: 'Tuition Fee', class: 'Grade 1', amount: 5000, frequency: 'MONTHLY', active: true },
    { key: 2, head: 'Computer Fee', class: 'Grade 1', amount: 1500, frequency: 'MONTHLY', active: true },
    { key: 3, head: 'Annual Charge', class: 'Grade 1', amount: 12000, frequency: 'YEARLY', active: true },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Fee Head', dataIndex: 'head' },
    { title: 'Class', dataIndex: 'class' },
    { title: 'Amount (₹)', dataIndex: 'amount' },
    { title: 'Frequency', dataIndex: 'frequency' },
    { 
      title: 'Status', 
      dataIndex: 'active',
      render: (active) => <Switch checked={active} />
    },
    {
      title: 'Action',
      render: () => <Button type="link" icon={<Edit className="w-4 h-4"/>}>Edit</Button>
    }
  ];

  const handleAdd = (values) => {
    setStructures([...structures, { key: Date.now(), ...values, active: true }]);
    setIsModalVisible(false);
    form.resetFields();
    message.success('Fee structure added successfully');
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Fee Structure Configuration</h1>
        <button className="bg-[#1E40AF] text-white px-6 py-3 rounded-[16px] min-h-[44px] font-bold text-sm shadow-md transition-all flex items-center gap-2 hover:bg-[#1E3A8A]" onClick={() => setIsModalVisible(true)}>
          <Plus className="w-4 h-4" /> New Fee Structure
        </button>
      </div>

      <Card className="rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9]">
        <Table columns={columns} dataSource={structures} />
      </Card>

      <Modal title="Create Fee Structure" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item label="Fee Head" name="head" required>
            <Select>
              <Option value="Tuition Fee">Tuition Fee</Option>
              <Option value="Computer Fee">Computer Fee</Option>
              <Option value="Annual Charge">Annual Charge</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Target Class" name="class" required>
            <Select>
              <Option value="Grade 1">Grade 1</Option>
              <Option value="Grade 2">Grade 2</Option>
            </Select>
          </Form.Item>
          <div className="flex space-x-4">
            <Form.Item label="Amount (₹)" name="amount" className="flex-1" required>
              <InputNumber className="w-full" min={0} />
            </Form.Item>
            <Form.Item label="Billing Frequency" name="frequency" className="flex-1" required>
              <Select>
                <Option value="MONTHLY">Monthly</Option>
                <Option value="QUARTERLY">Quarterly</Option>
                <Option value="YEARLY">Yearly</Option>
              </Select>
            </Form.Item>
          </div>
          <div className="flex space-x-4">
             <Form.Item label="Applicable From" name="from">
                <DatePicker className="w-full" />
             </Form.Item>
             <Form.Item label="Applicable To" name="to">
                <DatePicker className="w-full" />
             </Form.Item>
          </div>
          <Button type="primary" htmlType="submit" block>Save Structure</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default FeeStructureConfig;
