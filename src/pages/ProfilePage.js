import React, { useState, useContext, useEffect } from "react";
import "./ProfilePage.css";
import { useHistory, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Button, Avatar } from "@material-ui/core";
import { Image, Send } from "@material-ui/icons";

const ProfilePage = () => {
  const [authState, setAuthState] = useContext(AuthContext);
  const [avatarFile, setAvatarFile] = useState(null);
  const [profileState, setProfileState] = useState(false);

  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/profile/${id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setAuthState({ ...authState, user: response.data.user });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [profileState]);

  const onSubmit = () => {
    const data = new FormData();
    data.append("avatar", avatarFile);

    axios
      .put(`http://localhost:5000/api/profile/${id}`, data, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then(() => {
        setProfileState(true);
        history.push("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="profile">
      <div className="profile-container">
        <span className="profile-container__title">Modifier avatar</span>
        {authState.user.avatar ? (
          <Avatar
            className="profile-container__avatar"
            src={authState.user.avatar}
          />
        ) : (
          <Avatar className="profile-container__avatar" />
        )}
        <div className="profile-container__actions">
          <label for="avatarFile" className="profile-container__file">
            <Image />
          </label>
          <input
            type="file"
            id="avatarFile"
            onChange={(event) => {
              const avatarFile = event.target.files[0];
              setAvatarFile(avatarFile);
            }}
          />
          <Button>
            <Send
              type="button"
              onClick={onSubmit}
              className="profile-container__send"
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
