import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AxiosInstance } from "../../utils/networkWrapper";
import { MovieData } from "../../testData";
import Card from "../../common/card/card";
import { MovieDetailType } from "../../types/movieTypes";
import { useAppSelector } from "../../redux/hooks";

const MovieList = () => {
  const [search, setSearch] = useState("");
  const [data,setData] = useState<MovieDetailType[]>([])
  const [loading, setIsLoading] = useState(false);
  const {userFavs} = useAppSelector(state=>state.rootState)

  const getMovieData = () => {
    setIsLoading(true);
    AxiosInstance.get("/movie-get")
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
    getMovieData()
  },[])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
      {data.map((ele) => {
        return <Card {...ele}  key={ele.id} isFav={userFavs?.includes(ele.id)}/>;
      })}
    </div>
  );
};

export default MovieList;
