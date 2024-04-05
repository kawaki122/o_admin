import { useState, useEffect } from "react";
import { Form, Modal, Button, Select, DatePicker, message } from "antd";
import { db } from "../config/dbConfig";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { postRequest, putRequest } from "../services/apiServices";

function AddCampaign({ selectedEdit, isOpen, onClose, onFinish }) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { brands } = useSelector((state) => state.brand);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (isOpen && selectedEdit) {
      form.setFieldsValue({
        brandId: selectedEdit?.brand.id,
        duration: [dayjs(selectedEdit?.from),dayjs(selectedEdit?.to)],
        status: selectedEdit?.status,
      });
    } else {
      form.resetFields();
    }
  }, [isOpen, selectedEdit, form]);

  const handleOk = async (data) => {
    data.duration = data.duration.map(date => date.format('YYYY-MM-DD'));
    const [from, to] = data.duration;
    const brand = brands.find(b => b.id === data.brandId);
    try {
      setLoading(true);
      let content = null;
      if (selectedEdit) {
        await putRequest("campaigns", {
          id: selectedEdit.id,
          brandId: data.brandId,
          from: from,
          to: to,
          status: data.status,
        });
        onFinish("UPDATE_ACTION", {
          ...selectedEdit,
          brand: brand,
          brandId: data.brandId,
          from: from,
          to: to,
          status: data.status,
        });
        content = "Campaign updated";
      } else {
        const res = await postRequest("campaigns", {
          brandId: data.brandId,
          from: from,
          to: to,
          status: data.status,
        });
        
        onFinish("ADD_ACTION", {
          ...res.data,
          key: res.data.id,
          brand: brand,
        });
        content = "Campaign added";
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
      title={`${selectedEdit ? "Edit" : "Add"} Campaign`}
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
          label="Brand"
          name="brandId"
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
