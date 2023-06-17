import { useState } from "react";
import { Avatar, Table, Tag, message } from "antd";
import TitleBar from "../components/TitleBar";
import { doc, writeBatch } from "firebase/firestore";
import { db } from "../config/dbConfig";
import { useDispatch, useSelector } from "react-redux";
import { addTask, setTasks, updateTask } from "../store/slices/taskSlice";
import AddTask from "../components/AddTask";
import { taskStatus } from "../utils/constants";

function Task() {
  const [state, setState] = useState({
    isAddOpen: false,
    loading: false,
    selectedRows: [],
    selectedEdit: null,
  });
  const { tasks } = useSelector((state) => state.task);
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const handleEdit = () => {
    const [row] = state.selectedRows;
    setState((prev) => ({ ...prev, selectedEdit: row, isAddOpen: true }));
  };

  const handleAdd = (isOpen) => setState((p) => ({ ...p, isAddOpen: isOpen }));

  const handleRowChange = (_, selectedRows) => {
    setState((prev) => ({
      ...prev,
      selectedRows,
      selectedEdit: selectedRows.length === 0 ? null : prev.selectedEdit,
    }));
  };

  const handleUpsert = (action, data) => {
    if (action === "ADD_ACTION") {
      dispatch(addTask(data));
      setState((prev) => {
        return {
          ...prev,
          selectedEdit: null,
          isAddOpen: false,
        };
      });
    } else {
      dispatch(updateTask(data));
      setState((prev) => {
        return {
          ...prev,
          selectedEdit: data,
          selectedRows: [data],
          isAddOpen: false,
        };
      });
    }
  };

  const handleDelete = async () => {
    try {
      const batch = writeBatch(db);
      state.selectedRows.forEach((row) => {
        batch.delete(doc(db, "tasks", row.id));
      });
      await batch.commit();
      dispatch(
        setTasks(tasks.filter((item) => !state.selectedRows.includes(item)))
      );
      messageApi.open({
        type: 'success',
        content: "Deleted successfully",
      });
      setState((prev) => ({
        ...prev,
        selectedEdit: null,
        selectedRows: [],
      }));
    } catch (error) {
      console.log(error);
      messageApi.open({
        type: 'error',
        content: 'Error while deleting',
      });
    }
  };

  return (
    <div>
      {contextHolder}
      <AddTask
        isOpen={state.isAddOpen}
        selectedEdit={state.selectedEdit}
        onClose={() => handleAdd(false)}
        onFinish={handleUpsert}
      />
      <Table
        bordered
        dataSource={tasks}
        loading={state.loading}
        rowSelection={{
          type: "checkbox",
          onChange: handleRowChange,
        }}
        columns={[
            {
                title: "Rider",
                dataIndex: "rider",
                key: "rider",
                render: (_, data) => (
                  <div className="pic-name-section">
                    <Avatar
                      shape="square"
                      size="large"
                      src={<img src={data.rider.picture} alt="avatar" />}
                    />
                    <div>{data.rider.name}</div>
                  </div>
                ),
              },
          {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (_, data) => <Tag color="yellow">{taskStatus[data.status]}</Tag>,
          },
          {
            title: "Created",
            dataIndex: "created",
            key: "created",
          },
        ]}
        title={() => (
          <TitleBar
            title="Tasks"
            onEdit={handleEdit}
            onAdd={() => handleAdd(true)}
            onDelete={handleDelete}
            selectedLen={state.selectedRows.length}
          />
        )}
      />
    </div>
  );
}

export default Task;
