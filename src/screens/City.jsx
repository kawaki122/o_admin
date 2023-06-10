import { useCallback, useEffect, useState } from "react";
import { Table } from "antd";
import TitleBar from "../components/TitleBar";
import { collection, getDocs, doc, writeBatch } from "firebase/firestore";
import AddCity from "../components/AddCity";
import { db } from "../config/dbConfig";
import { useDispatch, useSelector } from "react-redux";
import { addCity, setCities, updateCity } from "../store/slices/citySlice";

function City() {
  const [state, setState] = useState({
    isAddOpen: false,
    loading: false,
    selectedRows: [],
    selectedEdit: null,
  });
  const { cities } = useSelector((state) => state.city);
  const dispatch = useDispatch();

  const fetchCities = useCallback(() => {
    getDocs(collection(db, "cities"))
      .then((querySnapshot) => {
        if (querySnapshot.docs.length) {
          dispatch(
            setCities(
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
    fetchCities();
  }, [fetchCities]);

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
      dispatch(addCity(data));
      setState((prev) => {
        return {
          ...prev,
          selectedEdit: null,
          isAddOpen: false,
        };
      });
    } else {
      dispatch(updateCity(data));
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
        batch.delete(doc(db, "cities", row.id));
      });
      await batch.commit();
      dispatch(
        setCities(cities.filter((item) => !state.selectedRows.includes(item)))
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
      <AddCity
        isOpen={state.isAddOpen}
        selectedEdit={state.selectedEdit}
        onClose={() => handleAdd(false)}
        onFinish={handleUpsert}
      />
      <Table
        bordered
        dataSource={cities}
        loading={state.loading}
        rowSelection={{
          type: "checkbox",
          onChange: handleRowChange,
        }}
        columns={[
          {
            title: "City",
            dataIndex: "city",
            key: "city",
          },
        ]}
        title={() => (
          <TitleBar
            title="Cities"
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

export default City;
