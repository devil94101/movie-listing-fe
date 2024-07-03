import React, { useState } from "react";
import { MovieDetailType } from "../../types/movieTypes";
import { useNavigate } from "react-router";
import { CiHeart } from "react-icons/ci";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { AxiosInstance } from "../../utils/networkWrapper";
import ResponsiveDialog from "../Modal/modal";
import { FaHeart } from "react-icons/fa";
import { rootSlice } from "../../redux/slices/root.slice";
import Loader from "../loader/loader";

interface props extends MovieDetailType {
  isFav: boolean;
}

const Card = (props: props) => {
  const navigate = useNavigate();
  const { isLogin, userFavs } = useAppSelector((State) => State.rootState);
  const [showPopup, setShowPopup] = useState(false);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const gotoMovieDetailPage = () => {
    navigate("/movieDetail/" + props.id);
  };

  const addToFav = () => {
    if (isLogin) {
      setLoading(true)
      AxiosInstance.post("/favourites/add", {
        movieId: props.id,
      })
        .then(() => {
          let newFav = [...userFavs];
          if (newFav.includes(props.id)) {
            newFav = newFav.filter((ele) => ele !== props.id);
          } else {
            newFav.push(props.id);
          }
          dispatch(rootSlice.actions.setFavs(newFav));
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => { setLoading(false) });
    } else {
      setShowPopup(true);
    }
  };

  return (
    <div className="card glass w-80 h-[36rem]">
      {loading && <Loader />}
      {props.poster ? (
        <figure className="h-3/4">
          <img
            src={props.poster}
            alt="Movie Poster"
            className=" bg-cover"
            width="100%"
          />
        </figure>
      ) : (
        <figure className="h-3/4 bg-black">
          <img
            src={"https://placehold.co/600x400"}
            alt="Movie Poster"
            className=" bg-cover"
            width="100%"
          />
        </figure>
      )}

      <div className="flex items-center">
        <div
          className="card-body cursor-pointer w-40"
          onClick={gotoMovieDetailPage}
        >
          <h2 className="card-title">{props.title}</h2>
          <p>{props.gener}</p>
        </div>
        {props.isFav ? (
          <FaHeart color="red" onClick={addToFav} size={30} className="mr-4 cursor-pointer" />
        ) : (
          <CiHeart
            size={30}
            className="mr-4 cursor-pointer"
            onClick={addToFav}
          />
        )}
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
  );
};

export default Card;
