import React, { useEffect, useState } from "react";
import Login from "./components/login/login";
import { Route, Routes, useActionData } from "react-router";
import AddMovieForm from "./components/addmovies/add-movie";
import MovieList from "./components/movieList/movieList";
import Header from "./common/Header/header";
import Layout from "./common/Layout/layout";
import MovieDetails from "./components/movieDetail/movieDetails";
import AdminLayout from "./common/Layout/adminLayout";
import AdminDashboard from "./components/AdminDashboard";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { AxiosInstance } from "./utils/networkWrapper";
import { rootSlice } from "./redux/slices/root.slice";
import FavMovieList from "./components/favourites/favourites";
import Toast from "./common/toastr/toastr";

function App() {
  const {role,isLogin} = useAppSelector(state=>state.rootState)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if(isLogin && role !== 'admin') {
      AxiosInstance.get('/favourites').then(res=>{
        dispatch(rootSlice.actions.setFavs(res.data));
      }).catch(Err=>{
        console.log(Err)
      })
    }
  },[role,isLogin])


  if (role === 'admin') {
    return (
      <AdminLayout routes={[{ name: "HOME", link: "/" }, {name: "ADD MOVIE", link: '/add-movie'}]}>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/add-movie" element={<AddMovieForm />} />
          <Route path="/movieDetail/:id" element={<MovieDetails />} />
        </Routes>
        
      </AdminLayout>
    );
  }

  return (
    <Layout routes={[{ name: "HOME", link: "/" }, {name: "FAVOURITES", link: '/favourites'}]}>
      <Routes>
        <Route path="/" element={<MovieList />} />
        <Route path="/favourites" element={<FavMovieList />} />
        <Route path="/movieDetail/:id" element={<MovieDetails />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Layout>
  );
}

export default App;
