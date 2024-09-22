import {
  SET_DEVICE,
  DELETE_DEVICE,
  ADD_PRODUCER_TRANSPORT,
  REMOVE_PRODUCER_TRANSPORT,
  ADD_CONSUMER_TRANSPORT,
  REMOVE_CONSUMER_TRANSPORT,
  ADD_PARAM,
  REST_STATE
} from "./Type";

export const  restMediaSoupState = (state,dispatch) =>{
  
  dispatch({payload:state,type:REST_STATE})

}
export const  setParam = (param ,dispatch) =>{

  dispatch({payload:param,type:ADD_PARAM})

}

export const  setDevice = (Device ,dispatch) =>{

  dispatch({payload:Device,type:SET_DEVICE})

}

export const  deleteDevice = (Device ,dispatch) =>{

  dispatch({payload:Device,type:DELETE_DEVICE})

}

export const  addProducerTransport = (transport ,dispatch) =>{

  dispatch({payload:transport,type:ADD_PRODUCER_TRANSPORT})

}

export const  removeProducerTransport = (transport ,dispatch) =>{

  dispatch({payload:transport,type:REMOVE_PRODUCER_TRANSPORT})

}

export const  addConsumerTransport = (transport ,dispatch) =>{

  dispatch({payload:transport,type:ADD_CONSUMER_TRANSPORT})

}

export const  removeConsumerTransport = (transport ,dispatch) =>{

  dispatch({payload:transport,type:REMOVE_CONSUMER_TRANSPORT})

}

