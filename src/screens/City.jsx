import { useEffect, useState } from "react";
import { Table } from "antd";
import TitleBar from "../components/TitleBar";
import { collection, getDocs, doc, writeBatch } from "firebase/firestore";
import AddCity from "./AddCity";
import { db } from "../config/dbConfig";

function City() {
  const [state, setState] = useState({
    isAddOpen: false,
    cities: [],
    loading: true,
    selectedRows: [],
    selectedEdit: null,
  });

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = () => {
    getDocs(collection(db, "cities"))
      .then((querySnapshot) => {
        setState((prev) => ({
          ...prev,
          cities: querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
            key: doc.id,
          })),
          loading: false,
        }));
      })
      .catch((e) => {
        console.log(e);
        setState((prev) => ({
          ...prev,
          loading: false,
        }));
      });
  };

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
      setState((prev) => {
        const newState = { ...prev };
        newState.cities = [...newState.cities, data];
        newState.selectedEdit = null;
        newState.isAddOpen = false;
        return newState;
      });
    } else {
      setState((prev) => {
        const newCities = [...prev.cities];
        const index = newCities.findIndex((item) => item.id === data.id);
        if (index !== -1) {
          newCities[index] = data;
        }

        return {
          ...prev,
          selectedEdit: null,
          isAddOpen: false,
          cities: newCities,
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
      setState((prev) => ({
        ...prev,
        selectedEdit: null,
        selectedRows: [],
        cities: prev.cities.filter((item) => !prev.selectedRows.includes(item)),
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
        dataSource={state.cities}
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
