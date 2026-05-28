import React, { useState } from 'react';
import { Card, Button, Form, Input, Select, DatePicker, message, List } from 'antd';
import { Plus, CheckCircle, FileText } from 'lucide-react';

const { Option } = Select;
const { TextArea } = Input;

const TeacherLessonPlan = () => {
  const [plans, setPlans] = useState([
    { id: 1, topic: 'Introduction to Algebra', date: '2024-06-15', status: 'COMPLETED' },
    { id: 2, topic: 'Solving Linear Equations', date: '2024-06-18', status: 'PENDING' },
  ]);

  const [form] = Form.useForm();

  const handleAddPlan = (values) => {
    setPlans([...plans, { id: Date.now(), topic: values.topic, date: values.date.format('YYYY-MM-DD'), status: 'PENDING' }]);
    form.resetFields();
    message.success('Lesson plan added');
  };

  const markComplete = (id) => {
    setPlans(plans.map(p => p.id === id ? { ...p, status: 'COMPLETED' } : p));
    message.success('Marked as completed!');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Weekly Lesson Planning</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Create New Plan" className="shadow-sm">
          <Form form={form} layout="vertical" onFinish={handleAddPlan}>
            <Form.Item label="Class & Section" name="class" required>
              <Select>
                <Option value="10A">Grade 10 - A (Math)</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Target Date" name="date" required>
               <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item label="Topic/Chapter" name="topic" required>
               <Input />
            </Form.Item>
            <Form.Item label="Learning Outcomes" name="outcomes">
               <TextArea rows={3} placeholder="What will students learn?" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block icon={<Plus className="w-4 h-4 mr-2"/>}>
              Add Lesson Plan
            </Button>
          </Form>
        </Card>

        <Card title="Upcoming Plans" className="shadow-sm">
          <List
            itemLayout="horizontal"
            dataSource={plans}
            renderItem={item => (
              <List.Item
                actions={[
                  item.status === 'PENDING' ? (
                    <Button type="link" onClick={() => markComplete(item.id)}>Mark Complete</Button>
                  ) : (
                    <span className="text-green-600 flex items-center"><CheckCircle className="w-4 h-4 mr-1"/> Done</span>
                  )
                ]}
              >
                <List.Item.Meta
                  avatar={<FileText className="text-blue-500 mt-1" />}
                  title={<span className={item.status === 'COMPLETED' ? 'line-through text-gray-400' : ''}>{item.topic}</span>}
                  description={`Target Date: ${item.date}`}
                />
              </List.Item>
            )}
          />
        </Card>
      </div>
    </div>
  );
};

export default TeacherLessonPlan;
