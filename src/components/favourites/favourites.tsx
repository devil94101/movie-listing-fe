import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AxiosInstance } from "../../utils/networkWrapper";
import { MovieData } from "../../testData";
import Card from "../../common/card/card";
import { MovieDetailType } from "../../types/movieTypes";
import { useAppSelector } from "../../redux/hooks";
import { useDispatch } from "react-redux";

const FavMovieList = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<MovieDetailType[]>([]);
  const [loading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { userFavs } = useAppSelector((state) => state.rootState);

  const getMovieData = () => {
    setIsLoading(true);
    AxiosInstance.get("/favourites/data")
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((err) => {
        console.log("dd", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getMovieData();
  }, []);

  console.log(userFavs, data);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center w-full">
      {data.map((ele) => {
        if (userFavs.includes(ele.id)) {
          return <Card {...ele} key={ele.id} isFav={true} />;
        }
        return <></>;
      })}
      {!data.length && <center className="text-4xl">No data found!</center>}
    </div>
  );
};

export default FavMovieList;
