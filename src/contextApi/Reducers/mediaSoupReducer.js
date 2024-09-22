import {
  SET_DEVICE,
  DELETE_DEVICE,
  ADD_PARAM,
  ADD_PRODUCER_TRANSPORT,
  REMOVE_PRODUCER_TRANSPORT,
  ADD_CONSUMER_TRANSPORT,
  REMOVE_CONSUMER_TRANSPORT,
  REST_STATE
} from "../Actions/Type";

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

const mediaSoupReducer = (state, action) => {
  switch (action.type) {

    case REST_STATE:
      return action.payload;
    case SET_DEVICE:
      return {
        ...state,
        device: action.payload,
      };
      case ADD_PARAM:
        return {
          ...state,
          params: action.payload,
        };
    case DELETE_DEVICE:
      return {
        ...state,
        device: null,
      };
    case ADD_PRODUCER_TRANSPORT:

      return {
        ...state,
        producerTransport: action.payload,
      };
    case REMOVE_PRODUCER_TRANSPORT:
      return {
        ...state,
        producerTransport: null,
      };
    case ADD_CONSUMER_TRANSPORT:
      return {
        ...state,
        consumerTransports: action.payload,
      };
    case REMOVE_CONSUMER_TRANSPORT:
      return {
        state,
        consumerTransports: [...state.consumerTransports].filter(
          (transportData) => transportData.producerId !== action.payload
        ),
      };

    default:
      break;
  }
};

export default mediaSoupReducer;