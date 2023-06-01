import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";

function TitleBar({ title, onAdd }) {
  return (
    <div className="title-bar">
      <label className="title-heading">{title}</label>
      <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
        Add
      </Button>
    </div>
  );
}

export default TitleBar;
