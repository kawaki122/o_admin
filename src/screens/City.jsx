import { Space, Table } from "antd";
import TitleBar from "../components/TitleBar";

function City() {
  const data = [
    { id: 1, city: "Lahore" },
    { id: 2, city: "Islamabad" },
    { id: 3, city: "Karachi" },
  ];
  return (
    <div>
      <Table
        columns={[
          {
            title: "City",
            dataIndex: "city",
            key: "city",
          },
          {
            title: "Action",
            key: "action",
            render: (_, record) => (
              <Space size="middle">
                <a>Edit</a> | <a>Delete</a>
              </Space>
            ),
          },
        ]}
        bordered
        dataSource={data}
        title={() => <TitleBar title="Cities" />}
      />
    </div>
  );
}

export default City;
