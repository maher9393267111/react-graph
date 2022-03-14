import React, { useState, useContext, useEffect, fragment } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation } from "@apollo/client";
import FileUpload from "../../components/FileUpload";
import { POST_CREATE, POST_DELETE } from "../../graphql/mutations";
import { POSTS_BY_USER } from "../../graphql/queries";
import PostCard from "../../components/PostCard";
const initialState = {
  content: "",
  image: {
    url: "https://via.placeholder.com/200x200.png?text=Post",
    public_id: "123",
  },
};

const Post = () => {
  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);

  // destructure
  const { content, image } = values;

  // mutation
  // const [postCreate] = useMutation(POST_CREATE, {
  //     //  read query from cache / write query to cache
  //     update: (data) => console.log(data), // 🔥
  //     // onError: (err) => console.log(err.graphqQLError[0].message)
  // });

  // 🔥🔥🔥🔥🔥 post Delete mutation
  const [postDelete] = useMutation(POST_DELETE, {
    update: ({ data }) => {
      console.log("POST DELETE MUTATION", data);
      toast.error("Post deleted");
    },
    onError: (err) => {
      console.log(err);
      toast.error("Post delete failed");
    },
  });

  // mutation 🔥🔥🔥🔥🔥🔥🔥
  const [postCreate] = useMutation(POST_CREATE, {
    // read query from cache / write query to cache
    update: (cache, { data: { postCreate } }) => {
      try {
        // read Query from cache
        // 🔥🔥 read all currentUser posts
        const { postsByUser } = cache.readQuery({
          query: POSTS_BY_USER,
        });
        // write Query to cache
        // 🔥🔥 add the new created post to currentUser posts
        cache.writeQuery({
          query: POSTS_BY_USER,
          data: {
            postsByUser: [postCreate, ...postsByUser], // 🔥🔥
          },
        });
      } catch (e) {
        console.error(e);
      }
    },
    // onError: (err) => console.log(err.graphqQLError[0].message)
  });

  const handleDelete = async (postId) => {
    let answer = window.confirm("Delete?");
    if (answer) {
      setLoading(true);
      postDelete({
        variables: { postId },
        refetchQueries: [{ query: POSTS_BY_USER }],
      });
      console.log(postId)
      setLoading(false);
    }
  };

  // query
  const { data: posts } = useQuery(POSTS_BY_USER);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    postCreate({ variables: { input: values } }); // 🔥
    setValues(initialState);
    setLoading(false);
    toast.success("Post created");
  };

  const handleChange = (e) => {
    e.preventDefault();
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const createForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <textarea
          value={content}
          onChange={handleChange}
          name="content"
          rows="10"
          className="md-textarea form-control"
          placeholder="Write something cool"
          maxLength="150"
          disabled={loading}
        ></textarea>
      </div>

      <button
        className="btn btn-primary"
        type="submit"
        disabled={loading || !content}
      >
        Post
      </button>
    </form>
  );

  return (
    <div className="container p-5">
      {loading ? <h4 className="text-danger">Loading...</h4> : <h4>Create</h4>}

      <FileUpload
        values={values}
        loading={loading}
        setValues={setValues}
        setLoading={setLoading}
        singleUpload={true}
      />

      <div className="row">
        <div className="col">{createForm()}</div>
      </div>
      <hr />
      <div className="d-flex flex-wrap">
        {posts &&
          posts.postsByUser.map((post) => (
            <div className="col-md-6 pt-5" key={post._id}>
              <PostCard
                post={post}
                handleDelete={handleDelete}
                showUpdateButton={true}
                showDeleteButton={true}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Post;
