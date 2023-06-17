import { useCallback, useEffect, useState } from "react";
import { Table, Avatar, message } from "antd";
import TitleBar from "../components/TitleBar";
import { collection, getDocs, doc, writeBatch } from "firebase/firestore";
import { db } from "../config/dbConfig";
import { addRider, setRiders, updateRider } from "../store/slices/riderSlice";
import AddRider from "../components/AddRider";
import { useDispatch, useSelector } from "react-redux";

function Rider() {
  const [state, setState] = useState({
    isAddOpen: false,
    loading: false,
    selectedRows: [],
    selectedEdit: null,
  });
  const { riders } = useSelector((state) => state.rider);
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const fetchRiders = useCallback(() => {
    getDocs(collection(db, "riders"))
      .then((querySnapshot) => {
        if (querySnapshot.docs.length) {
          dispatch(
            setRiders(
              querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
                key: doc.id,
              }))
            )
          );
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, [dispatch]);

  useEffect(() => {
    fetchRiders();
  }, [fetchRiders]);

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
      dispatch(addRider(data));
      setState((prev) => {
        const newState = { ...prev };
        newState.selectedEdit = null;
        newState.isAddOpen = false;
        return newState;
      });
    } else {
      dispatch(updateRider(data));
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

  const handleDelete = async () => {
    try {
      const batch = writeBatch(db);
      state.selectedRows.forEach((row) => {
        batch.delete(doc(db, "riders", row.id));
      });
      await batch.commit();
      dispatch(
        setRiders(riders.filter((item) => !state.selectedRows.includes(item)))
      );
      messageApi.open({
        type: 'success',
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
        type: 'error',
        content: 'Error while deleting',
      });
    }
  };

  return (
    <div>
      {contextHolder}
      <AddRider
        isOpen={state.isAddOpen}
        selectedEdit={state.selectedEdit}
        onClose={() => handleAdd(false)}
        onFinish={handleUpsert}
      />
      <Table
        bordered
        dataSource={riders}
        loading={state.loading}
        rowSelection={{
          type: "checkbox",
          onChange: handleRowChange,
        }}
        columns={[
          {
            title: "Rider",
            dataIndex: "name",
            key: "name",
            render: (_, data) => (
              <div className="pic-name-section">
                <Avatar
                  size="large"
                  src={<img src={data.picture} alt="avatar" />}
                />
                <div>{data.name}</div>
              </div>
            ),
          },
          {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
            render: (_, data) => (
                <div>+92{data.phone}</div>
            ),
          },
        ]}
        title={() => (
          <TitleBar
            title="Riders"
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

export default Rider;
