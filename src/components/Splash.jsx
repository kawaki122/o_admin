import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/dbConfig";
import { setCities } from "../store/slices/citySlice";
import { setBrands } from "../store/slices/brandSlice";
import { setCampaigns } from "../store/slices/campaignSlice";
import { setLocations } from "../store/slices/locationSlice";
import { setRiders } from "../store/slices/riderSlice";
import { setTasks } from "../store/slices/taskSlice";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import dayjs from "dayjs";
import { Spin } from "antd";
import { setCurrentUser } from "../store/slices/homeSlice";

function Splash() {
  const dispatch = useDispatch();

  useEffect(() => {
    Promise.all([
      // getDocs(collection(db, "cities")),
      // getDocs(collection(db, "brands")),
      // getDocs(collection(db, "campaigns")),
      // getDocs(collection(db, "locations")),
      // getDocs(collection(db, "riders")),
      // getDocs(collection(db, "tasks")),
    ])
      .then((response) => {
        // const [
        //   // citySnapshot,
        //   brandSnapshot,
        //   campaignSnapshot,
        //   locationSnapshot,
        //   riderSnapshot,
        //   taskSnapshot,
        // ] = response;
        // const camps = campaignSnapshot.docs.map((doc) => ({
        //   ...doc.data(),
        //   id: doc.id,
        //   key: doc.id,
        // }));
        // const locs = locationSnapshot.docs.map((doc) => {
        //   const camp = camps.find((item) => item.id === doc.data().campaign);
        //   return {
        //     ...doc.data(),
        //     id: doc.id,
        //     key: doc.id,
        //     brand: camp?.brand,
        //   };
        // });
        // const riders = riderSnapshot.docs.map((doc) => ({
        //   ...doc.data(),
        //   id: doc.id,
        //   key: doc.id,
        // }));
        // const tasks = taskSnapshot.docs.map((doc) => {
        //   const data = doc.data();
        //   const rider = riders.find((item) => item.id === data.rider);
        //   return {
        //     ...data,
        //     id: doc.id,
        //     key: doc.id,
        //     created: dayjs(data.created).format("MMMM D, YYYY"),
        //     rider: rider ? rider : data.rider,
        //   };
        // });
        // dispatch(
        //   setCities(
        //     citySnapshot.docs.map((doc) => ({
        //       ...doc.data(),
        //       id: doc.id,
        //       key: doc.id,
        //     }))
        //   )
        // );
        // dispatch(
        //   setBrands(
        //     brandSnapshot.docs.map((doc) => ({
        //       ...doc.data(),
        //       id: doc.id,
        //       key: doc.id,
        //     }))
        //   )
        // );
        // dispatch(setCampaigns(camps));
        // dispatch(setLocations(locs));
        // dispatch(setRiders(riders));
        // dispatch(setTasks(tasks));
        //Setting user
        onAuthStateChanged(getAuth(), (user) => {
          if (user) {
            const {
              uid,
              displayName,
              email,
              emailVerified,
              phoneNumber,
              photoURL,
            } = user;
            dispatch(
              setCurrentUser({
                uid,
                displayName,
                email,
                emailVerified,
                phoneNumber,
                photoURL,
              })
            );
          } else {
            dispatch(setCurrentUser(null));
          }
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }, [dispatch]);

  return (
    <div className="splash-wrapper">
      <img src="/images/logo.jpg" alt="logo" />
      <Spin size="large" />
    </div>
  );
}

export default Splash;
