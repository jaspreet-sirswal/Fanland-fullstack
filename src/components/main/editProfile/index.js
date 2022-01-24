import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useHistory, useLocation } from "react-router-dom";
import djangoRESTAPI from "../../api/djangoRESTAPI";
import { useAuth } from "../../auth/useAuth";

export default function EditProfile(props) {
  let auth = useAuth();
  const [userStatus, setUserStatus] = useState(props.userStatus);
  const [imageFile, setImageFile] = useState(null);
  const [userProfileImage, setImage] = useState(null);

  let history = useHistory();
  let location = useLocation();

  const resetStates = () => {
    setUserStatus("");
    setImage(null);
    setImageFile(null);
  };

  const editUserDetails = async (e) => {
    e.preventDefault();

    let form_data = new FormData();
    form_data.append("user_status", userStatus);
    if (imageFile) form_data.append("user_profile_image", imageFile);
    await djangoRESTAPI
      .put(`modify_userdetails/${auth.user.id}/`, form_data, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then(() => {
        let { from } = location.state || {
          from: { pathname: `/app/users/${auth.user.id}` },
        };
        auth.updateUserProfile();
        history.replace(from);
        props.onHide();
      })
      .catch((err) => console.log(err));
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
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      contentClassName="bg-color-primary text-white px-3 py-3"
    >
      <div className="d-flex px-2">
        <div className="col-11 text-center">
          <p className="fw-bold fs-5">Edit Profile</p>
        </div>
        <div className="col-1 text-end">
          <button className="bg-color-primary" onClick={() => props.onHide()}>
            <i className="fas fa-times fs-primary"></i>
          </button>
        </div>
      </div>
      <Modal.Body>
        <div className="row">
          <div className="col-4">
            <label htmlFor="photo-upload" className="w-100">
              <div
                className="club-image-container bg-color-tertiary d-flex justify-content-center align-items-center"
                style={{
                  backgroundImage: userProfileImage
                    ? `url(${userProfileImage})`
                    : `url(${auth.user.user_profile_image})`,
                }}
              ></div>
            </label>
            <input id="photo-upload" type="file" onChange={photoUpload} />
          </div>
          <div className="col-8">
            <form onSubmit={editUserDetails}>
              {/* <div className="form-group">
                <label htmlFor="clubName">
                  <p className="fs-secondary">Name</p>
                </label>
                <input
                  type="text"
                  id="clubName"
                  className="form-control mt-1"
                  placeholder="My awesome fanclub"
                  required
                  value={clubTitle}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
              </div> */}
              <div className="form-group mt-2">
                <label htmlFor="userStatus">
                  <p className="fs-secondary">Status</p>
                </label>
                <textarea
                  type="text"
                  id="userStatus"
                  className="form-control mt-1"
                  placeholder="Give your fanclub a catchy description."
                  value={userStatus}
                  required
                  onChange={(e) => setUserStatus(e.target.value)}
                  rows={5}
                ></textarea>
              </div>
              <div className="mx-md-5 px-md-3 pt-2">
                <input
                  type="submit"
                  className="bg-color-green border-0 p-2 px-3 rounded mt-3 text-white"
                  value="SAVE"
                />
              </div>
            </form>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
