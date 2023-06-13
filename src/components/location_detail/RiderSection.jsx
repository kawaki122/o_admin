import { Avatar, Button, Empty, Form, List, Select, Tag } from "antd";
import { addDoc, collection } from "firebase/firestore";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../config/dbConfig";
import dayjs from "dayjs";
import { addTask } from "../../store/slices/taskSlice";
import { CalendarOutlined, Loading3QuartersOutlined } from "@ant-design/icons";
import { taskStatus } from "../../utils/constants";

function RiderSection({ location }) {
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    rider: { riders },
    task: { tasks },
  } = useSelector((state) => state);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const obj = {
        location: location.id,
        campaign: location.campaign,
        rider: data.rider,
        status: "INIT",
        created: dayjs().format("YYYY-MM-DD"),
      };
      const ref = await addDoc(collection(db, "tasks"), obj);
      obj.id = ref.id;
      obj.key = ref.id;
      dispatch(addTask(obj));
      setLoading(false);
      setFormOpen(false)
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const task = useMemo(() => {
    const tsk = tasks.find(
      (item) => item.location === location.id && item.status === "INIT"
    );
    if (tsk) {
      const rider = riders.find((item) => item.id === tsk.rider);
      if (rider) {
        return {
          ...tsk,
          rider,
        };
      }
    }
    return null;
  }, [tasks, location, riders]);

  if (!formOpen && !task) {
    return (
      <Empty description={<span>No active task for this location</span>}>
        <Button type="primary" onClick={() => setFormOpen(true)}>
          Create a Task
        </Button>
      </Empty>
    );
  }
  if (!task && formOpen) {
    return (
      <div>
        <div className="small-heading">Assign a Rider</div>
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
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
          <Form.Item className="form-actions">
            <Button type="primary" loading={loading} htmlType="submit">
              Create Task
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
  return (
    <List
      itemLayout="horizontal"
      dataSource={[
        {
          Icon: <Avatar src={<img src={task.rider.picture} alt="avatar" />} />,
          text: task.rider.name,
          title: 'Rider',
        },
        {
          Icon: <CalendarOutlined />,
          text: task.created,
          title: 'Assigned At',
        },
        {
          Icon: <Loading3QuartersOutlined />,
          text: <Tag>{taskStatus[task.status]}</Tag>,
          title: 'Status',
        },
      ]}
      renderItem={(item, index) => (
        <List.Item>
          <List.Item.Meta
            avatar={item.Icon}
            title={item.title}
            description={item.text}
          />
        </List.Item>
      )}
    />
  );
}

export default RiderSection;
