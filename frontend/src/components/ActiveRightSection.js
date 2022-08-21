import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Backdrop, Button, Modal, Box } from "@mui/material";
import CallEndIcon from "@mui/icons-material/CallEnd";
import CallIcon from "@mui/icons-material/Call";
import PhoneIcon from "@mui/icons-material/Phone";
import VideocamIcon from "@mui/icons-material/Videocam";
import PersonalVideoIcon from "@mui/icons-material/PersonalVideo";
import PropTypes from "prop-types";
import { useSpring, animated } from "react-spring";
import { UpperCaseArraySplit } from "../utils/functions";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Fade = React.forwardRef(function Fade(props, ref) {
  const { in: open, children, onEnter, onExited, ...other } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter();
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited();
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {children}
    </animated.div>
  );
});

Fade.propTypes = {
  children: PropTypes.element,
  in: PropTypes.bool.isRequired,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
};

const ActiveRightSection = (props) => {
  const { push } = useHistory();
  const name = UpperCaseArraySplit(String(props.match.params.name));
  const id = props.users.find((x) => x.name === name).id;

  const [open, setOpen] = useState(false);
  const [melody] = useState(new Audio("/audio/melody.mp3"));
  const [playing, setPlaying] = useState(false);

  if (playing) {
    melody.play()
  } else {
    melody.pause();
  }

  const handleAccept = async () => {
    await setPlaying(false);
    await setOpen(false);
    await push(`StevePate`);
    melody.currentTime = 0;
  };

  useEffect(() => {
    props.setActive(id);
    return () => {
      props.setActive();
    };
  }, [id]);

  const handleOpen = () => {
    setOpen(true);
    setPlaying(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="right-section">
      <div className="head-menu">
        <p>{name}</p>
        <PhoneIcon />
        <VideocamIcon />
        <button className="modal-button" type="button" onClick={handleOpen}>
          Draft for call action
        </button>
        <Modal
          aria-labelledby="spring-modal-title"
          aria-describedby="spring-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <Box sx={style}>
              <h2 id="spring-modal-title">Somebody is calling</h2>
              <div className="button-wrapper">
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<CallEndIcon />}
                >
                  Decline
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CallIcon />}
                  onClick={handleAccept}
                >
                  Accept
                </Button>
              </div>
            </Box>
          </Fade>
        </Modal>
      </div>

      <div className="right-section-default-wrapper">
        <PersonalVideoIcon className="chat-icon" />
        <h2 className="head-text">
          Here you will see a video image of a person with whom you will talk
        </h2>
        <video 
        style={{
          width: 250,
        }}
        playsInline 
        muted 
        ref={props.myVideo} 
        autoPlay 
        />
      </div>
    </div>
  );
};

export default ActiveRightSection;
