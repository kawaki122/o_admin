import { useState, useEffect } from "react";
import { Form, Modal, Input, Button, message } from "antd";
import { postRequest, putRequest } from "../services/apiServices";

function AddCity({ selectedEdit, isOpen, onClose, onFinish }) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if(isOpen && selectedEdit) {
      form.setFieldsValue({ city: selectedEdit?.city })
    } else {
      form.resetFields()
    }
  }, [isOpen, selectedEdit, form])

  const handleOk = async (data) => {
    try {
      setLoading(true);
      let content = null;
      if (selectedEdit) {
        await putRequest("cities", {
          id: selectedEdit.id,
          city: data.city,
        });
        onFinish("UPDATE_ACTION", {
          ...selectedEdit,
          city: data.city,
        });
        content = "City updated";
      } else {
        const response = await postRequest("cities", {
          city: data.city,
        });
        onFinish("ADD_ACTION", response.data);
        content = "City added";
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
      title={`${selectedEdit ? "Edit" : "Add"} City`}
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
          label="City Name"
          name="city"
          rules={[{ required: true, message: "Please input city!" }]}
        >
          <Input />
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

export default AddCity;
