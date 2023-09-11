import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import './RoomChat.css';
import imageUser from '../../assets/user-image.png';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;
const socket = io(SOCKET_URL);
var socketId = "";
var user = "";
var chats = [];

socket.on('connect', () => {
  console.log("you connect with id", socket.id);
  socketId = socket.id;
  user = socket.id;
});

socket.on('listen-message', message => {
  addMessageToChat(socketId, message);
});

socket.on('listen-room', message => {
  addNotifJoinToChat(message);
});

const scrollToTarget = () => {
  const targetElement = document.getElementById("scroll-until-here");
  targetElement.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest'
  });
};

const addNotifJoinToChat = (message) => {
  const chatWillBeAdd = {
    type: "join",
    message: message,
  }

  chats.push(chatWillBeAdd);
  scrollToTarget();
}

const addMessageToChat = (mySocketId, message) => {
  const messageSocketId = message.socketId;
  const user = message.user;
  const msg = message.message;

  const chatWillBeAdd = {
    type: "other",
    socketId: messageSocketId,
  }

  if (messageSocketId === mySocketId) chatWillBeAdd.type = "self";
  const messageWillBeAdd = {
    username: user,
    message: msg,
  };

  const lastChat = chats[chats.length - 1];

  if (lastChat?.socketId === messageSocketId) {
    chats[chats.length - 1].messages.push(messageWillBeAdd);
  } else {
    chatWillBeAdd.messages = [messageWillBeAdd];
    chats.push(chatWillBeAdd);
  }

  scrollToTarget();
};

const RoomChat = () => {
  const { room_id } = useParams();
  const [msg, setMsg] = useState('');
  const [count, setCount] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setCount(count + 1);
    }, 50);
  }, [count]);

  const connectToRoom = (room_id) => {
    const callback = () => {
      sendToSocket("join-room-notification", null, null);
      addNotifJoinToChat('You joined');
    };

    sendToSocket("join-room", null, callback);
  };

  const sendMessage = () => {
    if (msg.trim() !== '') {
      sendToSocket("send-message", msg.trim());
      
      const bundle = {
        message: msg.trim(),
        room_id: room_id,
        user: user,
        socketId: socketId,
      }
      
      addMessageToChat(socketId, bundle);
      setMsg('');
    }
  };

  const sendToSocket = (topic, message, callback) => {
    const bundle = {
      message: message,
      room_id: room_id,
      user: user,
      socketId: socketId,
    }

    if (!callback) {
      socket.emit(topic, bundle);
    } else {
      socket.emit(topic, bundle, callback);
    }
  };

  const msgOnChange = (prop) => {
    setMsg(prop.target.value);
  };

  const onInputKeyUp = (prop) => {
    if (prop.code.toLowerCase() === "enter") sendMessage();
  };

  window.onbeforeunload = () => {
    sendToSocket("leave-room", null, null);
    socket.disconnect();
    console.log("socket disconnected");
  };

  useEffect(() => {
    if (!user) return;
    connectToRoom(room_id);
  }, [user]);

  return (
    <div className="--dark-theme" id="chat">
      <div className="chat__conversation-board">
        {
          chats.map((chat, index) => (
            <>
              {
                (chat.type !== "join" && 
                  <div 
                    className={`chat__conversation-board__message-container ${chat.type === "self" ? 'reversed' : ''}`}
                    key={index}>
                    {
                      (chat.type !== "self" &&
                        <div className="chat__conversation-board__message__person">
                          <div className="chat__conversation-board__message__person__avatar"><img src={ imageUser } alt="user"/></div>
                        </div>
                      )
                    }
                    <div className="chat__conversation-board__message__context">
                      {
                        chat.messages.map((message, messageIndex) => (
                        <div className="chat__conversation-board__message__bubble" key={ messageIndex }>
                          <span>
                            {
                              (chat.type === "self" &&
                                message.message
                              )
                            }
                            {
                              (chat.type !== "self" && messageIndex > 0 &&
                                message.message
                              )
                            }
                            {
                              (chat.type === "other" && messageIndex === 0 &&
                                <>
                                  <div className="chat__conversation-board__message__person__nickname">{ message.username }</div>
                                  <div>{ message.message }</div>
                                </> 
                              )
                            }
                          </span>
                        </div>
                        ))
                      }
                    </div>
                  </div>
                )
              }
              {
                (chat.type === "join" && 
                  <div 
                    className="chat__conversation-board__join-message-container" 
                    key={`index-join-${index}`}>
                      {chat.message}
                  </div>
                )
              }
            </>
          ))
        }
        <div id="scroll-until-here"></div>
      </div>
      <div className="chat__conversation-panel">
        <div className="chat__conversation-panel__container">
          <input 
            className="chat__conversation-panel__input panel-item" 
            onChange={ msgOnChange }
            onKeyUp={ onInputKeyUp }
            value={ msg }
            placeholder="Type a message..."/>
          <button 
            className="chat__conversation-panel__button panel-item btn-icon send-message-button" 
            onClick={ sendMessage }>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" data-reactid="1036">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomChat;
