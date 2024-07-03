import React, { useEffect, useState } from "react";
import { timeSinceComment } from "../../utils/constants";
import { AxiosInstance } from "../../utils/networkWrapper";
import { jwtDecode } from "jwt-decode";
import Toast, { showToast } from "../../common/toastr/toastr";
import Loader from "../../common/loader/loader";
import { v4 } from "uuid";

const Comments = ({
  movieId,
  commentsData,
  setComments,
}: {
  movieId: string;
  commentsData: {
    id: string;
    comment: string;
    email: string;
    userId: string;
    createdAt: number;
  }[];
  setComments: React.Dispatch<
    React.SetStateAction<
      {
        id: string;
        comment: string;
        email: string;
        userId: string;
        createdAt: number;
      }[]
    >
  >;
}) => {
  const [newComment, setNewCommnet] = useState("");
  const [loading, setLoading] = useState(false);

  const calculateTimeForComments = (createdAt: number) => {
    return timeSinceComment(createdAt);
  };

  const addComment = () => {
    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) {
      showToast.error("Please login to comment on movies!");
      return
    }
    const decodedToken: any = jwtDecode(token || "");
    if (decodedToken.email) {
      setLoading(true);
      AxiosInstance.post("/movie/add-comment", {
        comment: newComment,
        email: decodedToken.email,
        userId: decodedToken.uid,
        createdAt: new Date().getTime(),
        movieId,
      })
        .then((res) => {
          let newComments = [
            {
              comment: newComment,
              email: decodedToken.email,
              userId: decodedToken.uid,
              createdAt: new Date().getTime(),
              id: v4(),
            },
            ...commentsData,
          ];
          setComments(newComments);
          showToast.success("Comment added successfully!");
        })
        .catch((err) => {
          console.log(err);
          showToast.error("");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      showToast.error("Please login to comment on movies!");
    }
  };

  return (
    <div className="my-4">
      {loading && <Loader />}
      <div className="ml-16">
        <div>
          <input
            type="text"
            placeholder="Comment....."
            className="input input-primary w-full max-w-xs"
            value={newComment}
            onChange={(e) => setNewCommnet(e.target.value)}
          />
        </div>
        <button className="btn btn-sm mt-4" onClick={addComment}>
          Comment
        </button>
      </div>

      <div className="ml-16">
        {commentsData.map((ele) => {
          return (
            <div className="chat chat-start" key={ele.id}>
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS chat bubble component"
                    src="https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
                  />
                </div>
              </div>
              <div className="chat-header">
                <p>{ele.email}</p>
                <time className="text-xs ">
                  {calculateTimeForComments(ele.createdAt)}
                </time>
              </div>
              <div className="chat-bubble">{ele.comment}</div>
            </div>
          );
        })}
      </div>
      <Toast />
    </div>
  );
};

export default Comments;
