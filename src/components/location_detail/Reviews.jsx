import { Avatar, List } from "antd";

function Reviews() {
  return (
    <List
      itemLayout="horizontal"
      dataSource={[{title: 'Zaid'},{title: 'Sohaib'},{title: 'Ishfaq'},{title: 'Zohaib'}]}
      renderItem={(item, index) => (
        <List.Item>
          <List.Item.Meta
            avatar={
              <Avatar
                src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
              />
            }
            title={<a href="https://ant.design">{item.title}</a>}
            description="Ant Design, a design language for background applications, is refined by Ant UED Team"
          />
        </List.Item>
      )}
    />
  );
}

export default Reviews;
