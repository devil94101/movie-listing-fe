// src/components/MovieForm.js
import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  CircularProgress,
  Box,
  SelectChangeEvent,
} from "@mui/material";
import Toast, { showToast } from "../../common/toastr/toastr";
import { MovieForm } from "./MovieConstants";
import { AxiosInstance } from "../../utils/networkWrapper";
import { UploadInput } from "../../common/uploadInput/uploadInput";
import MultipleSelectChip from "../../common/multiselect/multiselect";
import { Geners } from "../../constants/movieContants";
import { useNavigate, useParams } from "react-router";
import Loader from "../../common/loader/loader";

const AddMovieForm = () => {
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [movieImage, setMovieImage] = useState<{url: string; fileName: string}| null>(null);
  const [geners, setGeners] = useState<string[]>([]);
  const [isImageUpload, setIsImageUpload] = useState(false)
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const checkErrors = () => {
    let isError = false;
    const newErrors: { [key: string]: string } = {};
    for (const i of MovieForm) {
      if (!formData[i.name]) {
        isError = true;
        newErrors[i.name] = `${i.name} value is required!`;
      } else if (i.name === "Minutes" && +formData[i.name] >= 60) {
        isError = true;
        newErrors[i.name] = `${i.name} value Should be less than 60!`;
      } else if (i.name === "Seconds" && +formData[i.name] >= 60) {
        isError = true;
        newErrors[i.name] = `${i.name} value Should be less than 60!`;
      }
    }
    if (!movieImage) {
      isError = true;
      showToast.error("Poster is required!");
    }
    if(!geners.length){
      isError = true;
      showToast.error("Gener is required field!");
    }

    setErrors({ ...newErrors });
    return isError;
  };

  const handleSubmit = async () => {
    if (checkErrors()) return;

    setLoading(true);
    try {
      console.log(new Date(formData['release']).toUTCString())
      await AxiosInstance.post("/movie/add-movie", {
        title: formData.Title,
        gener: geners.join('|'),
        description: formData['Description'],
        releaseDate: new Date(formData['release']),
        poster: movieImage?.fileName
      }
      );
      showToast.success("Movie added successfully!");
      setFormData({});
      setMovieImage(null)
      setGeners([])
    } catch (error: any) {
      showToast.error(error?.response?.data?.message || "Failed to add movie. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setGeners(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleUpload = (file: File) => {
    const fileData = new FormData();
    fileData.append("file", file);
    setIsImageUpload(true)
    AxiosInstance.post("/movie/upload-poster", fileData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        setMovieImage({...res.data})
      })
      .catch((err) => {
        console.log(err);
      }).finally(() =>{
        setIsImageUpload(false);
      });
  };

  return (
    <div className="w-full flex flex-col items-center ">
      <div className="p-8 grid grid-cols-2 gap-x-4">
        {isImageUpload && <Loader />}
        {MovieForm.map((field, index) => {
          return (
            <TextField
              key={index}
              label={field.label}
              type={field.type}
              placeholder={field.label}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              style={{ margin: "1rem" }}
              error={errors[field.name] ? true : false}
              helperText={errors[field.name] || ""}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          );
        })}
        <MultipleSelectChip
          names={Geners}
          handleChange={handleGenerChange}
          values={geners}
          label="Geners"
        />
      </div>
      <center className="w-full pb-4">
        <div className="flex gap-x-4 justify-center">
          <UploadInput
            onChange={(e) => {
              handleUpload(e[0]);
            }}
            file={movieImage?.url}
          />
        </div>
      </center>
      <div className=" flex gap-x-4 justify-center w-full">
        <button
          onClick={() => navigate("/")}
          disabled={loading}
          className="btn btn-secondary"
        >
          Cancel
        </button>

        <button onClick={handleSubmit} disabled={loading} className="btn">
          {loading ? <CircularProgress size={24} /> : "Submit"}
        </button>
      </div>
      <Toast />
    </div>
  );
};

export default AddMovieForm;
