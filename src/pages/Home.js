import React, { useState, useEffect, useContext } from "react";

import { gql, useQuery, useLazyQuery,useSubscription } from "@apollo/client";

import { AuthContext } from "../context/authContext";

import { GET_ALL_POSTS, TOTAL_POSTS } from "../graphql/queries";

import PostCard from "../components/PostCard";
import PostPagination from "../components/PostPagination";
import { toast } from 'react-toastify';
import { POST_ADDED, POST_UPDATED, POST_DELETED } from '../graphql/subscriptions';
// in studio subscription {

// postAdded {
//   content
//   _id
// }

// }



// const POST_ADDED = gql`
//   subscription {
//     postAdded {
//       _id
//       content
//       image {
//         url
//       }
//       postedBy {
//         username
//       }
//     }
//   }
// `;

//ggggg






function Home(props) {
  const name ='maher'
  const { state, dispatch } = useContext(AuthContext);
  const [page, setPage] = useState(1);

  // const { data, loading, error } = useQuery(GET_ALL_POSTS);
  const { data, loading, error } = useQuery(GET_ALL_POSTS, {
    variables: { page },
  });

  const { data: postCount } = useQuery(TOTAL_POSTS);
  const [fetchPosts, { data: posts }] = useLazyQuery(GET_ALL_POSTS);

////🚀 
// const { data: newPost } = useSubscription(POST_ADDED);


const { data: newPost } = useSubscription(POST_ADDED, {
  onSubscriptionData: async ({ client: { cache }, subscriptionData: { data } }) => {
    // console.log(data)
    // readQuery from cache
    
    const { allPosts } = cache.readQuery({
      query: GET_ALL_POSTS,
      variables: { page }
    });
    // console.log(allPosts)

    // write back to cache
    cache.writeQuery({
      query: GET_ALL_POSTS,
      variables: { page },
      data: {
        allPosts: [data.postAdded, ...allPosts]
      }
    });
    // refetch all posts to update ui
    fetchPosts({
      variables: { page },
      refetchQueries: [{ query: GET_ALL_POSTS }]
    });
    // show toast notification
    toast.success('New post!');
  }
});


  // post updated
  const { data: updatedPost } = useSubscription(POST_UPDATED, {
    onSubscriptionData: () => {
      toast.success('Post updated!');
    }
  });
  // post deleted
  const { data: deletedPost } = useSubscription(POST_DELETED, {
    onSubscriptionData: async ({ client: { cache }, subscriptionData: { data } }) => {
      // console.log(data)
      // readQuery from cache
      const { allPosts } = cache.readQuery({
        query: GET_ALL_POSTS,
        variables: { page }
      });
      // console.log(allPosts)

      let filteredPosts = allPosts.filter((p) => p._id !== data.postDeleted._id);

      // write back to cache
      cache.writeQuery({
        query: GET_ALL_POSTS,
        variables: { page },
        data: {
          allPosts: filteredPosts
        }
      });
      // refetch all posts to update ui
      fetchPosts({
        variables: { page },
        refetchQueries: [{ query: GET_ALL_POSTS, variables: { page } }]
      });
      // show toast notification
      toast.error('Post deleted!');
    }
  });




  console.log(data);
  if (loading) return <p className="p-5">Loading...</p>;

  //

  return (
    <div className="container">
      <div className="row p-5">
        {data &&
          data.allPosts.map((post) => (
            <div className="col-md-4 pt-5" key={post._id}>
              <PostCard post={post} />
            </div>
          ))}
      </div>

      <PostPagination page={page} setPage={setPage} postCount={postCount} />

     

    </div>
  );
}

export default Home;

//  {JSON.stringify(state.user)}
//  {JSON.stringify(newPost)}  realtime