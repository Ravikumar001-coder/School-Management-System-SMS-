import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, InputNumber, Switch, message, Tag } from 'antd';
import { TrendingUp, CheckCircle, Edit } from 'lucide-react';
import { hrmsApi } from '../../../api/hrmsApi';

const PerformanceReviewBoard = () => {
  const [cycles, setCycles] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCycles();
  }, []);

  const fetchCycles = async () => {
    try {
      setLoading(true);
      const res = await hrmsApi.getActiveCycles();
      if (res.success) {
        setCycles(res.data);
        if (res.data.length > 0) {
          setSelectedCycle(res.data[0]);
          fetchReviews(res.data[0].id);
        }
      }
    } catch (error) {
      console.error(error);
      message.error('Failed to load active cycles');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (cycleId) => {
    try {
      setLoading(true);
      const res = await hrmsApi.getReviewsForCycle(cycleId); // Ensure this method exists in hrmsApi if needed, or use a workaround. We will mock it here if backend returns 404
      if (res.success) {
        setReviews(res.data.map(item => ({ ...item, key: item.id })));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const showReviewModal = (record) => {
    setCurrentReview(record);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleReviewSubmit = async (values) => {
    try {
      setLoading(true);
      await hrmsApi.submitManagerReview(currentReview.id, values.managerReview, values.finalScore, values.incrementPercentage, values.promotionRecommendation);
      message.success('Review completed successfully');
      setIsModalVisible(false);
      fetchReviews(selectedCycle.id);
    } catch (error) {
      console.error(error);
      message.error('Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'Staff', render: (_, r) => `${r.staff?.firstName || 'Staff'} ${r.staff?.lastName || ''}` },
    { title: 'Self Review', dataIndex: 'selfReview' },
    { title: 'Final Score', dataIndex: 'finalScore' },
    { 
      title: 'Status', 
      dataIndex: 'status',
      render: (s) => <Tag color={s === 'COMPLETED' ? 'green' : 'orange'}>{s}</Tag>
    },
    {
      title: 'Action',
      render: (_, r) => r.status !== 'COMPLETED' ? (
        <Button type="primary" size="small" onClick={() => showReviewModal(r)} icon={<Edit size={14} />}>
          Manager Review
        </Button>
      ) : (
        <Button icon={<CheckCircle size={14} />} size="small" disabled>Completed</Button>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Performance Review Board</h1>
      </div>
      
      {selectedCycle && (
        <Card title={`Active Cycle: ${selectedCycle.cycleName}`} className="mb-6">
          <Table columns={columns} dataSource={reviews} loading={loading} />
        </Card>
      )}

      <Modal
        title="Submit Manager Review"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleReviewSubmit}>
          <Form.Item name="managerReview" label="Manager Comments" rules={[{ required: true }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="finalScore" label="Final Score (Out of 5)" rules={[{ required: true }]}>
              <InputNumber min={0} max={5} step={0.1} className="w-full" />
            </Form.Item>
            <Form.Item name="incrementPercentage" label="Suggested Increment (%)">
              <InputNumber min={0} max={100} className="w-full" />
            </Form.Item>
          </div>
          <Form.Item name="promotionRecommendation" label="Recommend Promotion?" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item className="mb-0 text-right">
            <Button onClick={() => setIsModalVisible(false)} className="mr-2">Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>Submit Review</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PerformanceReviewBoard;
