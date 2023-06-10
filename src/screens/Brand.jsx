import { useCallback, useEffect, useState } from "react";
import { Table, Avatar } from "antd";
import TitleBar from "../components/TitleBar";
import { collection, getDocs, doc, writeBatch } from "firebase/firestore";
import { db } from "../config/dbConfig";
import AddBrand from "../components/AddBrand";
import { useDispatch, useSelector } from "react-redux";
import { addBrand, setBrands, updateBrand } from "../store/slices/brandSlice";

function Brand() {
  const [state, setState] = useState({
    isAddOpen: false,
    loading: false,
    selectedRows: [],
    selectedEdit: null,
  });
  const { brands } = useSelector((state) => state.brand);
  const dispatch = useDispatch();

  const fetchBrands = useCallback(() => {
    getDocs(collection(db, "brands"))
      .then((querySnapshot) => {
        if (querySnapshot.docs.length) {
          dispatch(
            setBrands(
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

  const handleDelete = async () => {
    try {
      const batch = writeBatch(db);
      state.selectedRows.forEach((row) => {
        batch.delete(doc(db, "brands", row.id));
      });
      await batch.commit();
      dispatch(
        setBrands(brands.filter((item) => !state.selectedRows.includes(item)))
      );
      setState((prev) => ({
        ...prev,
        selectedEdit: null,
        selectedRows: [],
      }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
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
