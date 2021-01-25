import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';

import './Post.css';

const Post = ( { postId, imageUrl, username, caption } ) => {
  const [ comments, setComments ] = useState([]);

  useEffect(()=> {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection('posts')
        .doc(postId)
        .collection('commnets')
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
  })

  return (
    <div className="post">
      <div className="post-header">
        <Avatar 
          className="post-avatar"
          alt="s2ungju"
        />
        <h3>{username}</h3>
      </div>

      <img className="post-image" src={imageUrl}/>

      <h4 className="post-text"><strong>{username}</strong>{caption}</h4>

    </div>
  )
}
export default Post;