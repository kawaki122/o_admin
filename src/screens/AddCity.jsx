import { useState } from "react";
import { Form, Modal, Input, Button } from "antd";
import { db } from "../config/dbConfig";
import { collection, addDoc } from "firebase/firestore";

function AddCity({ selectedEdit, isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const handleOk = (data) => {
    setLoading(true)
    addDoc(collection(db, "cities"), {
        city: data.city,    
    }).then((ref) => {
        console.log(ref)
        setLoading(false)
    }).catch(e => {
      console.log(e)
      setLoading(false)
    });
  };

  return (
    <Modal
      title={`${selectedEdit ? "Edit" : "Add"} City`}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={400}
    >
      <Form layout="vertical" onFinish={handleOk} requiredMark={false}>
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
