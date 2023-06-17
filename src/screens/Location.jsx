import { List, Card, Avatar, Popconfirm, message } from "antd";
import { useCallback, useEffect, useState } from "react";
import TitleBar from "../components/TitleBar";
import { collection, getDocs, doc, writeBatch } from "firebase/firestore";
import { db } from "../config/dbConfig";
import AddLocation from "../components/AddLocation";
import {
  DeleteOutlined,
  EditOutlined,
  FullscreenOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  addLocation,
  setLocations,
  updateLocation,
} from "../store/slices/locationSlice";
import { textElipsis } from "../utils/helpers";
import LocationDetail from "../components/location_detail/LocationDetail";

function Location() {
  const [state, setState] = useState({
    isAddOpen: false,
    loading: false,
    selected: null,
    isDetailOpen: false,
  });
  const {
    campaign: { campaigns },
    location: { locations },
  } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const fetchLocations = useCallback(() => {
    setState((prev) => ({
      ...prev,
      loading: true,
    }));
    getDocs(collection(db, "locations"))
      .then((querySnapshot) => {
        if (querySnapshot.docs.length) {
          dispatch(
            setLocations(
              querySnapshot.docs.map((doc) => {
                const camp = campaigns.find(
                  (item) => item.id === doc.data().campaign
                );
                return {
                  ...doc.data(),
                  id: doc.id,
                  key: doc.id,
                  brand: camp?.brand,
                };
              })
            )
          );
        }
        setState((prev) => ({
          ...prev,
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
  }, [dispatch, campaigns]);

  useEffect(() => {
    if (campaigns.length > 0 && locations.length === 0) {
      fetchLocations();
    }
  }, [campaigns, locations, fetchLocations]);

  const handleEdit = (selected) => {
    setState((prev) => ({ ...prev, selected, isAddOpen: true }));
  };

  const handleAdd = (isOpen) => setState((p) => ({ ...p, isAddOpen: isOpen, selected: isOpen? p.selected:null, }));

  const handleUpsert = (action, data) => {
    if (action === "ADD_ACTION") {
      dispatch(addLocation(data));
      setState((prev) => {
        const newState = { ...prev };
        newState.selected = null;
        newState.isAddOpen = false;
        return newState;
      });
    } else {
      dispatch(updateLocation(data));
      setState((prev) => {
        return {
          ...prev,
          selected: null,
          isAddOpen: false,
        };
      });
    }
  };

  const handleDelete = async (selected) => {
    try {
      const batch = writeBatch(db);
      batch.delete(doc(db, "locations", selected.id));
      await batch.commit();
      dispatch(
        setLocations(locations.filter((item) => item.id !== selected.id))
      );
      messageApi.open({
        type: 'success',
        content: "Deleted successfully",
      });
    } catch (error) {
      console.log(error);
      messageApi.open({
        type: 'error',
        content: 'Error while deleting',
      });
    }
  };

  const toggleDetail = (open, data) => {
    setState(prev => ({...prev, isDetailOpen: open, selected: open ? data : null }))
  }

  return (
    <div>
      {contextHolder}
      <AddLocation
        isOpen={state.isAddOpen}
        selectedEdit={state.selected}
        onClose={() => handleAdd(false)}
        onFinish={handleUpsert}
      />
      <TitleBar
        title="Locations"
        onAdd={() => handleAdd(true)}
        selectedLen={0}
      />
      <br />
      <br />
      <br />
      <List
        grid={{
          gutter: 16,
          // column: 4,
        }}
        loading={state.loading}
        dataSource={locations}
        renderItem={(item) => (
          <List.Item>
            <Card
              style={{ width: 300 }}
              cover={item.files.length?<img alt="example" src={item.files[0]} />:null}
              actions={[
                <Popconfirm
                  title="Delete this Data"
                  placement="top"
                  description="Are you sure to delete this data?"
                  onConfirm={() => handleDelete(item)}
                  okText="Ok"
                  cancelText="Cancel"
                >
                  <DeleteOutlined
                    key="delete"
                  />
                </Popconfirm>,
                <EditOutlined key="edit" onClick={() => handleEdit(item)} />,
                <FullscreenOutlined key="ellipsis" onClick={() => toggleDetail(true, item)} />,
              ]}
            >
              <Card.Meta
                avatar={<Avatar src={item.brand.logo} />}
                title={item.brand.name}
                description={textElipsis(item.address, 55)}
              />
            </Card>
          </List.Item>
        )}
      />
      <LocationDetail isOpen={state.isDetailOpen} onClose={() => toggleDetail(false)} location={state.selected} />
    </div>
  );
}

export default Location;
