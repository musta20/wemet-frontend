
import   {io}  from "socket.io-client";

import React from 'react';

export const Socket = io(import.meta.env.VITE_REACT_APP_BACKE_END_URL,{
    autoConnect: false
  });

 
export const SocketContext = React.createContext();
