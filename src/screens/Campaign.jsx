import { useCallback, useEffect, useState } from "react";
import { Avatar, Table, Tag, message } from "antd";
import TitleBar from "../components/TitleBar";
import { collection, getDocs, doc, writeBatch } from "firebase/firestore";
import AddCampaign from "../components/AddCampaign";
import { db } from "../config/dbConfig";
import { useDispatch, useSelector } from "react-redux";
import {
  addCampaign,
  setCampaigns,
  updateCampaign,
} from "../store/slices/campaignSlice";
import { createTimeInterval } from "../utils/helpers";
import { getRequest, postRequest } from "../services/apiServices";

function Campaign() {
  const [state, setState] = useState({
    isAddOpen: false,
    loading: false,
    selectedRows: [],
    selectedEdit: null,
  });
  const {
    campaign: { campaigns },
    location,
  } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const fetchCampaigns = useCallback(() => {
    getRequest("campaigns")
      .then((response) => {
        dispatch(
          setCampaigns(
            response.data.map((doc) => ({
              ...doc,
              key: doc.id,
            }))
          )
        );
      })
      .catch((e) => {
        console.log(e);
      });
  }, [dispatch]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

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
      dispatch(addCampaign(data));
      setState((prev) => {
        return {
          ...prev,
          selectedEdit: null,
          isAddOpen: false,
        };
      });
    } else {
      dispatch(updateCampaign(data));
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

  // const validateCampaigns = () => {
  //   const found = [];
  //   state.selectedRows.forEach((row) => {
  //     const temp = location.locations.find((item) => item.campaign === row.id);
  //     if (temp) {
  //       found.push(row.brand.name);
  //     }
  //   });
  //   if (found.length) {
  //     return `${found.join(", ")} have 1 or more active locations`;
  //   }
  //   return null;
  // };

  const handleDelete = async () => {
    try {
      // const message = validateCampaigns();
      // if (message) {
      //   messageApi.open({
      //     type: "error",
      //     content: message,
      //   });
      //   return;
      // }
      await postRequest('campaigns/delete', {ids: state.selectedRows.map(item => item.id)});
      dispatch(
        setCampaigns(
          campaigns.filter((item) => !state.selectedRows.includes(item))
        )
      );
      messageApi.open({
        type: "success",
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
        type: "error",
        content: "Error while deleting",
      });
    }
  };

  return (
    <div>
      {contextHolder}
      <AddCampaign
        isOpen={state.isAddOpen}
        selectedEdit={state.selectedEdit}
        onClose={() => handleAdd(false)}
        onFinish={handleUpsert}
      />
      <Table
        bordered
        dataSource={campaigns}
        loading={state.loading}
        rowSelection={{
          type: "checkbox",
          onChange: handleRowChange,
        }}
        columns={[
          {
            title: "Brand",
            dataIndex: "brand",
            key: "brand",
            render: (_, data) => (
              <div className="pic-name-section">
                <Avatar
                  shape="square"
                  src={<img src={data.brand.logo} alt="avatar" />}
                />
                <div>{data.brand.name}</div>
              </div>
            ),
          },
          {
            title: "Duration",
            dataIndex: "duration",
            key: "duration",
            render: (_, data) => (
              <div>{createTimeInterval(data.from, data.to)}</div>
            ),
          },
          {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (_, data) => (
              <Tag color={data.status === "active" ? "green" : "default"}>
                {data.status.toUpperCase()}
              </Tag>
            ),
          },
        ]}
        title={() => (
          <TitleBar
            title="Campaigns"
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

export default Campaign;
