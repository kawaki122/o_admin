import { useState, useEffect } from "react";
import { Form, Modal, Input, Button, Upload, message, Select } from "antd";
import { storage } from "../config/dbConfig";
import { PlusOutlined } from "@ant-design/icons";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { postRequest, putRequest } from "../services/apiServices";
import { useSelector } from "react-redux";

function AddBrand({ selectedEdit, isOpen, onClose, onFinish }) {
  const [loading, setLoading] = useState(false);
  const [filesList, setFilesList] = useState([]);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const clients = useSelector((state) => state.brand.clients);

  useEffect(() => {
    if (isOpen && selectedEdit) {
      form.setFieldsValue({
        name: selectedEdit?.name,
        clientId: selectedEdit.clientId,
        file:
          selectedEdit.logo !== ""
            ? [
                {
                  uid: selectedEdit.id,
                  name: "image.png",
                  status: "done",
                  url: selectedEdit.logo,
                  response: selectedEdit.logo,
                },
              ]
            : undefined,
      });
      if (selectedEdit.logo !== "") {
        setFilesList([
          {
            uid: selectedEdit.id,
            name: "image.png",
            status: "done",
            url: selectedEdit.logo,
          },
        ]);
      }
    } else {
      form.resetFields();
      setFilesList([]);
    }
  }, [isOpen, selectedEdit, form]);

  const handleOk = async (data) => {
    let response;
    if (data.file) {
      response = data.file[0].response;
    } else {
      response = "";
    }
    try {
      setLoading(true);
      let content = null;
      if (selectedEdit) {
        await putRequest("brands", {
          id: selectedEdit.id,
          name: data.name,
          logo: response,
          clientId: data.clientId,
        });
        onFinish("UPDATE_ACTION", {
          ...selectedEdit,
          name: data.name,
          logo: response,
          clientId: data.clientId,
        });
        content = "Brand updated";
      } else {
        const res = await postRequest("brands", {
          clientId: data.clientId,
          name: data.name,
          logo: response,
        });

        onFinish("ADD_ACTION", {
          id: res.data.id,
          key: res.data.id,
          name: data.name,
          logo: response,
          clientId: data.clientId,
        });
        content = "Brand added";
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
    <>
      {contextHolder}
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
            label="Select Client"
            name="clientId"
            rules={[{ required: true, message: "Please select a client!" }]}
          >
            <Select>
              {clients.map((client) => (
                <Select.Option key={client.id} value={client.id}>
                  {client.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Brand Logo (Optional)"
            valuePropName="fileList"
            name="file"
            rules={[
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
              accept="image/*"
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
    </>
  );
}

export default AddBrand;
