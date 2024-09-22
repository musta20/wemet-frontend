import {
    ADD_ROOM_NAME,
    SET_IS_ROOM_PUBLIC,
    SET_IS_ROOM_STRMED,
    SET_ADMIN_ID,
    IS_JOINED_THE_ROOM,
    ADD_TO_GUEST_LIST,
    REMOVE_FROM_GUEST_LIST,
    UP_DATE_GUEST_LIST,
    SET_USER_MEDIA,
    IS_FREE_TO_JOIN,
    REST_STATE,
    HIDE_THE_ROOM
  } from "./Type";
  export const  restRoomState = (state,dispatch) =>{
  
    dispatch({payload:state,type:REST_STATE})
  
  }

  export const  setIsFreeToJoin = (name ,dispatch) =>{
  
    dispatch({payload:name,type:IS_FREE_TO_JOIN})
  
  }

  export const  setRoomName = (name ,dispatch) =>{
  
    dispatch({payload:name,type:ADD_ROOM_NAME})
  
  }
  
  export const  isRoomPublic = (isRoompublic ,dispatch) =>{
  
    dispatch({payload:isRoompublic,type:SET_IS_ROOM_PUBLIC})
  
  }
  
  export const  isRoomStream = (IsRoomStream ,dispatch) =>{
  
    dispatch({payload:IsRoomStream,type:SET_IS_ROOM_STRMED})
  
  }
  
  export const  HiddeTheRoom = (IsRoomStream ,dispatch) =>{
  
    dispatch({payload:IsRoomStream,type:HIDE_THE_ROOM})
  
  }
  

  
  export const  setAdminId = (Id ,dispatch) =>{
  
    dispatch({payload:Id,type:SET_ADMIN_ID})
  
  }
  
  export const  setIsAudience = (joinedTheRoom ,dispatch) =>{
  
    dispatch({payload:joinedTheRoom,type:IS_JOINED_THE_ROOM})
  
  }

  export const  setUserMedia = (Track ,dispatch) =>{
  
    dispatch({payload:Track,type:SET_USER_MEDIA})
  
  }
  
  export const  addToGuestList = (Guest ,dispatch) =>{
  
    dispatch({payload:Guest,type:ADD_TO_GUEST_LIST})
  
  }
  
  export const  removeFromGuestList = (Guest ,dispatch) =>{
  
    dispatch({payload:Guest,type:REMOVE_FROM_GUEST_LIST})
  
  }
  
  export const  upDateGuestList = (GuestL ,dispatch) =>{
  
    dispatch({payload:GuestL,type:UP_DATE_GUEST_LIST})
  
  }