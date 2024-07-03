import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import { MovieDetailType } from "../../types/movieTypes";
import { AxiosInstance } from "../../utils/networkWrapper";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import ResponsiveDialog from "../../common/Modal/modal";
import Loader from "../../common/loader/loader";
import { FaHeart } from "react-icons/fa";
import { rootSlice } from "../../redux/slices/root.slice";
import Comments from "../comments/comments";
import { v4 } from "uuid";

interface MovieDataType extends MovieDetailType {
  isFavourite: boolean;
}

const MovieDetails = () => {
  const [search, setSearch] = useState("");
  const { id } = useParams();
  const [movieData, setMovieData] = useState<MovieDataType | null>(null);
  const { isLogin, userFavs } = useAppSelector((state) => state.rootState);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allComments, setAllCommnets] = useState<
    {
      id: string;
      comment: string;
      email: string;
      userId: string;
      createdAt: number;
    }[]
  >([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id) {
      AxiosInstance.get("/movie-get/" + id).then((res) => {
        console.log(res.data);
        setMovieData({
          isFavourite: false,
          ...res.data.movieData,
        });
        setAllCommnets(res.data.comments.map((ele: any)=>{
          return {
            ...ele,
            id: v4()
          }
        }));
      });
    }
  }, [id]);

  const addToFav = () => {
    if (isLogin && id) {
      setLoading(true);
      AxiosInstance.post("/favourites/add", {
        movieId: id,
      })
        .then((res) => {
          console.log(res);
          let newFav = [...userFavs];
          if (newFav.includes(id)) {
            newFav = newFav.filter((ele) => ele !== id);
          } else {
            newFav.push(id);
          }
          dispatch(rootSlice.actions.setFavs(newFav));
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setShowPopup(true);
    }
  };
  const isFav = userFavs.includes(id || "");

  if (movieData) {
    return (
      <div>
        <div className=" flex justify-center px-8">
          {loading && <Loader />}
          <div className="card card-side bg-base-100 shadow-xl sm:w-full md:w-3/4 overflow-hidden">
            <div className="w-60 ">
              <figure className="">
                <img
                  src={movieData.poster}
                  alt="Movie"
                  className=" bg-cover "
                />
              </figure>
            </div>
            <div className="card-body">
              <h2 className="card-title">{movieData?.title}</h2>
              <p>{movieData.gener}</p>
              <p>{movieData.description}</p>
              <div className="card-actions items-center">
                {!isFav ? (
                  <div
                    className="flex items-center border border-gray-300 rounded-full px-4 py-2 cursor-pointer  btn"
                    onClick={addToFav}
                  >
                    <p>Add To Favourites</p>
                    <CiHeart size={30} />
                  </div>
                ) : (
                  <div
                    className="flex items-center border border-gray-300 rounded-full px-4 py-2 cursor-pointer  btn"
                    onClick={addToFav}
                  >
                    <p>Favourite</p>
                    <FaHeart color="red" size={30} />
                  </div>
                )}
              </div>
            </div>
          </div>
          <ResponsiveDialog
            open={showPopup}
            setOpen={() => {
              setShowPopup(false);
            }}
            singleBtn
          >
            <div>Please Login Before Adding to your Favourites.</div>
          </ResponsiveDialog>
        </div>
        <Comments commentsData={allComments} movieId={id || ''} setComments={setAllCommnets} />
      </div>
    );
  }

  return <></>;
};

export default MovieDetails;
