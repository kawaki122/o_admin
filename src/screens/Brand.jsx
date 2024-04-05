import { useCallback, useEffect, useState } from "react";
import { Table, Avatar, message } from "antd";
import TitleBar from "../components/TitleBar";
import AddBrand from "../components/AddBrand";
import { useDispatch, useSelector } from "react-redux";
import { addBrand, setBrands, updateBrand } from "../store/slices/brandSlice";
import { getRequest, postRequest } from "../services/apiServices";

function Brand() {
  const [state, setState] = useState({
    isAddOpen: false,
    loading: false,
    selectedRows: [],
    selectedEdit: null,
  });
  const brands = useSelector((state) => state.brand.brands);
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const fetchBrands = useCallback(() => {
    getRequest("brands")
      .then((response) => {
        if (response.data.length) {
          dispatch(setBrands(response.data.map(item => ({...item, key: item.id}))));
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, [dispatch]);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

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
      dispatch(addBrand(data));
      setState((prev) => {
        const newState = { ...prev };
        newState.selectedEdit = null;
        newState.isAddOpen = false;
        return newState;
      });
    } else {
      dispatch(updateBrand(data));
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

  // const validateBrands = () => {
  //   const found = [];
  //   state.selectedRows.forEach((row) => {
  //     const temp = campaign.campaigns.find((item) => item.brand.id === row.id);
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
      // const message = validateBrands();
      // if (message) {
      //   messageApi.open({
      //     type: "error",
      //     content: message,
      //   });
      //   return;
      // }

      await postRequest("brands/delete", {ids: state.selectedRows.map(item => item.id)});
      dispatch(
        setBrands(brands.filter((item) => !state.selectedRows.includes(item)))
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
    <div className="brand-wrapper">
      {contextHolder}
      <AddBrand
        isOpen={state.isAddOpen}
        selectedEdit={state.selectedEdit}
        onClose={() => handleAdd(false)}
        onFinish={handleUpsert}
      />
      <Table
        bordered
        dataSource={brands}
        loading={state.loading}
        rowSelection={{
          type: "checkbox",
          onChange: handleRowChange,
        }}
        columns={[
          {
            title: "Brand",
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
            title="Brands"
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

export default Brand;
