import { List, Card } from "antd";
import { useEffect, useState } from "react";
import TitleBar from "../components/TitleBar";
import { collection, getDocs, doc, writeBatch } from "firebase/firestore";
import { db } from "../config/dbConfig";
import AddLocation from "../components/AddLocation";

function Location() {
  const [state, setState] = useState({
    isAddOpen: false,
    locations: [],
    loading: true,
    selectedRows: [],
    selectedEdit: null,
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = () => {
    getDocs(collection(db, "locations"))
      .then((querySnapshot) => {
        setState((prev) => ({
          ...prev,
          locations: querySnapshot.docs.map((doc) => ({
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
        newState.locations = [...newState.locations, data];
        newState.selectedEdit = null;
        newState.isAddOpen = false;
        return newState;
      });
    } else {
      setState((prev) => {
        const newLocations = [...prev.locations];
        const index = newLocations.findIndex((item) => item.id === data.id);
        if (index !== -1) {
          newLocations[index] = data;
        }

        return {
          ...prev,
          selectedEdit: data,
          selectedRows: [data],
          isAddOpen: false,
          locations: newLocations,
        };
      });
    }
  };

  const handleDelete = async () => {
    try {
      const batch = writeBatch(db);
      state.selectedRows.forEach((row) => {
        batch.delete(doc(db, "locations", row.id));
      });
      await batch.commit();
      setState((prev) => ({
        ...prev,
        selectedEdit: null,
        selectedRows: [],
        locations: prev.locations.filter(
          (item) => !prev.selectedRows.includes(item)
        ),
      }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <AddLocation
        isOpen={state.isAddOpen}
        selectedEdit={state.selectedEdit}
        onClose={() => handleAdd(false)}
        onFinish={handleUpsert}
      />
      <TitleBar
        title="Locations"
        onEdit={handleEdit}
        onAdd={() => handleAdd(true)}
        onDelete={handleDelete}
        selectedLen={state.selectedRows.length}
      />

      <List
        grid={{
          gutter: 16,
          column: 4,
        }}
        loading={state.loading}
        dataSource={state.locations}
        renderItem={(item) => (
          <List.Item>
            <Card title={"Title"}>Card content</Card>
          </List.Item>
        )}
      />
    </div>
  );
}

export default Location;
