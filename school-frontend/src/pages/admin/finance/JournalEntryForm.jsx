import React, { useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, InputNumber, Tag, message } from 'antd';
import { Plus, Trash2, Save } from 'lucide-react';
import { financeApi } from '../../../api/financeApi';

const { Option } = Select;

/**
 * Reusable form component for creating a journal entry.
 * Props:
 *   visible   – boolean controlling modal visibility
 *   onClose   – callback to close the modal
 *   onSuccess – callback after successful creation (e.g., refresh list)
 */
const JournalEntryForm = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [lines, setLines] = useState([
    { id: 1, accountId: null, debitAmount: 0, creditAmount: 0, remarks: '' },
  ]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load accounts once when the form is first opened
  React.useEffect(() => {
    if (visible) {
      fetchAccounts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const fetchAccounts = async () => {
    try {
      const res = await financeApi.getAllAccounts(1);
      if (res.success) {
        setAccounts(res.data);
      }
    } catch (e) {
      console.error('Failed to load accounts', e);
    }
  };

  const addLine = () => {
    setLines([
      ...lines,
      { id: Date.now(), accountId: null, debitAmount: 0, creditAmount: 0, remarks: '' },
    ]);
  };

  const removeLine = id => {
    if (lines.length === 1) return; // keep at least one line
    setLines(lines.filter(l => l.id !== id));
  };

  const updateLine = (id, field, value) => {
    setLines(lines.map(l => (l.id === id ? { ...l, [field]: value } : l)));
  };

  const handleCreate = async values => {
    try {
      setLoading(true);
      const totalDr = lines.reduce((s, l) => s + Number(l.debitAmount || 0), 0);
      const totalCr = lines.reduce((s, l) => s + Number(l.creditAmount || 0), 0);
      if (totalDr !== totalCr) {
        message.error(`Voucher must balance. Total Debit: ${totalDr}, Total Credit: ${totalCr}`);
        setLoading(false);
        return;
      }
      const payload = {
        voucherNo: values.voucherNo,
        entryDate: values.entryDate.format('YYYY-MM-DD'),
        narration: values.narration,
        branch: { id: 1 },
        status: 'DRAFT',
        lines: lines.map(l => ({
          account: { id: l.accountId },
          debitAmount: l.debitAmount,
          creditAmount: l.creditAmount,
          remarks: l.remarks,
        })),
      };
      const res = await financeApi.createJournalEntry(payload);
      if (res.success) {
        message.success('Journal Entry created successfully');
        form.resetFields();
        setLines([
          { id: 1, accountId: null, debitAmount: 0, creditAmount: 0, remarks: '' },
        ]);
        onClose();
        if (onSuccess) onSuccess();
      } else {
        message.error(res.message || 'Failed to create journal entry');
      }
    } catch (e) {
      message.error(e?.response?.data?.message || 'Failed to create journal entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create Journal Voucher"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Form layout="vertical" form={form} onFinish={handleCreate}>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item label="Voucher No" name="voucherNo" rules={[{ required: true }]}> 
            <Input />
          </Form.Item>
          <Form.Item label="Entry Date" name="entryDate" rules={[{ required: true }]}> 
            <DatePicker className="w-full" />
          </Form.Item>
        </div>
        <div className="mb-4">
          <div className="flex font-semibold bg-gray-100 p-2 text-sm">
            <div className="w-2/5">Account</div>
            <div className="w-1/5 text-right px-2">Debit</div>
            <div className="w-1/5 text-right px-2">Credit</div>
            <div className="w-1/5 text-center">Action</div>
          </div>
          {lines.map(line => (
            <div key={line.id} className="flex mt-2 items-center">
              <div className="w-2/5 pr-2">
                <Select
                  showSearch
                  className="w-full"
                  placeholder="Select Account"
                  value={line.accountId}
                  onChange={val => updateLine(line.id, 'accountId', val)}
                >
                  {accounts.map(a => (
                    <Option key={a.id} value={a.id}>
                      {a.accountName} ({a.accountCode})
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="w-1/5 px-2">
                <InputNumber
                  className="w-full"
                  placeholder="0.00"
                  value={line.debitAmount}
                  onChange={val => updateLine(line.id, 'debitAmount', val)}
                  disabled={Number(line.creditAmount) > 0}
                />
              </div>
              <div className="w-1/5 px-2">
                <InputNumber
                  className="w-full"
                  placeholder="0.00"
                  value={line.creditAmount}
                  onChange={val => updateLine(line.id, 'creditAmount', val)}
                  disabled={Number(line.debitAmount) > 0}
                />
              </div>
              <div className="w-1/5 text-center">
                <Button
                  type="text"
                  danger
                  icon={<Trash2 size={16} />}
                  onClick={() => removeLine(line.id)}
                  disabled={lines.length === 1}
                />
              </div>
            </div>
          ))}
          <Button type="dashed" className="w-full mt-3 rounded-[16px] min-h-[44px]" onClick={addLine} icon={<Plus size={16} />}>Add Line</Button>
        </div>
        <Form.Item label="Narration" name="narration">
          <Input.TextArea rows={2} />
        </Form.Item>
        <div className="flex justify-between items-center bg-gray-50 p-4 rounded mt-4 border border-gray-200">
          <div className="font-semibold text-lg">Totals:</div>
          <div className="font-semibold text-lg text-blue-600 flex space-x-8">
            <span>Dr: ₹{lines.reduce((s, l) => s + Number(l.debitAmount || 0), 0).toFixed(2)}</span>
            <span>Cr: ₹{lines.reduce((s, l) => s + Number(l.creditAmount || 0), 0).toFixed(2)}</span>
          </div>
        </div>
        <div className="text-right mt-6">
          <button type="button" className="px-6 py-3 min-h-[44px] rounded-[16px] bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 transition-all mr-2" onClick={onClose}>Cancel</button>
          <button type="submit" className="bg-[#1E40AF] text-white px-6 py-3 rounded-[16px] min-h-[44px] font-bold text-sm shadow-md transition-all hover:bg-[#1E3A8A] flex items-center gap-2" disabled={loading}><Save size={16} /> Save Voucher</button>
        </div>
      </Form>
    </Modal>
  );
};

export default JournalEntryForm;
