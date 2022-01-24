import React from "react";
import { Link } from "react-router-dom";
import "./club.css";

export default function Club({ imageurl, clubName, clubDes, clubId }) {
  return (
    <div className="club-layout my-2">
      <Link to={`/app/clubs/${clubId}`} className="club-layout link">
        <div
          className="club-image-div"
          style={{
            backgroundImage: `url(http://localhost:8000${imageurl})`,
          }}
        ></div>
        <div className="club-hover-options d-flex justify-content-center px-4">
          {/* <Link to="#" className="link-2">
            <i className="far fa-star fa-2x"></i>
          </Link> */}
          {/* <Link to={`/app/chats/${clubId}`} className="link-2">
            <i className="far fa-comment-alt fa-2x fw-light icon-hover-scale"></i>
          </Link> */}
          {/* <Link className="link-2">
            <i className="fas fa-ellipsis-h fa-2x"></i>
          </Link> */}
        </div>
      </Link>
      <div className="mt-2">
        <h6 className="fw-bold mb-1">
          <p>{clubName}</p>
        </h6>
        <p className="text-white-50 small-text text-truncate">{clubDes}</p>
      </div>
    </div>
  );
}
