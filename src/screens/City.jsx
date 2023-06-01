import { useEffect, useState } from "react";
import { Space, Table } from "antd";
import TitleBar from "../components/TitleBar";
import { collection, getDocs } from "firebase/firestore";
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
    setState((prev) => ({ ...prev, selectedRows }));
  };

  return (
    <div>
      <AddCity
        isOpen={state.isAddOpen}
        selectedEdit={state.selectedEdit}
        onClose={() => handleAdd(false)}
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
            selectedLen={state.selectedRows.length}
          />
        )}
      />
    </div>
  );
}

export default City;
