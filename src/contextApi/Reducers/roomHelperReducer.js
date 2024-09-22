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
} from "../Actions/Type";
const initialMainRoomProps = {
  roomName: "",
  isPublic: true,
  isRoomLock:false,
  isStreamed: true,
  adminId: 0,
  isAudience: false,
  guestList: [],
  isFreeToJoin: false,
  userMediaTrack:null
};

const roomHelperReducer = (state, action) => {
  switch (action.type) {

    case REST_STATE:
      return action.payload;
    case IS_FREE_TO_JOIN:
      return {
        ...state,
        isFreeToJoin: action.payload
      };
    case SET_USER_MEDIA:
      return {
        ...state,
        userMediaTrack: action.payload
      };
    case REMOVE_FROM_GUEST_LIST:
        return {
          ...state,
          guestList: [...state.guestList].filter(item=>item[1] !== action.payload)
        };
    case ADD_TO_GUEST_LIST:
        return {
          ...state,
          guestList: [...state.guestList].push(action.payload)
        };
    case IS_JOINED_THE_ROOM:
        return {
          ...state,
          isAudience: action.payload,
        };
    case SET_ADMIN_ID:
        return {
          ...state,
          adminId: action.payload,
        };
    case SET_IS_ROOM_STRMED:
        return {
          ...state,
          isStreamed: action.payload,
        };
    case SET_IS_ROOM_PUBLIC:
        return {
          ...state,
          isPublic: action.payload,
        };
    case ADD_ROOM_NAME:
      return {
        ...state,
        roomName: action.payload,
      };
      case UP_DATE_GUEST_LIST:
        return {
          ...state,
          guestList: action.payload
        };
        case HIDE_THE_ROOM:
          return {
            ...state,
            isRoomLock: action.payload
          };
    default:
      break;
  }
};

export default roomHelperReducer;
