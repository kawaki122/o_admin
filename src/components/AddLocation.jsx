import { useState, useEffect } from "react";
import { Form, Modal, Input, Button, Select, Row, Col } from "antd";
import { db } from "../config/dbConfig";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";

function AddLocation({ selectedEdit, isOpen, onClose, onFinish }) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (isOpen && selectedEdit) {
      form.setFieldsValue({ city: selectedEdit?.city });
    } else {
      form.resetFields();
    }
  }, [isOpen, selectedEdit]);

  const handleOk = async (data) => {
    try {
      setLoading(true);
      if (selectedEdit) {
        await updateDoc(doc(db, "locations", selectedEdit.id), {
          city: data.city,
        });
        onFinish("UPDATE_ACTION", {
          ...selectedEdit,
          city: data.city,
        });
      } else {
        const ref = await addDoc(collection(db, "locations"), {
          city: data.city,
        });
        onFinish("ADD_ACTION", {
          id: ref.id,
          key: ref.id,
          city: data.city,
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
      title={`${selectedEdit ? "Edit" : "Add"} Location`}
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleOk}
        requiredMark={false}
      >
        <Row>
          <Col span={8}>
            <Form.Item
              label="City"
              name="city"
              rules={[
                {
                  required: true,
                  message: "City is required",
                },
              ]}
            >
              <Select placeholder="Select City">
                <Select.Option value="Lahore">Lahore</Select.Option>
                <Select.Option value="Karachi">Karachi</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={16}>
            <div className="small-padding">
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Please input address!" }]}
            >
              <Input placeholder="Enter location address" />
            </Form.Item>
            </div>
          </Col>
        </Row>

        <Form.Item className="form-actions">
          <Button type="primary" loading={loading} htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddLocation;
