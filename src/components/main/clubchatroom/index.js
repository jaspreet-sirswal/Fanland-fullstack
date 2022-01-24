import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { Link, useParams } from "react-router-dom";
import { Spinner, Dropdown } from "react-bootstrap";
import "./index.css";
import { useAuth } from "../../auth/useAuth";
import djangoRESTAPI from "../../api/djangoRESTAPI";
import Popup from "../Popup";

const socket = io.connect("http://localhost:4000");

export default function ClubChatRoom() {
  const [viewpoint, setView] = useState(0);
  const [fanclub, setFanclub] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [clubMembers, setClubMembers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [userLastActive, setUserLastActive] = useState(null);
  const [message, setMessage] = useState("");
  const [isImageMessage, setIsImageMessage] = useState(false);
  const [isBannedUser, setIsBannedUser] = useState(false);
  const [isMember, setisMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [popup, setPopup] = useState(false);
  const [isSocketOn, setSocket] = useState(false);
  const [image, setImage] = useState(null);
  const [file, setImageFile] = useState(null);
  const { chatRoomId } = useParams();

  let auth = useAuth();
  let userId = auth.user.id;
  let userName = auth.user.user_name;
  let userProfilePic = auth.user.user_profile_image;

  useEffect(() => {
    if (isBannedUser) setView(-1);
    if (viewpoint === 0 && !fanclub) {
      getFanclub();
      getUserLastActive();
    } else if (viewpoint === 1) {
      if (!isSocketOn) handleSocketConnection();
      scroll();
      return async () => {
        socket.emit("user-deactive", {
          chatRoomId: chatRoomId,
          userId: userId,
        });
        if (isMember)
          await djangoRESTAPI
            .put(`fans/last_active/${userId}/${chatRoomId}/`, { test: "hello" })
            .catch((err) => console.log(err));
      };
    }
  }, [chatRoomId, viewpoint, fanclub]);

  const textChange = (e) => {
    setMessage(e.target.value);
  };

  const getUserLastActive = async () => {
    await djangoRESTAPI
      .get(`fans/last_active/${userId}/${chatRoomId}`)
      .then((res) => {
        setUserLastActive(res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleSocketConnection = () => {
    socket.emit("user-active", {
      userId: userId,
      chatRoomId: chatRoomId,
    });
    socket.on("user-online", (activeUser) => {
      socket.emit("existing-user", {
        existingUserId: userId,
        newUserSocketId: activeUser.socketId,
      });
      setOnlineUsers((users) => [...users, activeUser.activeUserId]);
    });

    socket.on("user-offline", (userId) => {
      setOnlineUsers((users) => users.filter((ele) => remove(ele, userId)));
    });

    socket.on("ban-user", (userid) => {
      if (userid === userId) setView(-1);
    });
    socket.on("admin-popup", (userid) => {
      if (userid === userId) {
        setIsAdmin(true);
        setPopup(true);
      }
    });

    socket.on("show-existing-user", (userId) => {
      setOnlineUsers((users) => [...users, userId]);
    });

    socket.on("receive-message", (chat) => {
      setChatMessages((data) => [...data, chat]);
      scroll();
    });
    socket.on("to-delete-chat", (chatId) => {
      let samplechatmessages = chatMessages.filter((ele) =>
        remove(ele.id, chatId)
      );
      setChatMessages(samplechatmessages);
    });
    setSocket(true);
  };

  const sendMessage = async (username, actionmessage) => {
    if (username || message || file) {
      let form_data = new FormData();
      form_data.append("chatroom_id", chatRoomId);
      form_data.append("author_image", userProfilePic);
      form_data.append("author_name", userName);
      form_data.append("author_id", userId);
      form_data.append("is_image_message", isImageMessage);
      if (isImageMessage) form_data.append("media", file, file.name);
      form_data.append(
        "message",
        username ? `${username} ${actionmessage}` : message
      );

      await djangoRESTAPI
        .post(`chats/${chatRoomId}/`, form_data, {
          headers: {
            "content-type": "multipart/form-data",
          },
        })
        .then((res) => {
          let sampleChat = {
            isRTC: true,
            id: res.data.id,
            author_id: userId,
            chatroom_id: chatRoomId,
            author_name: userName,
            author_image: userProfilePic,
            message: username ? `${username} ${actionmessage}` : message,
            media: res.data.media,
            is_image_message: isImageMessage,
            date: res.data.date,
            time: res.data.time,
          };
          socket.emit("chat-message", sampleChat);
          setChatMessages((data) => [...data, sampleChat]);
        })
        .catch((err) => console.log(err));

      setMessage("");
      setIsImageMessage(false);
      setImageFile(null);
      setImage(null);
      scroll();
    }
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const getFanclub = async () => {
    await djangoRESTAPI
      .get(`fanclubs/${chatRoomId}`)
      .then(async (res) => {
        await djangoRESTAPI
          .get(`chats/${chatRoomId}`)
          .then((res) => setChatMessages(res.data));
        res.data.members.map(async (userId) => {
          await djangoRESTAPI
            .get(`userdetails_basic/${userId}`)
            .then((userdetailBasic) => {
              setClubMembers((members) => [
                ...members,
                { ...userdetailBasic.data, isUserOnline: false },
              ]);
            })
            .catch((err) => console.log(err));
        });
        setFanclub(res.data);
        setIsAdmin(res.data.admin_members.includes(userId));
        setIsBannedUser(res.data.banned_users.includes(userId));
        setisMember(res.data.members.includes(userId));
        setView(1);
      })
      .catch((err) => {
        console.log(err);
        setView(2);
      });
  };

  const photoUpload = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      setImageFile(file);
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
    setIsImageMessage(true);
  };

  const scroll = () => {
    let messageContainer = document.getElementById("message-container");
    if (messageContainer)
      messageContainer.scrollTo(0, messageContainer.scrollHeight);
  };

  const joinUser = async () => {
    await djangoRESTAPI
      .get(`userdetails/${userId}/following_clubs`)
      .then(async (res) => {
        await djangoRESTAPI
          .put(`userdetails/${userId}/`, {
            following_clubs: [...res.data, chatRoomId],
          })
          .then(() => setisMember(true))
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));

    await djangoRESTAPI.get(`fanclubs/${chatRoomId}`).then(async (res) => {
      await djangoRESTAPI.put(`fanclubs/${chatRoomId}/`, {
        members: [...res.data.members, userId],
      });
      setisMember(true);
    });
    await djangoRESTAPI
      .get(`fans/last_active/${userId}/${chatRoomId}`)
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  };

  const functionsix = () => {
    if (isMember)
      return (
        <form action="#" onSubmit={onFormSubmit} id="send-container">
          <div className="d-flex bg-color-secondary px-2 pt-1">
            <label
              htmlFor="photo-upload"
              className="bg-color-secondary border-0"
            >
              <i className="fas fa-photo-video text-white"></i>
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={photoUpload}
            />
            <input
              type="text"
              id="messageInput"
              className="form-control bg-color-tertiary border-0 message-input text-white"
              placeholder="Message"
              value={message}
              onChange={textChange}
            />
          </div>
        </form>
      );
    else {
      return (
        <div className="d-flex bg-color-secondary">
          <button
            className="bg-color-yellow border-0 p-2 rounded"
            onClick={joinUser}
          >
            Join now
          </button>
          <p className="mx-3 pt-2 fs-yellow">
            You need to be a member of this club to send a message.
          </p>
        </div>
      );
    }
  };

  const banUser = async (userid, username) => {
    await djangoRESTAPI.get(`fanclubs/${chatRoomId}`).then(async (res) => {
      let sampleMembers = res.data.members.filter((ele) => remove(ele, userid));
      await djangoRESTAPI
        .put(`fanclubs/${res.data.id}/`, {
          banned_users: [...res.data.banned_users, userid],
          members: sampleMembers,
        })
        .then(() => {
          let sampleMembers = clubMembers.filter((ele) =>
            remove(ele.user_id, userid)
          );
          setClubMembers(sampleMembers);
          sendMessage(username, "is banned from the chatroom.");
          socket.emit("user-ban", { id: userid, room: chatRoomId });
        });
    });
  };

  const makeAdmin = async (userid, username) => {
    await djangoRESTAPI.get(`fanclubs/${chatRoomId}`).then(async (res) => {
      await djangoRESTAPI
        .put(`fanclubs/${res.data.id}/`, {
          admin_members: [...res.data.admin_members, userid],
        })
        .then(() => {
          sendMessage(username, "is now an Admin.");
          socket.emit("make-admin", { id: userid, room: chatRoomId });
        })
        .catch((err) => console.log(err));
    });
  };

  const remove = (ele, value) => {
    return ele != value;
  };

  const deleteChat = async (chatId) => {
    await djangoRESTAPI
      .delete(`chat/${chatId}`)
      .then(() => {
        let samplechatmessages = chatMessages.filter((ele) =>
          remove(ele.id, chatId)
        );
        setChatMessages(samplechatmessages);
        socket.emit("chat-delete", { chatroomId: chatRoomId, chatId: chatId });
      })
      .catch((err) => console.log(err));
  };

  const ComponentChat = ({ chat }) => {
    let seen = "";
    if (!chat.isRTC && userLastActive) {
      let chatDateTime = chat.date + chat.time;
      let userDateTime =
        userLastActive.last_active_date + userLastActive.last_active_time;
      let bool = chatDateTime.localeCompare(userDateTime);
      if (bool === 1) seen = "highlight-message";
    }
    return (
      <div
        className={`message-box py-2 px-1 d-flex justify-content-between ${seen}`}
      >
        <div className="d-flex">
          <img
            src={chat.author_image}
            alt="Profile"
            height="46"
            width="46"
            style={{ borderRadius: "50%" }}
            className="rounded-cicle mx-1"
          />
          <p className="fs-smaller px-3">
            <Link
              to={`/app/users/${chat.author_id}`}
              className="link link-hover-underline"
            >
              <span className="fw-bolder text-white fs-medium">
                {chat.author_name}
              </span>
            </Link>
            <span className="fs-smallest px-2">
              {" "}
              {chat.date}, {chat.time}{" "}
            </span>
            <br />
            {chat.is_image_message ? (
              <div>
                <img
                  className="my-2"
                  style={{ maxHeight: "300px" }}
                  src={`http://localhost:8000${chat.media}`}
                />
              </div>
            ) : (
              ""
            )}
            {chat.message ? chat.message : ""}
          </p>
        </div>
        {chat.author_id == userId || isAdmin ? (
          <div className="pt-2 chat-option px-4">
            <Dropdown>
              <Dropdown.Toggle
                bsPrefix="chat-option text-white px-1 border-0"
                as="button"
                id="dropdown-basic"
              >
                <i className="fas fa-ellipsis-h"></i>
              </Dropdown.Toggle>

              <Dropdown.Menu align="left" bsPrefix="bg-color-secondary">
                <Dropdown.Item
                  onClick={() => deleteChat(chat.id)}
                  className="fs-secondary"
                >
                  Delete Post
                </Dropdown.Item>
                {isAdmin && chat.author_id !=userId? (
                  <div>
                    <Dropdown.Item
                      onClick={() => banUser(chat.author_id, chat.author_name)}
                      className="fs-secondary"
                    >
                      Ban {chat.author_name}
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() =>
                        makeAdmin(chat.author_id, chat.author_name)
                      }
                      className="fs-secondary"
                    >
                      Make Admin
                    </Dropdown.Item>
                  </div>
                ) : (
                  <div></div>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    );
  };

  const viewMain = () => {
    return (
      <>
        <Popup
          show={popup}
          onHide={() => setPopup(false)}
          message="You are now an Admin of this fanclub!"
        />
        <div>
          <div className="row">
            <div className="col-10">
              <div className="bg-color-tertiary p-2 mx-2 mt-3">
                <Link to={`/app/clubs/${chatRoomId}`} className="link-2">
                  {fanclub.name}
                </Link>
              </div>
              <div
                className="custom-overflow py-2 chat-box bg-color-primary mx-2"
                id="message-container"
              >
                {chatMessages.length == 0 ? (
                  <p>
                    Start a post or just say hii to initiate a conversation!!
                  </p>
                ) : (
                  chatMessages.map((chat) => {
                    return <ComponentChat key={chat.id} chat={chat} />;
                  })
                )}
              </div>
              {isImageMessage ? (
                <div
                  className="mx-2 position-absolute p-2 bg-color-tertiary"
                  style={{ bottom: 60 }}
                >
                  <div className="d-flex justify-content-between">
                    <p className="fw-bold">Image Preview</p>
                    <button
                      className="bg-color-tertiary text-white"
                      onClick={() => {
                        setIsImageMessage(false);
                        setImageFile(null);
                      }}
                    >
                      <i className="fa fa-times"></i>
                    </button>
                  </div>
                  <img
                    className="my-2"
                    style={{ maxHeight: "300px" }}
                    src={image}
                  />
                  <p className="fs-small fs-secondary">
                    Press enter to upload the selected image to the fanland
                    server.
                  </p>
                </div>
              ) : (
                <p></p>
              )}
              <div className="m-2">{functionsix()}</div>
            </div>
            <div className=" col-2 bg-color-secondary border-right custom-border-right mt-3  pt-2 px-4">
              <div className="custom-border-bottom">
                <p className="fs-small py-1">Members</p>
              </div>
              <div className="pt-3 participants-container overflow-auto">
                {clubMembers.length == 0 ? (
                  <p>Invite people to make some noice in the room.</p>
                ) : (
                  clubMembers.map((item) => {
                    item.isUserOnline = onlineUsers.includes(item.user_id);
                    if (item.user_id === userId) return "";
                    return (
                      <div
                        className="d-flex py-2 member-box"
                        key={item.user_id}
                      >
                        <div>
                          <img
                            src={item.user_profile_image}
                            alt="Profile"
                            height="30"
                            width="30"
                            className="rounded-circle"
                            style={{ borderRadius: "50%" }}
                          />
                          {item.isUserOnline ? (
                            <span className="dot dot-active"></span>
                          ) : (
                            <span className="dot dot-not-active"></span>
                          )}
                        </div>
                        <div>
                          <p className="fs-smaller px-2 pt-1">
                            <Link
                              to={`/app/users/${item.user_id}`}
                              className="link link-hover-underline text-white"
                            >
                              {item.user_name}
                            </Link>
                            {/* <span className="fs-smallest px-2"> 1 hour</span> */}
                          </p>
                        </div>
                        {isAdmin ? (
                          <div className="pt-1 member-options">
                            <button
                              className="bg-color-secondary"
                              onClick={() =>
                                makeAdmin(item.user_id, item.user_name)
                              }
                            >
                              <i className="fas fa-user-plus text-white"></i>
                            </button>
                            <button
                              className="bg-color-secondary text-white"
                              onClick={() =>
                                banUser(item.user_id, item.user_name)
                              }
                            >
                              <i className="fas fa-ban px-lg-2 fs-secondary "></i>
                            </button>
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  switch (viewpoint) {
    case 1:
      return viewMain();
    case 2:
      return <div>Something went wrong, please try after some time.</div>;
    case -1:
      return <p>You are banned from the server.</p>;
    default:
      return (
        <div className="d-flex">
          <Spinner animation="border" role="status"></Spinner>
          <p className="fs-primary fs-medium px-3">Loading...</p>
        </div>
      );
  }
}
