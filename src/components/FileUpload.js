import React, { useContext, Fragment } from "react";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import Image from "./Image";
const FileUpload = ({
  setValues,
  setLoading,
  values,
  loading,
  singleUpload = false,
}) => {
  const { state } = useContext(AuthContext);

  const fileResizeAndUpload = (event) => {
    setLoading(true);
    let fileInput = false;
    if (event.target.files[0]) {
      fileInput = true;
    }
    if (fileInput) {
      Resizer.imageFileResizer(
        event.target.files[0],
        300,
        300,
        "JPEG",
        100,
        0,
        (uri) => {
          // console.log(uri);
          axios
            .post(
              `http://localhost:8000/uploadimages`,
              { image: uri },
              {
                headers: {
                  authtoken: state.user.token,
                },
              }
            )
            .then((response) => {
              setLoading(false);
              console.log("CLOUDINARY UPLOAD", response);
              if (singleUpload) {
                // single upload
                const { image } = values;
                setValues({ ...values, image: response.data });
              } else {
                const { images } = values;
                setValues({ ...values, images: [...images, response.data] });
              }
              // const { images } = values;
              // setValues({ ...values, images: [...images, response.data] });
            })
            .catch((error) => {
              setLoading(false);
              console.log("CLOUDINARY UPLOAD FAILED", error);
            });
        },
        "base64"
      );
    }
  };

  const handleImageRemove = (id) => {
    setLoading(true);
    axios
      .post(
        `http://localhost:8000/removeimage`,
        {
          public_id: id,
        },
        {
          headers: {
            authtoken: state.user.token,
          },
        }
      )
      .then((response) => {
        setLoading(false);

        if (singleUpload) {
            const { image } = values;
            setValues({
                ...values,
                image: {
                    url: '',
                    public_id: ''
                }
            });
        } else {
            const { images } = values;
            let filteredImages = images.filter((item) => {
                return item.public_id !== id;
            });
            setValues({ ...values, images: filteredImages });
        }




    
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  return (
    <div className="row">
      <div className="col-md-3">
        <div className="form-group">
          <label className="btn btn-primary">
            Upload Image
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={fileResizeAndUpload}
              className="form-control"
              placholder="Image"
            />
          </label>
        </div>
      </div>
      <div className="col-md-9">
        {/*for single image
✅ post image upload

*/}
        {values.image && (
          <Image
            image={values.image}
            key={values.image.public_id}
            handleImageRemove={handleImageRemove}
          />
        )}

        {/*for multiple image
                
✅ user profile array of images upload
                
                */}
        {values.images &&
          values.images.map((image) => (
            <Image
              image={image}
              key={image.public_id}
              handleImageRemove={handleImageRemove}
            />
          ))}
      </div>
    </div>
  );
};

export default FileUpload;

{
  /* {values.images.map((image) => (
                <img
                    src={image.url}
                    key={image.public_id}
                    alt={image.public_id}
                    style={{ height: '100px' }}
                    className="float-right"
                    onClick={() => handleImageRemove(image.public_id)}
                />
            ))} */
}
