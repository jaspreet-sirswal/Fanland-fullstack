import React, { useState, useEffect } from "react";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import Club from "../club";
import PageNotFound from "../pageNotFound";
import { useAuth } from "../../auth/useAuth";
import { Dropdown, Spinner } from "react-bootstrap";
import djangoRESTAPI from "../../api/djangoRESTAPI";
import EditFanclub from "../editFanclub";

export default function ClubPage() {
  const [fanclub, setFanclub] = useState(null);
  const [followingClubs, setFollowingClubs] = useState(null);
  const [likedClubs, setLikedClubs] = useState(null);
  const [moreClubsdata, setMoreData] = useState([]);
  const [topFans, setTopFans] = useState([]);
  const [viewpoint, setView] = useState(0);
  const [joinState, setJoinState] = useState("Join Club");
  const [activeState, setActiveState] = useState("active");
  const [isLiked, setisLiked] = useState(false);
  const [isMember, setisMember] = useState(false);
  const [isBanned, setIsBanned] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [creator, setCreator] = useState(null);
  const [modelShow, setModelShow] = useState(false);
  const { clubId } = useParams();

  let history = useHistory();
  let location = useLocation();
  let auth = useAuth();
  let userId = auth.user.id;

  const fetchClub = async () => {
    await djangoRESTAPI
      .get(`fanclubs/${clubId}`)
      .then(async (res) => {
        setFanclub(res.data);
        setIsCreator(() => userId === res.data.creator);
        setIsBanned(res.data.banned_users.includes(userId));
        await djangoRESTAPI
          .get(`userdetails/${userId}/following_clubs`)
          .then((followingData) => setFollowingClubs(followingData.data));

        await djangoRESTAPI
          .get(`userdetails/${res.data.creator}/user_name`)
          .then((response) => setCreator(response.data));
        await djangoRESTAPI
          .get(`userdetails/${userId}/liked_clubs`)
          .then((likedClubs) => {
            setLikedClubs(likedClubs.data);
            setisLiked(likedClubs.data.includes(res.data.id));
          });
        setIsAdmin(res.data.admin_members.includes(userId));
        fetchTopFans();
        fetchMoreClubs(res.data.creator);
        if (res.data.members.includes(userId)) {
          setisMember(true);
          setJoinState("Leave Club");
          setActiveState("not-active");
        }
        postRecentClubs();
        setView(1);
      })
      .catch((err) => {
        console.log(err);
        setView(2);
      });
  };
  const fetchTopFans = async () => {
    await djangoRESTAPI.get(`fans/${clubId}`).then((res) => {
      res.data.map(async (fanObject) => {
        await djangoRESTAPI
          .get(`userdetails_basic/${fanObject.fan_id}`)
          .then((res) => {
            setTopFans((data) => [...data, res.data]);
          });
      });
    });
    // topFanIds.map(async (fanId) => {
    //   await djangoRESTAPI.get(`userdetails_basic/${fanId}`).then((res) => {
    //     setTopFans((data) => [...data, res.data]);
    //   });
    // });
  };
  const fetchMoreClubs = async (creator) => {
    await djangoRESTAPI
      .get(`fanclubs_basic/created_by/${creator}`)
      .then((res) => setMoreData(res.data.slice(0, 6)));
  };

  const resetStates = () => {
    setTopFans([]);
    setisMember(false);
    setisLiked(false);
    setLikedClubs([]);
  };

  const postRecentClubs = async () => {
    await djangoRESTAPI.get(`userdetails/${userId}`).then(async (res) => {
      await djangoRESTAPI.put(`userdetails/${userId}/`, {
        recent_clubs: [...res.data.recent_clubs, clubId],
      });
    });
  };

  useEffect(() => {
    if (!modelShow) {
      setView(0);
      resetStates();
      fetchClub();
    }
  }, [clubId, modelShow]);

  const remove = (ele, value) => {
    return ele != value;
  };
  const handleLikeClub = async () => {
    if (isLiked) {
      let changedLikedClubs = likedClubs.filter((ele) => remove(ele, clubId));
      await djangoRESTAPI.put(`userdetails/${userId}/`, {
        liked_clubs: changedLikedClubs,
      });
    } else {
      await djangoRESTAPI.put(`userdetails/${userId}/`, {
        liked_clubs: [...likedClubs, clubId],
      });
    }
    setisLiked(!isLiked);
  };

  const handleJoinButtonClick = async () => {
    if (isMember) {
      let changedFollowingClubs = followingClubs.filter((ele) =>
        remove(ele, clubId)
      );
      await djangoRESTAPI
        .put(`userdetails/${userId}/`, {
          following_clubs: changedFollowingClubs,
        })
        .catch((err) => console.log(err));

      await djangoRESTAPI.get(`fanclubs/${clubId}`).then(async (res) => {
        let changedMembers = res.data.members.filter((ele) =>
          remove(ele, userId)
        );
        let changedAdminMembers = res.data.admin_members.filter((ele) =>
          remove(ele, userId)
        );
        await djangoRESTAPI.put(`fanclubs/${clubId}/`, {
          members: changedMembers,
          admin_members: changedAdminMembers,
        });
      });
      setIsAdmin(false);
      setActiveState("active");
      setJoinState("Join Club");
    } else {
      await djangoRESTAPI
        .put(`userdetails/${userId}/`, {
          following_clubs: [...followingClubs, clubId],
        })
        .catch((err) => console.log(err));

      await djangoRESTAPI.get(`fanclubs/${clubId}`).then(async (res) => {
        await djangoRESTAPI.put(`fanclubs/${clubId}/`, {
          members: [...res.data.members, userId],
        });
        setActiveState("not-active");
        setJoinState("Leave CLub");
      });

      await djangoRESTAPI
        .get(`fans/last_active/${userId}/${clubId}`)
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));
    }
    setisMember(!isMember);
  };

  const deleteFanclub = async () => {
    let { from } = location.state || {
      from: { pathname: `/app/made_by_me/` },
    };
    await djangoRESTAPI
      .delete(`fanclubs/${clubId}`)
      .then(() => {
        history.replace(from);
      })
      .catch((err) => console.log(err));
  };

  const viewNotFound = () => {
    return <PageNotFound />;
  };

  const viewMain = () => {
    return (
      <>
        <EditFanclub
          show={modelShow}
          onHide={() => setModelShow(false)}
          clubData={fanclub}
        />
        <div className="px-3 pt-3">
          <div className="top-clubpage">
            <div className="row">
              <div className="col-2">
                <div
                  className="club-image-container"
                  style={{
                    backgroundImage: `url(http://localhost:8000${fanclub.image})`,
                  }}
                ></div>
              </div>
              <div className="col-9 d-flex">
                <div className="align-self-end">
                  <div>
                    <p className="fw-bolder fs-larger">{fanclub.name}</p>
                  </div>
                  <div>
                    <p className="fs-secondary">
                      {fanclub.des} <br />
                      created by{" "}
                      <Link
                        to={`/app/users/${fanclub.creator}`}
                        className="link-2 text-white"
                      >
                        {creator}
                      </Link>
                      {","}
                      <i className="fas fa-users mx-1"></i>
                      {fanclub.members.length}
                    </p>
                  </div>
                  <div className="pt-3 d-flex">
                    {!isCreator && !isBanned ? (
                      <button
                      onClick={handleJoinButtonClick}
                      className={`btn rounded-pill p-2 px-3 ${activeState}`}
                      >
                        {joinState}
                      </button>
                        ) : (
                          ""
                    )}
                    <div className="d-flex mx-">
                      <button
                        className="border-0 bg-color-primary fs-primary text-white scale"
                        onClick={handleLikeClub}
                      >
                        {isLiked ? (
                          <i className="fas fa-heart"></i>
                        ) : (
                          <i className="far fa-heart"></i>
                        )}
                      </button>
                      <Link to={`/app/chats/${clubId}`}>
                        <button className="border-0 bg-color-primary fs-primary pt-2 mx-2 text-white scale">
                          <i className="fas fa-comments"></i>
                        </button>
                      </Link>
                      {isAdmin && !isBanned ? (
                        <div className="pt-2">
                          <Dropdown>
                            <Dropdown.Toggle
                              bsPrefix="bg-color-primary text-white rounded-circle px-1 border"
                              as="button"
                              id="dropdown-basic"
                            >
                              <i className="fas fa-ellipsis-h"></i>
                            </Dropdown.Toggle>

                            <Dropdown.Menu bsPrefix="bg-color-tertiary mt-2">
                              <Dropdown.Item
                                onClick={() => setModelShow(true)}
                                className="fs-secondary"
                              >
                                Edit
                              </Dropdown.Item>
                              {/* <Dropdown.Item
                                href="#/action-2"
                                className="fs-secondary"
                              >
                                Settings
                              </Dropdown.Item> */}
                              {fanclub.creator === userId ? (
                                <Dropdown.Item
                                  onClick={() => deleteFanclub()}
                                  className="fs-secondary"
                                >
                                  Delete Fanclub
                                </Dropdown.Item>
                              ) : (
                                ""
                              )}
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-4">
              <div className="custom-border-bottom py-2">
                <p>
                  <i className="far fa-gem"></i> Top Fans
                </p>
              </div>
              <div className="py-2">
                {topFans.length == 0 ? (
                  <p>No activities in the room.</p>
                ) : (
                  topFans.map((fan) => {
                    return (
                      <div className="my-2" key={fan.user_id}>
                        <div className="d-flex">
                          <img
                            src={`${fan.user_profile_image}`}
                            alt="Profile"
                            height="30"
                            width="30"
                            className="rounded-circle"
                          />
                          <Link
                            to={`/app/users/${fan.user_id}`}
                            className="link-2 mx-2"
                          >
                            <p className="pt-1 px-1">{fan.user_name}</p>
                          </Link>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            <div className="pt-1">
              <div className="d-flex justify-content-between custom-border-bottom py-2">
                <p className="fs-secondary">
                  Fanclubs by <span className="text-white"> {creator} </span>
                </p>
                <Link
                  to={`/app/users/${fanclub.creator}`}
                  className="link-2 text-white"
                >
                  See All
                </Link>
              </div>
              <div className="clubs-container mt-2">
                {moreClubsdata.map((dataItem, index) => {
                  return (
                    <div
                      key={dataItem.id}
                      className={`px-${index === 0 ? 0 : 3} py-3`}
                    >
                      <Club
                        clubName={dataItem.name}
                        clubDes={dataItem.des}
                        clubId={dataItem.id}
                        imageurl={dataItem.image}
                      />
                    </div>
                  );
                })}
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
      return viewNotFound();

    default:
      return (
        <div className="d-flex">
          <Spinner animation="border" role="status"></Spinner>
          <p className="fs-primary fs-medium px-3">Loading...</p>
        </div>
      );
  }
}
