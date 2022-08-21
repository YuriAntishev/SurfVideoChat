import React from "react";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

const DefaultRightSection = () => {
  return (
    <div className="right-section">
      <div className="right-section-default-wrapper">
        <ChatOutlinedIcon className="chat-icon" />
        <h2>It's nice to chat with someone</h2>
        <p className="right-section-default-secondary-text">
          Pick a person from left menu and start your conversation
        </p>
      </div>
    </div>
  );
};

export default DefaultRightSection;
