# Spotify Profile

> A web app for visualizing personalized Spotify data

This project was forked from [Spotify Profile by Brittany Chiang](https://github.com/bchiang7/spotify-profile).

Changes from the original fork:

- Moved from Reach Router to React Router
- Updated dependencies to latest versions
- Rewrote deprecated code
- Moved server state management to React Query

Built with a bunch of things, but to name a few:

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [Create React App](https://github.com/facebook/create-react-app)
- [Express](https://expressjs.com/)
- [React Router](https://reactrouter.com/en/main)
- [Styled Components](https://www.styled-components.com/)

## Setup

1. [Register a Spotify App](https://developer.spotify.com/dashboard/applications) and add `http://localhost:8888/callback` as a Redirect URI in the app settings
1. Create an `.env` file in the root of the project based on `.env.example`
1. `nvm use`
1. `npm install && npm run client:install`
1. `npm run dev`

## Deploying to Heroku

1. Create new heroku app

   ```bash
   heroku create app-name
   ```

2. Set Heroku environment variables

   ```bash
   heroku config:set CLIENT_ID=XXXXX
   heroku config:set CLIENT_SECRET=XXXXX
   heroku config:set REDIRECT_URI=https://app-name.herokuapp.com/callback
   heroku config:set FRONTEND_URI=https://app-name.herokuapp.com
   ```

3. Push to Heroku

   ```bash
   git push heroku master
   ```

4. Add `http://app-name.herokuapp.com/callback` as a Redirect URI in the spotify application settings

5. Once the app is live on Heroku, hitting http://app-name.herokuapp.com/login should be the same as hitting http://localhost:8888/login
