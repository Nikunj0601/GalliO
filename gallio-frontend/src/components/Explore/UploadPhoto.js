import React, { useState } from 'react'
import { useAuth } from '../../context/authProvider';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UploadPhoto = () => {
    const token = localStorage.getItem("token");

    const navigate = useNavigate()

    const [caption, setCaption] = useState();
    const [image, setImage] = useState();
    const [errors, setErrors] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [isPublic, setIsPublic] = useState(true)
    const { userId } = useAuth()

    const handleCaptionChange = (e) => {
        const { name, value } = e.target;
        let error = null;
        if(!value) {
            error = "Caption can not be empty."
        }
        setCaption(value);
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: error,
        }));
    }

    const handleFileChange = (e) => {
        setImage(e.target.files[0])
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreview(reader.result);
          };
          reader.readAsDataURL(file);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("file", image);
            formData.append("userId", userId);
            formData.append("caption", caption);
            formData.append("isPublic", isPublic);
            const uploadImagesResponse = await axios.post(
              `${process.env.REACT_APP_BACKEND_URL}/photo/upload`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            if(uploadImagesResponse.status === 201) {
                navigate("/profile")
            }
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <div>
      <div className="relative mx-auto mt-16 w-full max-w-7xl items-center px-5 py-12 md:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-md sm:px-4 md:w-96 md:max-w-sm md:px-0">
          <div className="flex flex-col">
            <div className="items-center justify-center">
              <h2 className="text-4xl text-center text-black ">Upload Photo</h2>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mt-4 space-y-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Caption <span style={{ color: "red" }}>*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="caption"
                    name="caption"
                    id="caption"
                    value={caption}
                    onChange={handleCaptionChange}
                    className={`bg-gray-50 border ${
                      errors.caption ? "border-red-500" : "border-gray-300"
                    } text-gray-900 sm:text-sm rounded-lg focus:ring-gray-900 focus:border-gray-900 block w-full p-2.5`}
                    placeholder="Write caption here"
                    required
                  />
                </div>
                {errors.caption && (
                  <p className="mt-2 text-sm text-red-600">{errors.caption}</p>
                )}
              </div>
              <div className="flex w-full items-center justify-center">
                <label
                  htmlFor="dropzone-file"
                  className={`dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100`}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Uploaded"
                      className="h-full w-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center pb-6 pt-5">
                      <svg
                        className="mb-4 h-8 w-8 text-gray-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        ></path>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </div>
                  )}
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    name="profile_picture"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                  />
                </label>
              </div>
              <div className="mt-4 flex items-center">
                <input
                  type="checkbox"
                  id="privacy-checkbox"
                  name="privacy"
                  className="h-4 w-4 text-gray-700 rounded"
                  checked={isPublic}
                  onChange={() => setIsPublic(!isPublic)}
                />
                <label
                  htmlFor="privacy-checkbox"
                  className="ml-2 text-sm text-gray-700"
                >
                  Upload as Public
                </label>
              </div>
              <div className="col-span-full mt-10">
                <button
                  className="nline-flex w-full items-center justify-center rounded-xl bg-gray-600 px-6 py-2.5 text-center text-sm text-white hover:bg-gray-900"
                  type="submit"
                  // onClick={handleListingPage}
                >
                  Upload
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UploadPhoto
