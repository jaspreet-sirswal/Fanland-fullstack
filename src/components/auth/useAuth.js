import React, { useState, useContext, createContext } from "react";
import djangoRESTAPI from "../api/djangoRESTAPI";

const authContext = createContext();

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  const [user, setUser] = useState(null);

  const signin = async (userName, userPassword, callback, showError) => {
    await djangoRESTAPI
      .get(`/users/${userName}/${userPassword}`)
      .then(async (res) => {
        setUser(res.data);
        await djangoRESTAPI
          .get(`userdetails/${res.data.id}/user_profile_image`)
          .then((imageData) =>
            setUser((user) => ({ ...user, user_profile_image: imageData.data }))
          );
        callback();
      })
      .catch(() => showError());
  };

  const updateUserProfile = async () => {
    await djangoRESTAPI
      .get(`userdetails/${user.id}/user_profile_image`)
      .then((imageData) =>
        setUser((user) => ({ ...user, user_profile_image: imageData.data }))
      );
  };

  const signup = async (user, userdetail, callback, showError) => {
    await djangoRESTAPI
      .post("/users/", user)
      .then((res) => {
        djangoRESTAPI
          .post("/userdetails/", { ...userdetail, user_id: res.data })
          .then(() => {
            callback();
          })
          .catch((err) => console.log(err));
      })
      .catch(() => {
        showError();
      });
  };

  const signout = () => {
    setUser(false);
  };

  return {
    user,

    signin,

    signup,

    signout,

    updateUserProfile,
  };
}
