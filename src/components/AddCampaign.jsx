import { useState, useEffect } from "react";
import { Form, Modal, Input, Button, Select, DatePicker } from "antd";
import { db } from "../config/dbConfig";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

function AddCampaign({ selectedEdit, isOpen, onClose, onFinish }) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { brands } = useSelector((state) => state.brand);

  useEffect(() => {
    if (isOpen && selectedEdit) {
      form.setFieldsValue({
        brand: selectedEdit?.brand.id,
        duration: [dayjs(selectedEdit?.from),dayjs(selectedEdit?.to)],
        status: selectedEdit?.status,
      });
    } else {
      form.resetFields();
    }
  }, [isOpen, selectedEdit]);

  const handleOk = async (data) => {
    data.duration = data.duration.map(date => date.format('YYYY-MM-DD'));
    const [from, to] = data.duration;
    const brand = brands.find(b => b.id === data.brand);
    try {
      setLoading(true);
      if (selectedEdit) {
        await updateDoc(doc(db, "campaigns", selectedEdit.id), {
          brand: brand,
          from: from,
          to: to,
          status: data.status,
        });
        onFinish("UPDATE_ACTION", {
          ...selectedEdit,
          brand: brand,
          from: from,
          to: to,
          status: data.status,
        });
      } else {
        const ref = await addDoc(collection(db, "campaigns"), {
          brand: brand,
          from: from,
          to: to,
          status: data.status,
        });
        onFinish("ADD_ACTION", {
          id: ref.id,
          key: ref.id,
          brand: brand,
          from: from,
          to: to,
          status: data.status,
        });
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  return (
    <Modal
      title={`${selectedEdit ? "Edit" : "Add"} Campaign`}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={400}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleOk}
        requiredMark={false}
      >
        <Form.Item
          label="Brand"
          name="brand"
          rules={[{ required: true, message: "Please select a brand!" }]}
        >
          <Select placeholder="Select Brand">
            {brands.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Campaign Duration"
          name="duration"
          rules={[{ required: true, message: "Please select duration!" }]}
        >
          <DatePicker.RangePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: "Please select sttatus!" }]}
        >
          <Select placeholder="Select Campaign Status">
            <Select.Option key={1} value="active">
              Active
            </Select.Option>
            <Select.Option key={2} value="completed">
              Completed
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item className="form-actions">
          <Button type="primary" loading={loading} htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddCampaign;
