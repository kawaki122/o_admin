import { useState, useEffect } from "react";
import { Form, Modal, Input, Button, Upload, message, Space } from "antd";
import { db, storage } from "../config/dbConfig";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { PlusOutlined } from "@ant-design/icons";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

function AddRider({ selectedEdit, isOpen, onClose, onFinish }) {
  const [loading, setLoading] = useState(false);
  const [filesList, setFilesList] = useState([]);
  const [sendingCode, setSendingCode] = useState(false);
  const [uid, setUid] = useState(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

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
      setUid(selectedEdit.uid);
    } else {
      form.resetFields();
      setFilesList([]);
      setUid(null);
    }
  }, [isOpen, selectedEdit, form]);

  const handleOk = async (data) => {
    const [{ response }] = data.file;
    try {
      setLoading(true);
      let content = null;
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
        content = "City updated";
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
        content = "Rider added";
      }
      messageApi.open({
        type: "success",
        content,
      });
      setLoading(false);
    } catch (e) {
      console.log(e);
      messageApi.open({
        type: "error",
        content: "Something went wrong",
      });
      setLoading(false);
    }
  };

  const sendCode = () => {
    setLoading(true);
    debugger
    const auth = getAuth();
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'sign-in-button', {
      'size': 'invisible',
    });
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, '+923404233509', appVerifier)
    .then((confirmationResult) => {
      // SMS sent. Prompt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
      window.confirmationResult = confirmationResult;
      // ...
    }).catch((error) => {
      // Error; SMS not sent
      // ...
    });
  }

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
      {contextHolder}
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
          rules={[
            { required: true, message: "Please input phone number!" },
            {
              message: "Please varify phone number",
              validator: (_, value) => {
                if (
                  !value || uid
                ) {
                  return Promise.resolve();
                } else {
                  return Promise.reject("Please varify phone number");
                }
              },
            },
          ]}
        >
          <Space.Compact style={{ width: "100%" }}>
            <Input
              addonBefore="+92"
              // suffix={<PhoneOutlined />}
              placeholder="340..."
              type="number"
            />
            <Button onClick={sendCode} loading={sendingCode}>Verify</Button>
          </Space.Compact>
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
                  !value ||
                  !value[0] ||
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
