import { useState, useEffect } from "react";
import { Form, Modal, Button, Select, message } from "antd";
import { db } from "../config/dbConfig";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

function AddTask({ selectedEdit, isOpen, onClose, onFinish }) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const {
    rider: { riders },
    campaign: { campaigns },
    location: { locations },
  } = useSelector((state) => state);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (isOpen && selectedEdit) {
      form.setFieldsValue({
        rider: selectedEdit.rider,
        campaign: selectedEdit.campaign,
        location: selectedEdit.location,
      });
    } else {
      form.resetFields();
    }
  }, [isOpen, selectedEdit, form]);

  const handleOk = async (data) => {
    try {
      const rider = riders.find((i) => i.id === data.rider);
      setLoading(true);
      let content = null;
      if (selectedEdit) {
        await updateDoc(doc(db, "tasks", selectedEdit.id), {
          ...data,
        });
        onFinish("UPDATE_ACTION", {
          ...selectedEdit,
          ...data,
          rider,
        });
        content = "Task updated";
      } else {
        const ref = await addDoc(collection(db, "tasks"), {
          ...data,
          status: "INIT",
          created: dayjs().format("YYYY-MM-DD"),
        });
        onFinish("ADD_ACTION", {
          id: ref.id,
          key: ref.id,
          ...data,
          status: "INIT",
          created: dayjs().format("MMMM D, YYYY"),
          rider,
        });
        content = "Task assigned";
      }
      messageApi.open({
        type: 'success',
        content,
      });
      setLoading(false);
    } catch (e) {
      console.log(e);
      messageApi.open({
        type: 'error',
        content: 'Something went wrong',
      });
      setLoading(false);
    }
  };

  return (
    <Modal
      title={`${selectedEdit ? "Edit" : "Add"} Task`}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={400}
    >
      {contextHolder}
      <Form
        layout="vertical"
        form={form}
        onFinish={handleOk}
        requiredMark={false}
      >
        <Form.Item
          label="Select Rider"
          name="rider"
          rules={[{ required: true, message: "Please select a rider!" }]}
        >
          <Select placeholder="Select Rider">
            {riders.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Select Campaign"
          name="campaign"
          rules={[{ required: true, message: "Please select a campaign!" }]}
        >
          <Select placeholder="Select Campaign">
            {campaigns.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.brand.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Select Loaction"
          name="location"
          rules={[{ required: true, message: "Please select a location!" }]}
        >
          <Select placeholder="Select Location">
            {locations.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.address}
              </Select.Option>
            ))}
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

export default AddTask;
