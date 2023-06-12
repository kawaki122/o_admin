import { useState, useEffect } from "react";
import { Form, Modal, Input, Button, Upload, InputNumber } from "antd";
import { db, storage } from "../config/dbConfig";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { PhoneOutlined, PlusOutlined } from "@ant-design/icons";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function AddRider({ selectedEdit, isOpen, onClose, onFinish }) {
  const [loading, setLoading] = useState(false);
  const [filesList, setFilesList] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    if (isOpen && selectedEdit) {
      form.setFieldsValue({
        name: selectedEdit?.name,
        phone: selectedEdit?.phone,
        file: [
          {
            uid: selectedEdit.id,
            name: "image.png",
            status: "done",
            url: selectedEdit.picture,
            response: selectedEdit.picture,
          },
        ],
      });
      setFilesList([
        {
          uid: selectedEdit.id,
          name: "image.png",
          status: "done",
          url: selectedEdit.picture,
        },
      ]);
    } else {
      form.resetFields();
      setFilesList([]);
    }
  }, [isOpen, selectedEdit, form]);

  const handleOk = async (data) => {
    const [{ response }] = data.file;
    try {
      setLoading(true);
      if (selectedEdit) {
        await updateDoc(doc(db, "riders", selectedEdit.id), {
          name: data.name,
          phone: data.phone,
          picture: response,
        });
        onFinish("UPDATE_ACTION", {
          ...selectedEdit,
          name: data.name,
          phone: data.phone,
          picture: response,
        });
      } else {
        const ref = await addDoc(collection(db, "riders"), {
          name: data.name,
          phone: data.phone,
          picture: response,
        });
        onFinish("ADD_ACTION", {
          id: ref.id,
          key: ref.id,
          name: data.name,
          phone: data.phone,
          picture: response,
        });
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  const customRequest = ({ file, onSuccess, onError, onProgress }) => {
    const storageRef = ref(storage, `/files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // CONNECT ON PROGRESS
        onProgress(progress);
      },
      (error) => {
        // CONNECT ON ERROR
        onError(error);
      },
      () => {
        // Handle successful uploads on complete
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          onSuccess(downloadURL);
        });
      }
    );
  };

  return (
    <Modal
      title={`${selectedEdit ? "Edit" : "Add"} Rider`}
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
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input rider name!" }]}
        >
          <Input placeholder="Enter Rider Name" />
        </Form.Item>
        <Form.Item
          label="Phone"
          name="phone"
          rules={[{ required: true, message: "Please input phone number!" }]}
        >
          <Input addonBefore="+92" suffix={<PhoneOutlined />} placeholder="340..." type="number" />
        </Form.Item>
        <Form.Item
          label="Picture"
          valuePropName="fileList"
          name="file"
          rules={[
            { required: true, message: "Please select a Picture!" },
            {
              message: "Please try uploading again",
              validator: (_, value) => {
                if (
                  !value || !value[0]||
                  value[0]?.response ||
                  value[0]?.status === "uploading"
                ) {
                  return Promise.resolve();
                } else {
                  return Promise.reject("Error while uploading");
                }
              },
            },
            {
              message: "Upload in progress...",
              validator: (_, value) => {
                if (value && value[0]?.status === "uploading") {
                  return Promise.reject("Upload in progress...");
                } else {
                  return Promise.resolve();
                }
              },
            },
          ]}
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e && e.fileList;
          }}
        >
          <Upload
            action="/upload"
            listType="picture-card"
            onChange={(e) => setFilesList(e.fileList)}
            customRequest={customRequest}
            fileList={filesList}
          >
            {filesList.length === 0 && (
              <div>
                <PlusOutlined />
                <div
                  style={{
                    marginTop: 8,
                  }}
                >
                  Upload
                </div>
              </div>
            )}
          </Upload>
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

export default AddRider;
