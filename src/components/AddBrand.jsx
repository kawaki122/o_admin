import { useState, useEffect } from "react";
import { Form, Modal, Input, Button, Upload } from "antd";
import { db, storage } from "../config/dbConfig";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { PlusOutlined } from "@ant-design/icons";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function AddBrand({ selectedEdit, isOpen, onClose, onFinish }) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filesList, setFilesList] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    if (isOpen && selectedEdit) {
      form.setFieldsValue({
        name: selectedEdit?.name,
        file: [
          {
            uid: selectedEdit.id,
            name: "image.png",
            status: "done",
            url: selectedEdit.logo,
            response: selectedEdit.logo,
          },
        ],
      });
      setFilesList([
        {
          uid: selectedEdit.id,
          name: "image.png",
          status: "done",
          url: selectedEdit.logo,
        },
      ]);
    } else {
      form.resetFields();
    }
  }, [isOpen, selectedEdit]);

  const handleOk = async (data) => {
    const [{ response }] = data.file;
    try {
      setLoading(true);
      if (selectedEdit) {
        await updateDoc(doc(db, "brands", selectedEdit.id), {
          name: data.name,
          logo: response,
        });
        onFinish("UPDATE_ACTION", {
          ...selectedEdit,
          name: data.name,
          logo: response,
        });
      } else {
        const ref = await addDoc(collection(db, "brands"), {
          name: data.name,
          logo: response,
        });
        onFinish("ADD_ACTION", {
          id: ref.id,
          key: ref.id,
          name: data.name,
          logo: response,
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
      title={`${selectedEdit ? "Edit" : "Add"} Brand`}
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
          label="Brand Name"
          name="name"
          rules={[{ required: true, message: "Please input brand name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Brand Logo"
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

export default AddBrand;
