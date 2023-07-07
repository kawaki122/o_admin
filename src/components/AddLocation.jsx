import { useState, useEffect } from "react";
import {
  Form,
  Modal,
  Input,
  Button,
  Select,
  Space,
  Upload,
  message,
} from "antd";
import { db, storage } from "../config/dbConfig";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { useSelector } from "react-redux";
import {
  BorderBottomOutlined,
  BorderLeftOutlined,
  EnvironmentOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  uploadString,
} from "firebase/storage";
import { generateVideoThumbnails } from "@rajesh896/video-thumbnails-generator";
import { asyncMap } from "../utils/helpers";

function AddLocation({ selectedEdit, isOpen, onClose, onFinish }) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { city, campaign } = useSelector((state) => state);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (isOpen && selectedEdit) {
      form.setFieldsValue({
        campaign: selectedEdit?.campaign,
        city: selectedEdit?.city,
        address: selectedEdit?.address,
        width: selectedEdit?.width,
        height: selectedEdit?.height,
        trafic_flow: selectedEdit?.trafic_flow,
        files: selectedEdit?.files.map((file) => ({
          uid: file.file,
          name: file.type,
          status: "done",
          url: file.file,
          response: file.file,
          type: file.type + "/file",
          thumb: file.thumb,
        })),
      });
    } else {
      form.resetFields();
    }
  }, [isOpen, selectedEdit, form]);

  const processFiles = async (files) => {
    if (files) {
      return await asyncMap(files, async (file) => {
        let thumb = null;
        let type;
        if (file.type.split("/")[0] === "video") {
          if (file.originFileObj) {
            const base64Data = await generateVideoThumbnails(
              file.originFileObj,
              1
            );
            const storageRef = ref(storage, `/files/${file.name}-thumbnail`);
            await uploadString(
              storageRef,
              base64Data[0].replace("data:image/jpeg;base64,", ""),
              "base64"
            );
            thumb = await getDownloadURL(storageRef);
          } else {
            thumb = file.thumb;
          }
          type = "video";
        } else {
          thumb = file.response;
          type = "image";
        }
        return { file: file.response, thumb, type };
      });
    } else {
      return [];
    }
  };

  const handleOk = async (data) => {
    try {
      setLoading(true);
      data.files = await processFiles(data.files);
      let content = null;
      if (selectedEdit) {
        await updateDoc(doc(db, "locations", selectedEdit.id), data);
        onFinish("UPDATE_ACTION", {
          ...selectedEdit,
          ...data,
        });
        content = "Location updated";
      } else {
        const ref = await addDoc(collection(db, "locations"), {
          ...data,
          long: 0,
          lat: 0,
          rating: 3,
        });
        const camp = campaign.campaigns.find((c) => c.id === data.campaign);
        onFinish("ADD_ACTION", {
          id: ref.id,
          key: ref.id,
          ...data,
          brand: camp?.brand,
          long: 0,
          lat: 0,
          rating: 3,
        });
        content = "Location added";
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
        title={`${selectedEdit ? "Edit" : "Add"} Location`}
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
            label="Campaign"
            name="campaign"
            rules={[
              {
                required: true,
                message: "Campaign is required",
              },
            ]}
          >
            <Select placeholder="Select Campaign">
              {campaign.campaigns.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.brand.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Space.Compact style={{ width: "100%" }}>
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
                {city.cities.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.city}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Address"
              name="address"
              style={{ width: "100%" }}
              rules={[{ required: true, message: "Please input address!" }]}
            >
              <Input
                placeholder="Enter location address"
                suffix={<EnvironmentOutlined />}
              />
            </Form.Item>
          </Space.Compact>
          <Space>
            <Form.Item
              label="Billboard Width"
              name="width"
              rules={[
                {
                  required: true,
                  message: "Please input width!",
                },
              ]}
            >
              <Input
                type="number"
                prefix={<BorderBottomOutlined />}
                placeholder="Enter Width"
                suffix="FT"
              />
            </Form.Item>
            <Form.Item
              label="Billboard Height"
              name="height"
              rules={[{ required: true, message: "Please input height!" }]}
            >
              <Input
                type="number"
                prefix={<BorderLeftOutlined />}
                placeholder="Enter Height"
                suffix="FT"
              />
            </Form.Item>
          </Space>
          <Form.Item
            label="Trafic Flow"
            name="trafic_flow"
            rules={[{ required: true, message: "Please input trafic flow!" }]}
          >
            <Input.TextArea rows={2} placeholder="Enter Trafic Flow" />
          </Form.Item>
          <Form.Item
            label="Photos (Optional)"
            valuePropName="fileList"
            name="files"
            rules={[
              {
                message: "Upload in progress...",
                validator: (_, value) => {
                  if (
                    value &&
                    value.some((item) => item.status === "uploading")
                  ) {
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
              customRequest={customRequest}
            >
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

export default AddLocation;
