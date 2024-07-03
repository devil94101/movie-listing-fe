import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import "./login.css";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase-config";
import { AxiosInstance } from "../../utils/networkWrapper";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { rootSlice } from "../../redux/slices/root.slice";
import { jwtDecode } from "jwt-decode";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const dispatch = useAppDispatch();
  const { isLogin } = useAppSelector((state) => state.rootState);

  // const sendToken = async () => {
  //   const newToken = await currentUser.getIdToken(true);
  //   console.log(typeof newToken);
  //   const promise = await fetch(
  //     process.env.REACT_APP_API_URL + `user/auth/googleSignIn`,
  //     {
  //       method: "POST",
  //       headers: {
  //         accessToken: newToken,
  //         Accept: "application/json, text/plain, */*",
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ accessToken: newToken }),
  //     }
  //   );
  //   const data = await promise.json();
  //   if (data.status === "success") {
  //     console.log(data.status);
  //     navigate("/dashboard");
  //   } else if (data.status === "error") {
  //   }
  // };

  // redirecting to dashboard if the user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (isLogin && token) {
      navigate("/");
    }
  }, [isLogin]);

  const submitWithGoogle = async () => {
    setLoadingGoogle(true);
    try {
      const res = await signInWithPopup(auth, provider);
      const token = await res.user.getIdToken();
      // await AxiosInstance.post('/user/admin-create',{
      //   token
      // })
      const decodedToken: any = jwtDecode(token);
      if (decodedToken?.roles && decodedToken.roles[0] === "admin") {
        //admin login
        dispatch(rootSlice.actions.setLogin('admin'));
      }else{
        dispatch(rootSlice.actions.setLogin('user'));
      }
      localStorage.setItem("token", token);
      navigate("/");
    } catch (err: any) {}
    setLoadingGoogle(false);
  };

  return (
    <center>
      <div className="card bg-base-100 w-96 shadow-xl h-56">
        <div className="card-body justify-center items-center">
          <h2 className="card-title">Sign In! </h2>
          <button
            className="flex items-center gap-x-4 border-2 border-gray-300 rounded-full px-4 "
            disabled={loadingGoogle}
            onClick={submitWithGoogle}
          >
            <div>Sign In Using Google </div>
            <FcGoogle />
          </button>
        </div>
      </div>
    </center>
  );
}

export default Login;
