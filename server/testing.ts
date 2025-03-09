// require('dotenv').config();
// const helmet = require('helmet');
// const express = require('express');
// const mongoose = require('mongoose');
// const { MongoClient } = require('mongodb');
// const request = require('request');
// const cors = require('cors');
// const expressfileupload = require('express-fileupload');
// const bodyParser = require('body-parser');
// const https = require('https');
// const path = require('path');
// const fs = require('fs');
// const passport = require('passport');
// const { Strategy } = require('passport-google-oauth20');

// import googleOauthRouter from './routes/authentications/oauth2.0/google_oauth2.0.router';
// import authenticationRouter from './routes/authentications/authentications.router';
// import otpVerificationRouter from './routes/authentications/otp_verifications/otp_veifications.router';
// import chatRouter from './routes/chats/chats.router';
// import eventsAttendRouter from './routes/events/event_attendees/event_attendees.router';
// import eventsRouter from './routes/events/events.router';
// import groupMembersRouter from './routes/groups/group_members/group_members.router';
// import groupsRouter from './routes/groups/groups.router';
// import ideasRouter from './routes/ideas/ideas.router';
// import messageRouter from './routes/messages/messages.router';
// import notificationRouter from './routes/notifications/notifications.router';
// import hiddenPostsRouter from './routes/posts/hidden_posts/hidden_posts.router';
// import postCommentsRouter from './routes/posts/post_comments/post_comments.router';
// import postLikesRouter from './routes/posts/post_likes/post_likes.router';
// import postSharesRouter from './routes/posts/post_shares/post_shares.router';
// import postRouter from './routes/posts/posts.router';
// import skillsRouter from './routes/skills/skills.router';
// import staticAssetsRouter from './routes/static_assets/static_assets.router';
// import universitiesRouter from './routes/universities/universities.router';
// import connectionsRouter from './routes/users/connections/connections.router';
// import userBookmarksRouter from './routes/users/user_bookmarks/user_bookmarks.router';
// import userEducationsRouter from './routes/users/user_educations/user_educations.router';
// import userSkillsRouter from './routes/users/user_skills/user_skills.router';
// import userInfoRouter from './routes/users/user_info.router';

// const fileUpload = require('express-fileupload');
// import axios from 'axios';

// import sequelize from './services/postgresql.database';
// import connectMongoDB from './services/mongodb.database';
// import setupAssociations from './models/postgresql_models/postgresqlAssociations';

// const AUTH_OPTIONS = {
//   callbackUrl: 'https://localhost:8000/auth/google/callback',
//   clientID: process.env.CLIENT_ID,
//   clientSecret: process.env.CLIENT_SECRET,
// };

// function verifyCallback(accessToken: string, refreshToken: string, profile: any, done: any) {
//   console.log('accessToken', accessToken);
//   console.log('refreshToken', refreshToken);
//   console.log('profile', profile);
//   done(null, profile);
// }
// passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

// const app = express();

// app.use(helmet());

// app.use(passport.initialize());

// connectMongoDB();
// sequelize
//   .sync({ alter: true })
//   .then(() => console.log('✅ PostgreSQL Synchronized'))
//   .catch((error) => console.error('❌ PostgreSQL Sync Error:', error));

// setupAssociations();

// const corsOptions = {
//   origin: 'http://localhost:3000',
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true,
//   allowedHeaders: 'Content-Type,Authorization',
// };

// // app.use(cors(corsOptions));
// app.use(bodyParser.urlencoded({ extended: true, parameterLimit: 100000000, limit: '500mb' }));
// app.use(bodyParser.json());

// app.post(
//   '/auth/google/token',
//   passport.authenticate('google-id-token', { session: false }),
//   (req, res) => {
//     console.log('came to /auth/google/token');
//     const user = req.user;
//     const token = jwt.sign({ userId: user.googleId, email: user.email }, process.env.JWT_SECRET, {
//       expiresIn: '1h',
//     });
//     res.json({ success: true, jwt_token: token, user });
//   }
// );

// app.get(
//   '/auth/google',
//   passport.authenticate('google', {
//     scope: ['email'],
//   }),
//   (req, res) => {
//     console.log('Google redirected us to the app!');
//   }
// );

// app.get(
//   '/auth/google/callback',
//   passport.authenticate('google', {
//     // failureRedirect: '/failure',
//     // successRedirect: '/',
//     session: true,
//   }),
//   (req, res) => {
//     console.log('Google called us back!');
//   }
// );

// app.use('/', googleOauthRouter);
// app.use('/', authenticationRouter);
// app.use('/', otpVerificationRouter);
// app.use('/', chatRouter);
// app.use('/', eventsAttendRouter);
// app.use('/', eventsRouter);
// app.use('/', groupMembersRouter);
// app.use('/', groupsRouter);
// app.use('/', ideasRouter);
// app.use('/', messageRouter);
// app.use('/', notificationRouter);
// app.use('/', hiddenPostsRouter);
// app.use('/', postCommentsRouter);
// app.use('/', postLikesRouter);
// app.use('/', postSharesRouter);
// app.use('/', postRouter);
// app.use('/', skillsRouter);
// app.use('/', staticAssetsRouter);
// app.use('/', universitiesRouter);
// app.use('/', connectionsRouter);
// app.use('/', userBookmarksRouter);
// app.use('/', userEducationsRouter);
// app.use('/', userSkillsRouter);
// app.use('/', userInfoRouter);

// const PORT = process.env.PORT || 8000;

// https
//   .createServer(
//     {
//       key: fs.readFileSync(path.join(__dirname, 'certs', 'key.pem')),
//       cert: fs.readFileSync(path.join(__dirname, 'certs', 'cert.pem')),
//     },
//     app
//   )
//   .listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));


import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import { Redirect, Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { isEmail } from 'validator';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import './index.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSubmitError, setShowSubmitError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const history = useHistory();
  const renderCount = useRef(0);
  renderCount.current += 1;
  useEffect(() => {
    console.log(`Component rendered: ${renderCount.current} times`);
  });
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    console.log('google code', code);
    if (code) {
      handleGoogleAuth(code);
    }
    const jwtToken = Cookies.get('jwt_token');
    if (jwtToken !== undefined) {
      <Redirect to="/" />;
    }
  }, []);
  const handleGoogleAuth = async (authorizationCode) => {
    const requestBody = {
      code: authorizationCode,
      use: 'login',
    };
    try {
      const response = await fetch('https://localhost:8000/oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      console.log('data', response);
      localStorage.setItem('response', response);
      if (data.success) {
        handleSubmitSuccess(data.jwt_token, data.user_id, data.message);
        data.to === 'home' ? history.push('/') : history.push('/info');
      } else {
        setErrorMsg('Error during Google signup');
        setShowSubmitError(true);
      }
    } catch (error) {
      console.error('Error during Google signup:', error);
      setErrorMsg('Error during Google signup');
      setShowSubmitError(true);
    }
  };
  const handleForgotPasswordClick = () => {
    history.push('/forgotpassword');
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const handleSubmitSuccess = (jwtToken, userId, message) => {
    console.log(jwtToken, userId, message);
    Cookies.set('jwt_token', jwtToken, { expires: 30, path: '/' });
    Cookies.set('user_id', userId, { expires: 30, path: '/' });
    history.push('/');
  };
  const handleSubmitFailure = (errorMsg) => {
    console.error(errorMsg);
    setShowSubmitError(true);
    setErrorMsg(errorMsg);
  };
  const navigate = (url) => {
    window.location.href = url;
  };
  const handleGoogleLogin = async () => {
    setErrorMsg('');
    const body = { use: 'login' };
    try {
      const response = await fetch('https://localhost:8000/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      navigate(data.url);
    } catch (err) {
      console.log('error in redirecting google url');
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isEmail(email)) {
      setErrorMsg('Please enter a valid email address.');
      setShowSubmitError(true);
      return;
    }
    const userDetails = { email, password };
    const url = 'https://localhost:8000/login';
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userDetails),
    };
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok) {
        handleSubmitSuccess(data.jwtToken, data.userId, data.message);
      } else {
        handleSubmitFailure(data.message);
      }
    } catch (error) {
      const submitFailureError = `Login error: ${error}`;
      console.error(submitFailureError);
      handleSubmitFailure(submitFailureError);
    }
  };
  const renderPasswordField = () => (
    <>
      <label className="login-input-label" htmlFor="password">
        PASSWORD
      </label>
      <input
        type="password"
        id="password"
        className="login-password-input-field"
        value={password}
        onChange={handlePasswordChange}
        placeholder="Password"
      />
    </>
  );
  const renderEmailField = () => (
    <>
      <label className="login-input-label" htmlFor="email">
        EMAIL
      </label>
      <input
        type="text"
        id="email"
        className="login-email-input-field"
        value={email}
        onChange={handleEmailChange}
        placeholder="Email"
      />
    </>
  );
  return (
    <div className="login-form-main-container">
      <img
        src="https://entinno-predefined-content.s3.ap-northeast-1.amazonaws.com/Entinno+Logo.jpeg"
        className="login-image"
        alt="website login"
      />
      <div className="login-form-google-login-container">
        <form className="login-form-container" onSubmit={handleSubmit}>
          <h1 className="login-form-heading">Login to Entinno</h1>
          <div className="login-input-container">{renderEmailField()}</div>
          <div className="login-input-container">{renderPasswordField()}</div>
          <h1 onClick={handleForgotPasswordClick} className="login-forgot-password-heading">
            Forgot Password?
          </h1>
          <button type="submit" className="login-button">
            Login
          </button>
          {showSubmitError && <p className="login-error-message">{`*${errorMsg}`}</p>}
          <Link className="login-signup-link" to="/signup">
            New To Entinno? Sign Up
          </Link>
        </form>
        <div className="login-google-container">
          <button onClick={handleGoogleLogin} className="login-google-signin-button">
            <div className="login-google-sigin-container">
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                className="login-google-image"
              />
              <span className="login-google-signin-text">Sign in with Google</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
export default LoginForm;
