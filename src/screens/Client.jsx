import { useCallback, useEffect, useState } from "react";
import { Table, Avatar, message } from "antd";
import TitleBar from "../components/TitleBar";
import { useDispatch, useSelector } from "react-redux";
import {
  addClient,
  setClients,
  updateClient,
} from "../store/slices/brandSlice";
import AddClient from "../components/AddClient";
import { getRequest, postRequest } from "../services/apiServices";

function Client() {
  const [state, setState] = useState({
    isAddOpen: false,
    loading: false,
    selectedRows: [],
    selectedEdit: null,
  });
  const clients = useSelector((state) => state.brand.clients);
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const fetchClients = useCallback(() => {
    getRequest("clients")
      .then((response) => {
        if (response.data.length) {
          dispatch(setClients(response.data.map(item => ({...item, key: item.id}))));
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, [dispatch]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

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
      dispatch(addClient(data));
      setState((prev) => {
        const newState = { ...prev };
        newState.selectedEdit = null;
        newState.isAddOpen = false;
        return newState;
      });
    } else {
      dispatch(updateClient(data));
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

  // const validateClients = () => {
  //   const found = [];
  //   state.selectedRows.forEach((row) => {
  //     const temp = campaign.campaigns.find((item) => item.client.id === row.id);
  //     if (temp) {
  //       found.push(row.name);
  //     }
  //   });
  //   if (found.length) {
  //     return `${found.join(", ")} ${
  //       found.length > 1 ? "are" : "is"
  //     } being used in 1 or more campaigns`;
  //   }
  //   return null;
  // };

  const handleDelete = async () => {
    try {
      // const message = validateClients();
      // if (message) {
      //   messageApi.open({
      //     type: "error",
      //     content: message,
      //   });
      //   return;
      // }
      await postRequest('clients/delete', {ids: state.selectedRows.map(item => item.id)});
      dispatch(
        setClients(clients.filter((item) => !state.selectedRows.includes(item)))
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
    <div className="client-wrapper">
      {contextHolder}
      <AddClient
        isOpen={state.isAddOpen}
        selectedEdit={state.selectedEdit}
        onClose={() => handleAdd(false)}
        onFinish={handleUpsert}
      />
      <Table
        bordered
        dataSource={clients}
        loading={state.loading}
        rowSelection={{
          type: "checkbox",
          onChange: handleRowChange,
        }}
        columns={[
          {
            title: "Client",
            dataIndex: "name",
            key: "name",
            render: (_, data) => (
              <div className="pic-name-section">
                <Avatar
                  shape="square"
                  size="large"
                  src={<img src={data.logo} alt="avatar" />}
                />
                <div>{data.name}</div>
              </div>
            ),
          },
        ]}
        title={() => (
          <TitleBar
            title="Clients"
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

export default Client;
