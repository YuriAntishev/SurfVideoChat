import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import "../css/VideoChat.css";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ActiveRightSection from "./ActiveRightSection";
import DefaultRightSection from "./DefaultRightSection";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { io } from "socket.io-client";
import Peer from "simple-peer";

// const socket = io("http://localhost:8000/");

function VideoChat(props) {
  const { push } = useHistory();
  const [active, setActive] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);
  console.log("first999");
  // socket-client
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  // const [name, setName] = useState('');
  const [call, setCall] = useState({});
  const [me, setMe] = useState("");

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  console.log("availableUsers", availableUsers);

  const url = "http://localhost:8000/";
  const username = sessionStorage.getItem("username");

  console.log("username555", username);

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io(url, {
      path: "/videochat/",
      query: { username, room: "surfchat" },
    });

    socketRef.current.on("allUsersData", ({ users }) => {
      setAvailableUsers(users);
    });

    //     navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    //       .then((currentStream) => {
    //         setStream(currentStream);
    // console.log('currentStream', currentStream)
    //         myVideo.current.srcObject = currentStream;
    //       });

    // socket.on('me', (id) => setMe(id));

    // socket.on('callUser', ({ from, name: callerName, signal }) => {
    //   setCall({ isReceivingCall: true, from, name: callerName, signal });
    // });
  }, [username]);

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data) => {
      socketRef.current.emit('answerCall', { signal: data, to: call.from });
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
   }

  // const callUser = (id) => {
  //   const peer = new Peer({ initiator: true, trickle: false, stream });

  //   peer.on('signal', (data) => {
  //     socket.emit('callUser', { userToCall: id, signalData: data, from: me, name });
  //   });

  //   peer.on('stream', (currentStream) => {
  //     userVideo.current.srcObject = currentStream;
  //   });

  //   socket.on('callAccepted', (signal) => {
  //     setCallAccepted(true);

  //     peer.signal(signal);
  //   });

  //   connectionRef.current = peer;
  // };

  // const leaveCall = () => {
  //   setCallEnded(true);

  //   connectionRef.current.destroy();

  //   window.location.reload();
  // };

  const LogOut = () => {
    push("/");
  };

  return (
    <div className="App">
      <video className="fullscreen-video" autoPlay="autoplay" muted loop>
        <source src="./video/ocean.mov" type="video/mp4" />
      </video>
      <div className="chat-zone">
        <div className="left-sidebar">
          <div className="logo-wrapper">
            <img className="logo" src="./assets/logo.png" alt="logo" />
          </div>
          <p className="brand-text">VIDEO CHAT</p>
          <div className="exit-button-wrapper">
            <ExitToAppIcon className="exit-button" onClick={LogOut} />
          </div>
        </div>

        <Router>
          <div className="middle-section">
            <h3 className="middle-section-title">Active Users</h3>

            <ul className="users-list">
              {availableUsers?.map((i, index) => (
                <li key={index} className="users-list-nav-item">
                  <Link
                    to={`${i.name.replace(/\s+/g, "").trim()}`}
                    className={`users-list-nav-link ${
                      active === i.id && "active"
                    }`}
                    onClick={() => setActive(i.id)}
                  >
                  {i.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Switch>
            <Route
              exact
              path="/:name"
              component={(props) => (
                <ActiveRightSection
                  myVideo={myVideo}
                  users={availableUsers}
                  setActive={setActive}
                  {...props}
                />
              )}
            />
            <Route path="/" component={DefaultRightSection} />
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default VideoChat;
