import { Modal } from "antd";

function LocationDetail({ isOpen, onClose }) {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
    ></Modal>
  );
}

export default LocationDetail;
