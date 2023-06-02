import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";

function TitleBar({ title, selectedLen, onAdd, onEdit, onDelete }) {
  return (
    <div className="title-bar">
      <label className="title-heading">{title}</label>
      <div className="actions-section">
        {selectedLen > 0 && (
          <Popconfirm
            title="Delete this Data"
            placement="left"
            description="Are you sure to delete this data?"
            onConfirm={onDelete}
            okText="Ok"
            cancelText="Cancel"
          >
            <Button danger icon={<DeleteOutlined />}></Button>
          </Popconfirm>
        )}
        {selectedLen === 1 && (
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={onEdit}
          ></Button>
        )}
        {selectedLen === 0 && (
          <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
            Add
          </Button>
        )}
      </div>
    </div>
  );
}

export default TitleBar;
