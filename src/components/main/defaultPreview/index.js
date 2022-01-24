import React, { useEffect, useState } from "react";
import { NavLink, useRouteMatch } from "react-router-dom";
import Club from "../club";
import { useAuth } from "../../auth/useAuth";
import djangoRESTAPI from "../../api/djangoRESTAPI";
import { Spinner } from "react-bootstrap";

export default function DefaultPreview({ title, endpoint, tags, descriptive }) {
  let { url } = useRouteMatch();
  const auth = useAuth();
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const fetchAllClubs = async () => {
    await djangoRESTAPI.get(`fanclubs/`).then((res) => {
      setData(res.data);
      setLoading(false);
    });
  };

  const fetchClubsByEndpoint = async () => {
    await djangoRESTAPI
      .get(`userdetails/${auth.user.id}/${endpoint}`)
      .then((res) => {
        res.data.map(async (clubId) => {
          await djangoRESTAPI.get(`fanclubs_basic/${clubId}`).then((res) => {
            setData((data) => [...data, res.data]);
          });
        });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchClubs = async () => {
    switch (endpoint) {
      case "":
        fetchAllClubs();
        break;

      default:
        fetchClubsByEndpoint();
        break;
    }
  };

  useEffect(() => {
    fetchClubs();
  }, [endpoint, tags]);

  return isLoading ? (
    <div className="d-flex">
      <Spinner animation="border" role="status"></Spinner>
      <p className="fs-primary fs-medium px-3">Loading...</p>
    </div>
  ) : (
    <div className="px-3 overflow-auto container-home">
      <div>
        <p className="pt-5 fs-large fw-bolder ">{title}</p>
      </div>
      <div>
        {tags ? (
          <div className="d-flex my-4">
            {tags.map((tag, index) => {
              let link = index === 0 ? url : url + "/" + tag.tagId;
              return (
                <NavLink
                  exact
                  key={index}
                  to={link}
                  className="link mx-2 text-white py-1"
                  activeClassName="tag-navlink-active"
                >
                  {tag.tagTitle}
                </NavLink>
              );
            })}
          </div>
        ) : (
          <div className="py-3">
            <p>{descriptive}</p>
          </div>
        )}
        <div className="custom-border-top pt-3">
          <div className="clubs-container">
            {data.length == 0 ? (
              <p>
                No fanclubs to show. You can follow a fanclub you want and It
                will appear here. Go to explore to explore all the fanclubs on
                Fanland.
              </p>
            ) : (
              data.map((dataItem) => {
                return (
                  <Club
                    key={dataItem.id}
                    clubName={dataItem.name}
                    clubDes={dataItem.des}
                    clubId={dataItem.id}
                    imageurl={dataItem.image}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
