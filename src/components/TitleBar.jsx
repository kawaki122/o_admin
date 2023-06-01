import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button } from "antd";

function TitleBar({ title, selectedLen, onAdd, onEdit, onDelete }) {
  return (
    <div className="title-bar">
      <label className="title-heading">{title}</label>
      <div className="actions-section">
        {selectedLen > 0 && <Button danger icon={<DeleteOutlined />} onClick={onAdd}></Button>}
        {selectedLen === 1 && <Button icon={<EditOutlined />} onClick={onEdit}></Button>}
        <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
          Add
        </Button>
      </div>
    </div>
  );
}

export default TitleBar;
