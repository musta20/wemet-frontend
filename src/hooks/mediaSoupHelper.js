import { Device } from "mediasoup-client";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../src/contextApi/Contexts/AppContext";
import {
  setDevice,
  addProducerTransport,
  addConsumerTransport,
} from "../../src/contextApi/Actions/mediaSoupAction";

import { SocketContext } from "../../src/contextApi/Contexts/socket";
import {
  upDateGuestList,
  setIsFreeToJoin,
} from "../../src/contextApi/Actions/roomHelperAction";

export const useMediaSoupHelper = () => {
  const {
    mediaSoupstate,
    mediaSoupDispatch,
    roomDispatch,
    roomState,
    restAllState,
  } = useContext(AppContext);
  
  const Socket = useContext(SocketContext);

  const { device, params, producerTransport, consumerTransports } =
    mediaSoupstate;

  const { roomName, adminId, userMediaTrack, isAudience, guestList } =
    roomState;

  const Unmount = () => {
    //Socket.emit("leave", { name: "leav" }, () => {});
    Socket.disconnect();

    restAllState();
  };

  //This function will set listener for in/out calls
  const setMediaSoupListner = () => {

    /*
     This event new-prouducer trigred when a new user is joined the room and
     clint will receive his stream via producerId and socketId is his socket id
     */

    Socket.on("new-producer",newProducer);

    /*
      this event triggered when user close his stream you should close
      the connection to prevent memory leak
    */
 
    Socket.on("producer-closed",closeProducer);



  };

  const unSetMediaSoupListner = () => {

    /*
     This event new-prouducer trigred when a new user is joined the room and
     clint will receive his stream via producerId and socketId is his socket id
     */

    Socket.off("new-producer",newProducer);

    /*
      this event triggered when user close his stream you should close
      the connection to prevent memory leak
    */
 
    Socket.off("producer-closed",closeProducer);



  };

  const completeSession = (id) => {
 

    const copyGuesList = [...guestList];

    const indexGuest = copyGuesList.findIndex((item) => item.id === id);
  
     if (indexGuest >= 0) {

      copyGuesList[indexGuest].id = 0;
      copyGuesList[indexGuest].feed.current.srcObject = null;
      copyGuesList[indexGuest].name = "";

      upDateGuestList(copyGuesList, roomDispatch);

      if(copyGuesList.every((item) => item.id === 0)){
       
        window.location.replace("/");
        
      }

    }


  };

  //this function will create a device for mediasoup api
  const createDevice = async (routerRtpCapabilities) => {
     try {
      let newDevice = new Device();

      // https://mediasoup.org/documentation/v3/mediasoup-client/api/#device-load
      // Loads the device with RTP capabilities of the Router (server side)
      // let routerRtpCapabilities = rtpCapabilities
      // let cap = {routerRtpCapabilities: rtpCapabilities};
      // console.error("rtp capapltet");
      // console.log(routerRtpCapabilities);

      await newDevice.load({ routerRtpCapabilities });

      setDevice(newDevice, mediaSoupDispatch);

    } catch (error) {
      console.warn("browser not supported");
      console.log(error);
      if (error.name === "UnsupportedError")
        console.warn("browser not supported");
    }
  };

  const newProducer =   async ({ producerId, socketId, name }) => {
    signalNewConsumerTransport(producerId, socketId , name);
  }
  const closeProducer =  async ({ remoteProducerId, socketId }) => {
      
    //find the specific transport and close it

    try {
      const producerToClose = consumerTransports.find(
        (transportData) => transportData.producerId === remoteProducerId
      );
      if (producerToClose){  producerToClose.consumerTransport.close();}
      if (producerToClose){ producerToClose.consumer.close();}
    } catch (e) {
      console.error(e);
    }
  // remove the consumer transport from the list
    
   // console.log(consumerTransports.length)
    let ConsumerTransports = [
      ...consumerTransports.filter(
        (transportData) => transportData.producerId !== remoteProducerId
      ),
    ];
   // console.log(consumerTransports.length)

    addConsumerTransport(ConsumerTransports, mediaSoupDispatch);
    // setConsumerTransports(ConsumerTransports);
    // hide the video div element
    completeSession(socketId);
  };

  /*
   this function used when new user join the room and it take
   the remot-pruducer and socketid create a receive transport
   and tell the server to create a consumer transport 
   */

  const signalNewConsumerTransport = async (remoteProducerId, socketId , name) => {
    await Socket.emit(
      "createWebRtcTransport",
      { consumer: true },
      ({ params }) => {
        // The server sends back params needed
        // to create Send Transport on the client side
        if (params.error) {
          console.log(params.error);
          return;
        }

        let consumerTransport;
        try {
          consumerTransport = device.createRecvTransport(params);
        } catch (error) {
          // exceptions:
          // {InvalidStateError} if not loaded
          // {TypeError} if wrong arguments.
          console.log(error);
          return;
        }

        consumerTransport.on(
          "connect",
          async ({ dtlsParameters }, callback, errback) => {
            try {
               // Signal local DTLS parameters to the server side transport
              // see server's Socket.on('transport-recv-connect', ...)
              await Socket.emit("transport-recv-connect", {
                dtlsParameters,
                serverConsumerTransportId: params.id,
              });

              // Tell the transport that parameters were transmitted.
              callback();
            } catch (error) {
              // Tell the transport that something was wrong
              errback(error);
            }
          }
        );
         // after creating the transport connect to it
        connectRecvTransport(
          consumerTransport,
          remoteProducerId,
          socketId,
          params.id,
          name
        );
      }
    );
    //if clint check if room is available to join
    if (isAudience) {
      Socket.emit("isFreeToJoin", { roomName: roomName }, (data) => {
        if (data.status) {
          setIsFreeToJoin(true, roomDispatch);
        } else {
          setIsFreeToJoin(false, roomDispatch);
        }
      });
    }
  };

  //this function will create transport to send your stream
  const createSendTransport = () => {
    /*
     console.log("IAM SENDING createSendTransport");
     see server's Socket.on('createWebRtcTransport', sender?, ...)
     this is a call from Producer, so sender = true
     console.log(`the emtion came from here`);
    */
    Socket.emit("createWebRtcTransport", { consumer: false }, ({ params }) => {
      // The server sends back params needed
      // to create Send Transport on the client side
      if (params.error) {
        console.log(params.error);
        return;
      }

      // creates a new WebRTC Transport to send media
      // based on the server's producer transport params
      // https://mediasoup.org/documentation/v3/mediasoup-client/api/#TransportOptions
      let pproducerTransport = device.createSendTransport(params);
      // https://mediasoup.org/documentation/v3/communication-between-client-and-server/#producing-media
      // this event is raised when a first call to transport.produce() is made
      // see connectSendTransport() below
      pproducerTransport.on(
        "connect",
        async ({ dtlsParameters }, callback, errback) => {
          try {
            // Signal local DTLS parameters to the server side transport
            // see server's Socket.on('transport-connect', ...)
            await Socket.emit("transport-connect", {
              dtlsParameters,
            });

            // Tell the transport that parameters were transmitted.
            callback();
          } catch (error) {
            console.log(error);
            errback(error);
          }
        }
      );

      pproducerTransport.on(
        "produce",
        async (parameters, callback, errback) => {

          try {
            // tell the server to create a Producer
            // with the following parameters and produce
            // and expect back a server side producer id
            // see server's Socket.on('transport-produce', ...)
            await Socket.emit(
              "transport-produce",
              {
                kind: parameters.kind,
                rtpParameters: parameters.rtpParameters,
                appData: parameters.appData,
              },
              ({ id, producersExist }) => {
                 // Tell the transport that parameters were transmitted and provide it with the
                // server side producer's id.
                callback({ id });
             //   console.log(producersExist);
                // if producers exist, then join room
                //  setTimeout(() => {
                //  console.log('producersExist', producersExist);
                if (producersExist) getProducers();

                // }, 2000);
              }
            );
          } catch (error) {
            console.log(error);

            errback(error);
          }
        }
      );
      connectSendTransport(pproducerTransport);
      addProducerTransport(pproducerTransport, mediaSoupDispatch);
    });
  };

  //this function will get all
  // current producer from the server and counsume them
  const getProducers = () => {

    Socket.emit(
      "getProducers",
      {
        isViewr: isAudience,
        roomName: roomName,
      },
      (producerIds) => {
        // for each of the producer create a consumer
         
        producerIds.forEach(
          (
            producer 
            
          ) => signalNewConsumerTransport(producer[0], producer[1],producer[2])
        );
      }
    );
  };

  const AddMediaStream = async (userid, stream ,name) => {

    let copyGuesList = [...guestList];

    const isInGuestList = guestList.findIndex((item) => item.id === userid);
    
    if (userid === adminId) {

      const indexOfEmptyVideo = copyGuesList.findIndex((item) => item.id === 0);

      if (!isAudience &&  copyGuesList[indexOfEmptyVideo].feed.current ) {

        copyGuesList[indexOfEmptyVideo].id = Socket.id;

        copyGuesList[indexOfEmptyVideo].feed.current.srcObject = userMediaTrack;

        copyGuesList[indexOfEmptyVideo].name =   copyGuesList[0].name;

      }
       copyGuesList[0].feed.current.srcObject = stream;
       copyGuesList[0].id = userid;
       copyGuesList[0].name = name;



      await upDateGuestList(copyGuesList, roomDispatch);

      return;
    }

    if (isInGuestList > 0) {

      copyGuesList[isInGuestList].id = userid;
      copyGuesList[isInGuestList].name = name;

      copyGuesList[isInGuestList].feed.current.srcObject = stream;

    } else {

      const indexOfEmptyVideoVistir = guestList.findIndex(
        (item) => item.id === 0
      );

      copyGuesList[indexOfEmptyVideoVistir].id = userid;
      copyGuesList[indexOfEmptyVideoVistir].name = name;

      copyGuesList[indexOfEmptyVideoVistir].feed.current.srcObject = stream;

    }

    await upDateGuestList(copyGuesList, roomDispatch);

 
  };


  //connect the receiver transport
  const connectRecvTransport = async (
    consumerTransport,
    remoteProducerId,
    socketId,
    serverConsumerTransportId,
    name
  ) => {
  //  console.log("connectRecvTransport");
    // for consumer, we need to tell the server first
    // to create a consumer based on the rtpCapabilities and consume
    // if the router can consume, it will send back a set of params as below
    await Socket.emit(
      "consume",
      {
        rtpCapabilities: device.rtpCapabilities,
        remoteProducerId,
        serverConsumerTransportId,
      },
      async ({ params }) => {
        if (params.error) {
    
          return;
        }

   
        // then consume with the local consumer transport
        // which creates a consumer
         const consumer = await consumerTransport.consume({
          id: params.id,
          producerId: params.producerId,
          kind: params.kind,
          rtpParameters: params.rtpParameters,
        });

        const copyConsumerTransports = [
          ...consumerTransports,
          {
            consumerTransport,
            serverConsumerTransportId: params.id,
            producerId: remoteProducerId,
            consumer,
          },
        ];
        
        addConsumerTransport(copyConsumerTransports, mediaSoupDispatch);

        const { track } = consumer;

        //add the new stream to the view
        try {
          AddMediaStream(socketId, new MediaStream([track]),name);
        } catch (error) {
          //      console.log(error);
        }
        // the server consumer started with media paused
        // so we need to inform the server to resume

        Socket.emit("consumer-resume", {
          serverConsumerId: params.serverConsumerId,
        });
      }
    );
  };

  //this function will connect our send transport to the server
  const connectSendTransport = async (pproducerTransport) => {
    // we now call produce() to instruct the producer transport
    // to send media to the Router
    // https://mediasoup.org/documentation/v3/mediasoup-client/api/#transport-produce
    // this action will trigger the 'connect' and 'produce' events above
    //console.log("CONNECT THE SEND TRANSPORT");
    //   console.log(params);

    let producer = await pproducerTransport.produce(params);

    // setProducer(producer);
    producer.on("trackended", () => {
    //  console.log("track ended");

      // close video track
    });


  };

  useEffect(() => {
    ///console.log('%cMEDIASOUPHELPER USE EFFECT', 'color: #00ff00; font-weight: bold; font-size: 16px;');

    // console.log("USE EFFECT THIS BELOGN TO MEDIA SOUP HOOK");
    //if the user is not viewer create send transport

    if (!isAudience) {
      // once the device loads, create transport
      if (params?.track && device && !producerTransport) {
        
        //console.log('this is isAudience False');

        createSendTransport(device);
        setMediaSoupListner();
      }
    } else {
       //get the current producers and check if joining the room is available
 
      if (device) {
      //  console.log('this is device');

        setMediaSoupListner();

        getProducers();

        Socket.emit("isFreeToJoin", { roomName: roomName }, (data) => {
          if (data.status) {
            setIsFreeToJoin(true, roomDispatch);
          } else {
            setIsFreeToJoin(false, roomDispatch);
          }
        });
      }
    }

    // return ()=>{

    //   unSetMediaSoupListner
    // }

  }, [device, isAudience, params, producerTransport]);

  
  // useEffect(() => {

  // }, []);

  return {
    Unmount,
    startStreming: createDevice,
  };
};
