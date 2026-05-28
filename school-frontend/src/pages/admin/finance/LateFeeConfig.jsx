import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, InputNumber, Switch, message } from 'antd';
import { Plus, Percent } from 'lucide-react';

const { Option } = Select;

const LateFeeConfig = () => {
  const [rules, setRules] = useState([
    { key: 1, structure: 'Tuition Fee (Grade 1)', grace: 5, type: 'FLAT', amount: 100, compound: false, active: true },
    { key: 2, structure: 'Annual Charge (All)', grace: 10, type: 'PERCENTAGE', amount: 5, compound: true, active: true },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Linked Fee Structure', dataIndex: 'structure' },
    { title: 'Grace Days', dataIndex: 'grace' },
    { title: 'Calc Type', dataIndex: 'type' },
    { 
      title: 'Penalty Amount', 
      dataIndex: 'amount',
      render: (amount, record) => record.type === 'FLAT' ? `₹${amount}` : `${amount}%`
    },
    { 
      title: 'Compound', 
      dataIndex: 'compound',
      render: (compound) => <Switch checked={compound} disabled />
    },
    { 
      title: 'Status', 
      dataIndex: 'active',
      render: (active) => <Switch checked={active} />
    }
  ];

  const handleAdd = (values) => {
    setRules([...rules, { key: Date.now(), ...values, active: true }]);
    setIsModalVisible(false);
    form.resetFields();
    message.success('Late fee rule added');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Late Fee Automation Rules</h1>
        <Button type="primary" icon={<Plus className="w-4 h-4 mr-2" />} onClick={() => setIsModalVisible(true)}>
          New Rule
        </Button>
      </div>

      <Card className="shadow-sm">
        <Table columns={columns} dataSource={rules} />
      </Card>

      <Modal title="Create Late Fee Rule" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item label="Link to Fee Structure" name="structure" required>
            <Select>
              <Option value="Tuition Fee (Grade 1)">Tuition Fee (Grade 1)</Option>
              <Option value="Tuition Fee (Grade 2)">Tuition Fee (Grade 2)</Option>
            </Select>
          </Form.Item>
          <div className="flex space-x-4">
            <Form.Item label="Grace Days" name="grace" className="flex-1" required>
              <InputNumber className="w-full" min={0} />
            </Form.Item>
            <Form.Item label="Calculation Type" name="type" className="flex-1" required>
              <Select>
                <Option value="FLAT">Flat Amount (₹)</Option>
                <Option value="PERCENTAGE">Percentage (%)</Option>
              </Select>
            </Form.Item>
          </div>
          <div className="flex space-x-4">
            <Form.Item label="Penalty Amount" name="amount" className="flex-1" required>
              <InputNumber className="w-full" min={1} />
            </Form.Item>
            <Form.Item label="Compound Daily?" name="compound" valuePropName="checked" className="flex-1 mt-8">
              <Switch />
            </Form.Item>
          </div>
          <Button type="primary" htmlType="submit" block>Save Rule</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default LateFeeConfig;
