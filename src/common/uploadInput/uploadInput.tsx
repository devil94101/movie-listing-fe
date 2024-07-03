import React, { useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { FaPlus } from "react-icons/fa";

interface props {
  onChange: (e: File[]) => void;
  accept?: { [key: string]: string[] };
  file?: string
}

const baseStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

export const UploadInput = ({ onChange, accept, file }: props) => {
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: accept
        ? accept
        : {
            "image/*": [],
          },
      multiple: false,
      onDrop(acceptedFiles) {
        onChange(acceptedFiles);
      },
    });
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  return (
    <div className="">
      {!file ? (
        <div className="">
          <div {...getRootProps({ style })}>
            <input {...getInputProps()} />
            <div className="w-60 h-60 border flex items-center justify-center cursor-pointer">
              <div className="flex flex-col items-center">
                <FaPlus />
                <p>Add Movie Poster </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-60 h-60 flex items-center justify-center cursor-pointer">
          <img src={file} className=" bg-cover w-full h-full"/>
      </div>
      )}
    </div>
  );
};
