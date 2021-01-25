import React, { useState, useEffect } from 'react';
import Post from './Post';
import ImageUpload from './ImageUpload';
import { db, auth } from './firebase';
import { Button, Input } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import InstagramEmbed from 'react-instagram-embed';

import './App.css';

const getModalStyle = () => {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    bowShadow: theme.shadows[5],
    padding: theme.spacing(2,4,3)
  }
}));

const App = () => {
  const classes = useStyles();
  const [ modalStyle ] = useState(getModalStyle);
  const [ openSignIn, setOpenSignIn ] = useState(false);
  const [ posts, setPosts ] = useState([]);
  const [ open, setOpen ] = useState(false);
  const [ username, setUsername ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ user, setUser ] = useState(null);

  useEffect(()=> {
      const unsubscribe = auth.onAuthStateChanged((authUser)=> {
      if(authUser) {
        // User logged in
        console.log(authUser);
        setUser(authUser);

        if( authUser.displayName ) {
          // Do nothing
        }
        else {
          // Update user
          return authUser.updateProfile({
            displayName: username,
          })
        }
      } 
      else {
        // User logged out
        setUser(null);
      }
    })

    return () => {
      unsubscribe();
    }
  }, [user, username]);

  useEffect(()=> {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);
  
  const signUp = (e) => {
    e.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then(authUser => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error)=> alert(error.message))

      setOpen(false);
  }
  const signIn = (e) => {
    e.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch(error => alert(error.message))
    
    setOpenSignIn(false);
  }
  return (
    <div className="App">
      {user?.displayName ? (
        <ImageUpload username={user.displayName}/>
      ): (
        <h3>Sorry you need to login to upload</h3>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app-signup">
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>SignUp</Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app-signup">
            <Input
              placeholder="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>

      <div className="app-header">
        <div className="app-header-image">
          <img src="https://source.unsplash.com/random"/>
        </div>
        { user? 
          (
            <Button onClick={() => auth.signOut()}>Logout</Button>
          ):(
            <div className="app-loginContainer">
              <Button onClick={()=> setOpenSignIn(true)}>Sign In</Button>
              <Button onClick={() => setOpen(true)}>Sign Up</Button>
            </div>
          )
        }
      </div>

      <div className="app-posts">
        <div className="app-postsLeft">
          {
            posts.map(({id, post}) => (
              <Post key={id} postId={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
            ))
          }
        </div>
        <div className="app-postsRight">
          <h1>InstagramEmbed Position</h1>
          <InstagramEmbed
            url='https://www.instagram.com/p/B_uf9dmAGPw/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={()=> {}}
            onSuccess={()=> {}}
            onAfterRender={()=> {}}
            onFailure={()=> {}}
          />
        </div>
      </div>
    </div>

  );
}
export default App;

