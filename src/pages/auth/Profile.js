import React, { useState, useMemo, Fragment, useContext } from "react";
import { toast } from "react-toastify";
import { useQuery, useMutation, gql } from "@apollo/client";
import { PROFILE } from "../../graphql/queries";
import { USER_UPDATE } from "../../graphql/mutations";
import axios from "axios";
import Resizer from "react-image-file-resizer";
import { AuthContext } from "../../context/authContext";
import UserProfile from "../../components/forms/UserProfile";
import FileUpload from "../../components/FileUpload";
const Profile = () => {
  const [values, setValues] = useState({
    username: "",
    name: "",
    email: "",
    about: "",
    images: [],
  });
  const [loading, setLoading] = useState(false);

  const { state } = useContext(AuthContext);

  const { data } = useQuery(PROFILE);

  useMemo(() => {
    if (data) {
      // console.log(data.profile);
      setValues({
        username: data.profile.username,
        name: data.profile.name,
        email: data.profile.email,
        about: data.profile.about,
        images: data.profile.images,
        //  images: omitDeep(data.profile.images, ['__typename'])
      });
    }
  }, [data]);

  // destructure
  const { username, name, email, about, images } = values;

  //mutation
  const [userUpdate] = useMutation(USER_UPDATE, {
    update: ({ data }) => {
      console.log("USER UPDATE MUTATION IN PROFILE", data);
      toast.success("Profile updated");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(values);
    setLoading(true);
    userUpdate({ variables: { input: values } });
    setLoading(false);
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
   
    <div className="container p-5">
    <div className="row">
        <div className="col-md-12 pb-3">
            {loading ? <h4 className="text-danger">Loading...</h4> : <h4>Profile</h4>}
        </div>

        <FileUpload setValues={setValues} setLoading={setLoading} values={values} loading={loading} />
    </div>
    <UserProfile {...values} handleChange={handleChange} handleSubmit={handleSubmit} loading={loading} />
</div>
      

  
  );
};

export default Profile;

// const PROFILE = gql`
//   query {
//     profile {
//       _id
//       name
//       username
//       email
//       images {
//         url
//         __typename @skip(if: true)
//         public_id
//       }
//       about
//       createdAt
//       updatedAt
//     }
//   }
// `;

// // user update

// const USER_UPDATE = gql`
//   mutation userUpdate($input: UserUpdateInput!) {
//     userUpdate(input: $input) {
//       _id
//       name
//       username
//       email
//       images {
//         url
//         public_id
//       }
//       about
//       createdAt
//       updatedAt
//     }
//   }
// `;

// const profileUpdateForm = () => (
//   <form onSubmit={handleSubmit}>
//       <div className="form-group">
//           <label>Username</label>
//           <input
//               type="text"
//               name="username"
//               value={username}
//               onChange={handleChange}
//               className="form-control"
//               placholder="Username"
//               disabled={loading}
//           />
//       </div>

//       <div className="form-group">
//           <label>Name</label>
//           <input
//               type="text"
//               name="name"
//               value={name}
//               onChange={handleChange}
//               className="form-control"
//               placholder="Name"
//               disabled={loading}
//           />
//       </div>

//       <div className="form-group">
//           <label>Email</label>
//           <input
//               type="email"
//               name="email"
//               value={email}
//               onChange={handleChange}
//               className="form-control"
//               placholder="Username"
//               disabled
//           />
//       </div>

//       <div className="form-group">
//           <label>About</label>
//           <textarea
//               name="about"
//               value={about}
//               onChange={handleChange}
//               className="form-control"
//               placholder="Username"
//               disabled={loading}
//           />
//       </div>

//       <button className="btn btn-primary" type="submit" disabled={!email || loading}>
//           Submit
//       </button>
//   </form>
// );




//*********** */


  // const fileResizeAndUpload = (event) => {
  //   let fileInput = false;
  //   if (event.target.files[0]) {
  //     fileInput = true;
  //   }
  //   if (fileInput) {
  //     Resizer.imageFileResizer(
  //       event.target.files[0],
  //       300,
  //       300,
  //       "JPEG",
  //       100,
  //       0,
  //       (uri) => {
  //         // console.log(uri);

  //         axios
  //           .post(
  //             `http://localhost:8000/uploadimages`,
  //             { image: uri },
  //             {
  //               headers: {
  //                 // ---------------->>>>> in server middlware header token   if (req.headers.authtoken)
  //                 authtoken: state.user.token,
  //               },
  //             }
  //           )
  //           .then((response) => {
  //             console.log(response);
  //             setLoading(false);
  //             console.log("CLOUDINARY UPLOAD", response);
  //             setValues({ ...values, images: [...images, response.data] });
  //           })
  //           .catch((error) => {
  //             setLoading(false);
  //             console.log("CLOUDINARY UPLOAD FAILED", error);
  //           });
  //       },
  //       "base64"
  //     );
  //   }
  // };

  // const handleImageRemove = (id) => {
  //   setLoading(true);
  //   axios
  //     .post(
  //       `http://localhost:8000/removeimage`,
  //       {
  //         public_id: id,
  //       },
  //       {
  //         headers: {
  //           authtoken: state.user.token,
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       setLoading(false);
  //       let filteredImages = images.filter((item) => {
  //         return item.public_id !== id;
  //       });
  //       setValues({ ...values, images: filteredImages });
  //     })
  //     .catch((error) => {
  //       setLoading(false);
  //       console.log(error);
  //     });
  // };