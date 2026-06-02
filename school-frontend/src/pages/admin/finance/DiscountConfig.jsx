import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, InputNumber, Switch, message, Tag } from 'antd';
import { Plus } from 'lucide-react';

const { Option } = Select;

const DiscountConfig = () => {
  const [discounts, setDiscounts] = useState([
    { key: 1, name: 'Sibling Discount (2nd Child)', type: 'SIBLING', method: 'PERCENTAGE', value: 50, active: true },
    { key: 2, name: 'Staff Ward Concession', type: 'STAFF_WARD', method: 'PERCENTAGE', value: 100, active: true },
    { key: 3, name: 'Merit Scholarship', type: 'MERIT', method: 'FIXED', value: 5000, active: true },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Discount Name', dataIndex: 'name' },
    { 
      title: 'Type', 
      dataIndex: 'type',
      render: (type) => <Tag color="blue">{type}</Tag>
    },
    { title: 'Method', dataIndex: 'method' },
    { 
      title: 'Default Value', 
      dataIndex: 'value',
      render: (value, record) => record.method === 'FIXED' ? `₹${value}` : `${value}%`
    },
    { 
      title: 'Status', 
      dataIndex: 'active',
      render: (active) => <Switch checked={active} />
    }
  ];

  const handleAdd = (values) => {
    setDiscounts([...discounts, { key: Date.now(), ...values, active: true }]);
    setIsModalVisible(false);
    form.resetFields();
    message.success('Discount type created successfully');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Discount & Scholarship Engine</h1>
        <button className="bg-[#1E40AF] text-white px-6 py-3 rounded-[16px] min-h-[44px] font-bold text-sm shadow-md transition-all flex items-center gap-2 hover:bg-[#1E3A8A]" onClick={() => setIsModalVisible(true)}>
          <Plus className="w-4 h-4" /> New Discount Type
        </button>
      </div>

      <Card className="rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9]">
        <Table columns={columns} dataSource={discounts} />
      </Card>

      <Modal title="Create Discount Type" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item label="Discount Name" name="name" required><Input /></Form.Item>
          <div className="flex space-x-4">
            <Form.Item label="Category" name="type" className="flex-1" required>
              <Select>
                <Option value="SIBLING">Sibling Discount</Option>
                <Option value="MERIT">Merit Scholarship</Option>
                <Option value="STAFF_WARD">Staff Ward</Option>
                <Option value="RTE">RTE (Right to Education)</Option>
                <Option value="CUSTOM">Custom/Manual</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Calculation Method" name="method" className="flex-1" required>
              <Select>
                <Option value="FIXED">Fixed Amount (₹)</Option>
                <Option value="PERCENTAGE">Percentage (%)</Option>
              </Select>
            </Form.Item>
          </div>
          <Form.Item label="Default Value" name="value" required>
            <InputNumber className="w-full" min={0} />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>Save Discount</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default DiscountConfig;
