import { Modal, Rate, Tabs } from "antd";
import { locationTabs } from "../../utils/constants";
import About from "./About";
import Photos from "./Photos";
import Reviews from "./Reviews";
import RiderSection from "./RiderSection";

function LocationDetail({ isOpen, onClose, location }) {
  const screens = [<About location={location} />, <Photos location={location} />, <Reviews />, <RiderSection location={location} />]
  return (
    <Modal open={isOpen} onCancel={onClose} footer={null}>
      <div>
        <img src="map_lahore.png" style={{ width: "100%" }} />
      </div>
      <div className="list-tile-container">
        <div className="tile-title">{location?.brand.name}</div>
        <Rate value={3} disabled className="tile-rate" />
        <div className="tile-description">
          {location?.address}
        </div>
      </div>
      <Tabs
        defaultActiveKey="2"
        items={locationTabs.map((item, i) => {
          const id = String(i + 1);

          return {
            label: (
              <span>
                {item.Icon}
                {item.text}
              </span>
            ),
            key: id,
            children: <div className="location-tab-child">{screens[i]}</div>,
          };
        })}
      />
    </Modal>
  );
}

export default LocationDetail;
