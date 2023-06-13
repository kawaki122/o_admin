import { List } from "antd";
import { locationAbouts } from "../../utils/constants";

function About({ location }) {
  return (
    <List
      itemLayout="horizontal"
      dataSource={locationAbouts(location)}
      renderItem={(item, index) => (
        <List.Item>
          <List.Item.Meta
            avatar={item.Icon}
            // title={<a href="https://ant.design">Locvation</a>}
            description={item.text}
          />
        </List.Item>
      )}
    />
  );
}

export default About;
