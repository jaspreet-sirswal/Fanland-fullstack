import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageNotFound from "../pageNotFound";
import Club from "../club";
import djangoRESTAPI from "../../api/djangoRESTAPI";
import { useAuth } from "../../auth/useAuth";
import EditProfile from "../editProfile";
import { Spinner } from "react-bootstrap";

export default function ProfilePage() {
  const [user, setUser] = useState({});
  const [userClubs, setUserClubs] = useState([]);
  const [modelShow, setModelShow] = useState(false);
  const [viewpoint, setView] = useState(0);
  let { userId } = useParams();

  let auth = useAuth();

  const fetchUserDetails = async () => {
    djangoRESTAPI
      .get(`userdetails/${userId}`)
      .then((res) => {
        fetchAdminClubsData();
        setUser(res.data);
      })
      .catch((err) => console.log(err));
  };

  const fetchAdminClubsData = async () => {
    djangoRESTAPI
      .get(`fanclubs_basic/created_by/${userId}`)
      .then((res) => {
        setUserClubs(res.data);
        setView(1);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (!modelShow) {
      fetchUserDetails();
    }
  }, [userId, modelShow]);

  const viewNotFound = () => {
    return <PageNotFound />;
  };
  const viewMain = () => {
    return (
      <>
        <EditProfile
          show={modelShow}
          onHide={() => setModelShow(false)}
          userStatus={user.user_status}
        />
        <div className="overflow-y" style={{ height: "95vh" }}>
          <div className="px-3 pt-3">
            <div className="top-clubpage">
              <div className="row">
                <div className="col-2">
                  <div
                    className="club-image-container"
                    style={{
                      backgroundImage: `url(http://localhost:8000${user.user_profile_image})`,
                    }}
                  ></div>
                </div>
                <div className="col-8 d-flex">
                  <div className="align-self-end">
                    <div>
                      <p className="fw-bolder fs-larger">{user.user_name}</p>
                    </div>
                    <div>
                      <p className="fs-secondary">{user.user_status}</p>
                    </div>
                    {auth.user.id == userId ? (
                      <div className="d-flex mt-3">
                        <button
                          onClick={() => setModelShow(true)}
                          className={`btn rounded-pill p-2 px-3 active`}
                        >
                          Edit Profile
                        </button>
                        <p className="fs-primary mx-4 mt-2">
                          <i className="far fa-gem"></i>{" "}
                          {user.following_clubs.length}
                        </p>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <div className="d-flex justify-content-between custom-border-bottom py-2">
                  <p className="fs-secondary">
                    Fanclubs by{" "}
                    <span className="text-white"> {user.user_name} </span>
                  </p>
                </div>
                <div className="clubs-container mt-2">
                  {userClubs.length == 0 ? (
                    <p>You can create your own fanclub, Awesome!! Go to New Club.</p>
                  ) : (
                    userClubs.map((dataItem) => {
                      return (
                        <div key={dataItem.id}>
                          <Club
                            clubName={dataItem.name}
                            clubDes={dataItem.des}
                            clubId={dataItem.id}
                            imageurl={dataItem.image}
                          />
                        </div>
                      );
                    })
                  )}
                </div>
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
