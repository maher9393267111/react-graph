
import Image from "./Image";
import { Link, useHistory } from 'react-router-dom';
const PostCard = ({ post, handleDelete = (f) => f, showUpdateButton = false, showDeleteButton = false }) => {
    const { image, content, postedBy } = post;
    const history =useHistory();
    return (
        <div className="card text-center" style={{ minHeight: '375px' }}>
            <div className="card-body">

            {/* 🔥🔥🔥🔥🔥🔥🔥 go to singl post page */}

            <Link to={`/post/${post._id}`}>
                    <Image image={image} />
                </Link>


                <h4 className="text-primary">@{post.postedBy.username}</h4>
                <hr />
                <small>{content}</small>
                {showDeleteButton && (
                    <button onClick={() => handleDelete(post._id)} className="btn m-2 btn-danger">
                        Delete
                    </button>
                )}
                {showUpdateButton && (
                    <button onClick={() => history.push(`/post/update/${post._id}`)} className="btn m-2 btn-warning">
                        Update
                    </button>
                )}


            </div>
        </div>
    );
};

export default PostCard;
