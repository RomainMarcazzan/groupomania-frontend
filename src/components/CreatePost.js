import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { PostContext } from "../context/PostContext";
import "./CreatePost.css";
import axios from "axios";
import { Button } from "@material-ui/core";
import { Gif, Image } from "@material-ui/icons";
import ReactModal from "react-modal";

const CreatePost = () => {
  const [authState] = useContext(AuthContext);

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [, setPostState] = useContext(PostContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("userId", authState.user.userId);
    data.append("title", title);
    data.append("imageUrl", file);

    axios
      .post("http://localhost:5000/api/posts/", data, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then(() => {
        setTitle("");
        setPostState(true);
        e.target.reset();
      })
      .catch((error) => {
        setIsOpenModal(true);
        setErrorMessage(error.response.statusText);
      });
  };
  return (
    <form onSubmit={onSubmit} className="create-post">
      <ReactModal
        isOpen={isOpenModal}
        style={{
          content: {
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius: "2rem",
            height: "6rem",
          },
        }}
      >
        <div className="error-container">
          <p> Un post doit contenir au minimum un titre et/ou une image</p>
          <button onClick={() => setIsOpenModal(false)}>Ok</button>
        </div>
      </ReactModal>
      <div className="create-post__title-container">
        <input
          placeholder="Dites quelque chose..."
          className="create-post__title"
          type="text"
          id="title"
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
      </div>
      <div className="create-post__file-container">
        <label
          htmlFor="file"
          className="create-post__file"
          aria-label="Image ou Gif"
        >
          <Image />
          <Gif fontSize="large" />
        </label>
        <input
          type="file"
          id="file"
          onChange={(event) => {
            const file = event.target.files[0];
            setFile(file);
          }}
        />
        <Button className="create-post__button" type="submit">
          Publier
        </Button>
      </div>
    </form>
  );
};

export default CreatePost;
