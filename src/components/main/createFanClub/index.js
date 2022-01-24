import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useHistory, useLocation } from "react-router-dom";
import djangoRESTAPI from "../../api/djangoRESTAPI";
import { useAuth } from "../../auth/useAuth";

export default function CreateFanClub(props) {
  const [clubTitle, setTitle] = useState("");
  const [clubDes, setDes] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [clubImage, setImage] = useState(null);

  let auth = useAuth();
  let userId = auth.user.id;

  let history = useHistory();
  let location = useLocation();

  const resetStates = () => {
    setTitle("");
    setDes("");
    setImage(null);
    setImageFile(null);
  };

  const createClub = async (e) => {
    e.preventDefault();

    let form_data = new FormData();

    form_data.append("name", clubTitle);
    form_data.append("des", clubDes);
    if (imageFile) form_data.append("image", imageFile);
    form_data.append("creator", userId);
    form_data.append("top_fans", [userId]);
    form_data.append("members", [userId]);
    form_data.append("admin_members", [userId]);

    await djangoRESTAPI
      .post(`fanclubs/`, form_data, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then(async (res) => {
        await djangoRESTAPI
          .get(`userdetails/${userId}/`)
          .then(async (userdetail) => {
            await djangoRESTAPI
              .put(`userdetails/${userId}/`, {
                admin_clubs: [...userdetail.data.admin_clubs, res.data],
                following_clubs: [...userdetail.data.following_clubs, res.data],
              })
              .catch((err) => console.log(err));
          });
        resetStates();
        props.onHide();
        let { from } = location.state || {
          from: { pathname: `/app/clubs/${res.data}` },
        };
        history.replace(from);
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
          <p className="fw-bold fs-5">Create Fanclub</p>
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
                  backgroundImage: `url(${clubImage})`,
                }}
              >
                {clubImage ? (
                  ""
                ) : (
                  <p className="fs-secondary text-center">
                    <i class="fas fa-camera fs-primary"></i>
                    <br />
                    Click here to add an Image
                  </p>
                )}
              </div>
            </label>
            <input id="photo-upload" type="file" onChange={photoUpload} />
          </div>
          <div className="col-8">
            <form onSubmit={createClub}>
              <div className="form-group">
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
              </div>
              <div className="form-group mt-2">
                <label htmlFor="clubDes">
                  <p className="fs-secondary">Description</p>
                </label>
                <textarea
                  type="text"
                  id="clubDes"
                  className="form-control mt-1"
                  placeholder="Give your fanclub a catchy description."
                  value={clubDes}
                  required
                  onChange={(e) => setDes(e.target.value)}
                  rows={5}
                ></textarea>
              </div>
              <div className="mx-md-5 px-md-3 pt-2">
                <input
                  type="submit"
                  className="bg-color-green border-0 p-2 px-3 rounded mt-3 text-white"
                  value="CREATE"
                />
              </div>
            </form>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
