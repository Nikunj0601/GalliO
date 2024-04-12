import React, { useEffect, useState } from "react";
import axios from 'axios'
import { Link } from "react-router-dom";

const Explore = () => {
  const token = localStorage.getItem("token")
  const [photos, setPhotos] = useState([]);
  const [isBlurred, setIsBlurred] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/photo/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPhotos(response.data)
      } catch (error) {
        console.log("Error: ", error);
      }
    } 
    fetchPhotos()
  },[])
  console.log(photos);

  const handleUnblur = (photoId) => {
    const updatedPhotos = [...photos];
    const photoIndex = updatedPhotos.findIndex(photo => photo.id === photoId);
    
    if (photoIndex !== -1) {
      updatedPhotos[photoIndex].moderated = false;
      
      setPhotos(updatedPhotos);
    }
  }

  return (
    <div className="">
      <div className="grid sm:flex sm:justify-between top-20 mb-6 mt-6 sm:mt-6 px-12">
        <div>
          <h1 className="relative ml-10 grid-rows-1 text-3xl font-bold text-gray-800">
            Explore
          </h1>
        </div>
        <div className="mx-auto flex flex-col sm:mr-6 sm:grid-rows-2 sm:flex-row sm:items-center sm:justify-end">
          <button className="mb-2 w-full rounded bg-orange-600 px-4 py-2 font-bold text-white hover:bg-orange-700 sm:mb-0 sm:mr-2 sm:w-auto">
            <Link to={"/upload"}>Upload</Link>
          </button>
        </div>
      </div>
      <hr className="mx-20 my-6 "></hr>
      <div className="grid md:grid-cols-2 mx-10 sm:mx-20 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Map through photos and render each card */}
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="rounded-lg border bg-card text-card-foreground shadow-sm"
            data-v0-t="card"
          >
            <div className="flex items-center space-x-4 p-4">
              <div className="aspect-w-1 aspect-h-1 rounded-full overflow-hidden">
                <img
                  src={
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                  } // Assuming thumbnailUrl is available in your photo object
                  alt={photo.title} // Assuming title is available in your photo object
                  width="40"
                  height="40"
                  className="aspect-object"
                />
              </div>
              <div className="grid gap-0.5 text-sm">
                <div className="font-medium">{photo.caption}</div>
                <div className="text-gray-500 dark:text-gray-400">
                  by {photo.user.firstName} {photo.user.lastName}{" "}
                  {/* Assuming author is available in your photo object */}
                </div>
              </div>
            </div>
            {photo.moderated ? (
              <div>
                <div className="relative aspect-card overflow-hidden rounded-lg">
                  <img
                    src={photo.downloadUrl}
                    alt={`${photo.firstName}`}
                    width="400"
                    height="300"
                    className="object-cover w-full h-full filter blur-md"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white">
                    <p>This image contains moderated content.</p>
                    <p
                      className="cursor-pointer underline ml-2"
                      onClick={() => handleUnblur(photo.id)}
                    >
                      See image
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-card overflow-hidden rounded-lg">
                <img
                  src={photo.downloadUrl}
                  alt={`${photo.firstName}`}
                  width="400"
                  height="300"
                  className="object-cover w-full h-full"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;