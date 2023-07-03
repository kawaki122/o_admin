import { CaretRightOutlined } from "@ant-design/icons";
import { Image } from "antd";

function Photos({ location }) {
  return (
    <div style={{display: 'flex', flexWrap: 'wrap'}}>
      {location.files.map((file) =>
        file.type === "video" ? (
          <div className="thumbnail-container" style={{width: '200px'}}>
            <img src={file.thumb} style={{ padding: "5px" }} />
            <div className="thumbnail-overlay" style={{margin: '5px'}}>
              <CaretRightOutlined style={{ fontSize: "46px", color: "#fff" }} />
            </div>
          </div>
        ) : (
          <Image width={200} src={file.thumb} style={{ padding: "5px" }} />
        )
      )}
    </div>
  );
}

export default Photos;
