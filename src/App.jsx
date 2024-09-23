import React, { useEffect, useReducer, useRef } from "react";
//  import Body from "../src/pages/body"
import Meet from "./pages/Meet";
import Switcher from "./components/Switcher";
import Footer from "./components/Footer";
//  import Terms from "../src/pages/Terms"
// import Privacy from "../src/pages/Privacy"
// import Guidelines from "../src/pages/Guidelines"
import {restMediaSoupState} from "./contextApi/Actions/mediaSoupAction";
import {restChatState} from "./contextApi/Actions/massengerHelperAction";
import {restRoomState} from "./contextApi/Actions/roomHelperAction";

import massengerReducer from "./contextApi/Reducers/massengerReducer";
import mediaSoupReducer from "./contextApi/Reducers/mediaSoupReducer";
import roomHelperReducer from "./contextApi/Reducers/roomHelperReducer";

import { SocketContext, Socket  } from "./contextApi/Contexts/socket";
import { AppContext } from "./contextApi/Contexts/AppContext";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Lobby from "./pages/Lobby";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  
  const initialMainRoomProps = {
    roomName: "",
    isPublic: true,
    userMediaTrack:null,
    isRoomLock:false,
    isFreeToJoin:false,
    isStreamed: true,
    adminId: 0,
    isAudience: false,
    
    guestList: [{
      id:0,
      name:"",
      feed:useRef(null)
    },{
      id:0,
      name:"",

      feed:useRef(null)
    },{
      id:0,
      name:"",

      feed:useRef(null)
    },{
      id:0,
      name:"",

      feed:useRef(null)
    }],
  };

  const initialMassengerProps = {
    HistoryChat: [],
    ChatMessage: "",
    PrivetMessage: "",
  };

  const initialMediaSoupProps = {
    device: null,
    producerTransport: false,
    consumerTransports: [],
    params:{
      // mediasoup configratio params
      encodings: [
        {
          rid: "r0",
          maxBitrate: 100000,
          scalabilityMode: "S1T3",
        },
        {
          rid: "r1",
          maxBitrate: 300000,
          scalabilityMode: "S1T3",
        },
        {
          rid: "r2",
          maxBitrate: 900000,
          scalabilityMode: "S1T3",
        },
      ],
      // https://mediasoup.org/documentation/v3/mediasoup-client/api/#ProducerCodecOptions
      codecOptions: {
        videoGoogleStartBitrate: 1000,
      },
    }
  };

const [roomState, roomDispatch] = useReducer(
  roomHelperReducer,
  initialMainRoomProps
);
const [mediaSoupstate, mediaSoupDispatch] = useReducer(
  mediaSoupReducer,
  initialMediaSoupProps
);
const [massengerstate, massengerDispatch] = useReducer(
  massengerReducer,
  initialMassengerProps
);

const restAllState =()=>{
  
  restRoomState(initialMainRoomProps,roomDispatch);
  restChatState(initialMassengerProps,massengerDispatch);
  restMediaSoupState(initialMediaSoupProps,mediaSoupDispatch);
}

 const MainRoomContex = {
  massengerstate,
  massengerDispatch,
  roomState,
  roomDispatch,
  mediaSoupstate,
  mediaSoupDispatch,
  restAllState
};
 useEffect(()=>{
  if (!Socket.connected) Socket.connect();

  return ()=>Socket.disconnect();
 },[]);

return (
    <AppContext.Provider value={MainRoomContex}>
    <SocketContext.Provider value={Socket}>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Header />
          <ToastContainer
              position="top-right"
               autoClose={3000}
              hideProgressBar={false}
               newestOnTop={false}
               closeOnClick
               rtl={false}
               pauseOnFocusLoss
               draggable
               pauseOnHover
              theme="light"
            />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Lobby />}></Route>
              <Route path="meet/:Room" element={<Meet />}></Route>
              <Route path="Switcher/" element={<Switcher />}></Route>
              {/* <Route path="Terms/" element={<Terms />}></Route>
              <Route path="Privacy/" element={<Privacy />}></Route>
              <Route path="Guidelines/" element={<Guidelines />}></Route> */}
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </SocketContext.Provider>
  </AppContext.Provider>
  );
}

export default App;