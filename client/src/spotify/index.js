import axios from "axios";
import { getHashParams } from "../utils";

// TOKENS ******************************************************************************************
const EXPIRATION_TIME = 3600 * 1000; // 3600 seconds * 1000 = 1 hour in milliseconds

const setTokenTimestamp = () =>
	window.localStorage.setItem("spotify_token_timestamp", Date.now());
const setLocalAccessToken = (token) => {
	setTokenTimestamp();
	window.localStorage.setItem("spotify_access_token", token);
};
const setLocalRefreshToken = (token) =>
	window.localStorage.setItem("spotify_refresh_token", token);
const getTokenTimestamp = () =>
	window.localStorage.getItem("spotify_token_timestamp");
const getLocalAccessToken = () =>
	window.localStorage.getItem("spotify_access_token");
const getLocalRefreshToken = () =>
	window.localStorage.getItem("spotify_refresh_token");

const axiosClient = axios.create({
	// baseURL: process.env.REACT_APP_DOMAIN,
	// withCredentials: true,
	headers: {
		// Authorization: `Bearer ${token}`,
		"Content-Type": "application/json",
	},
});

// Refresh the token
const refreshAccessToken = async () => {
	try {
		const { data } = await axiosClient.get(
			`/refresh_token?refresh_token=${getLocalRefreshToken()}`
		);
		const { access_token } = data;
		setLocalAccessToken(access_token);
		window.location.reload();
		return;
	} catch (e) {
		console.error(e);
	}
};

// Get access token off of query params (called on application init)
export const getAccessToken = () => {
	const { error, access_token, refresh_token } = getHashParams();

	if (error) {
		console.error(error);
		refreshAccessToken();
	}

	// If token has expired
	if (Date.now() - getTokenTimestamp() > EXPIRATION_TIME) {
		console.warn("Access token has expired, refreshing...");
		refreshAccessToken();
	}

	const localAccessToken = getLocalAccessToken();

	// If there is no ACCESS token in local storage, set it and return `access_token` from params
	if ((!localAccessToken || localAccessToken === "undefined") && access_token) {
		setLocalAccessToken(access_token);
		setLocalRefreshToken(refresh_token);
		return access_token;
	}

	return localAccessToken;
};

export const token = getAccessToken();

export const logout = () => {
	window.localStorage.removeItem("spotify_token_timestamp");
	window.localStorage.removeItem("spotify_access_token");
	window.localStorage.removeItem("spotify_refresh_token");
	window.location.reload();
};

// API CALLS ***************************************************************************************

// const headers = {
// 	Authorization: `Bearer ${token}`,
// };
axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

/**
 * Get Current User's Profile
 * https://developer.spotify.com/documentation/web-api/reference/users-profile/get-current-users-profile/
 */
export const getUser = () => axiosClient.get("https://api.spotify.com/v1/me");

/**
 * Get User's Followed Artists
 * https://developer.spotify.com/documentation/web-api/reference/follow/get-followed/
 */
export const getFollowing = () =>
	axiosClient.get("https://api.spotify.com/v1/me/following?type=artist");

/**
 * Get Current User's Recently Played Tracks
 * https://developer.spotify.com/documentation/web-api/reference/player/get-recently-played/
 */
export const getRecentlyPlayed = () =>
	axiosClient.get("https://api.spotify.com/v1/me/player/recently-played");

/**
 * Get a List of Current User's Playlists
 * https://developer.spotify.com/documentation/web-api/reference/playlists/get-a-list-of-current-users-playlists/
 */
export const getPlaylists = () =>
	axiosClient.get("https://api.spotify.com/v1/me/playlists");

/**
 * Get a User's Top Artists
 * https://developer.spotify.com/documentation/web-api/reference/personalization/get-users-top-artists-and-tracks/
 */
export const getTopArtistsShort = () =>
	axiosClient.get(
		"https://api.spotify.com/v1/me/top/artists?limit=50&time_range=short_term"
	);
export const getTopArtistsMedium = () =>
	axiosClient.get(
		"https://api.spotify.com/v1/me/top/artists?limit=50&time_range=medium_term"
	);
export const getTopArtistsLong = () =>
	axiosClient.get(
		"https://api.spotify.com/v1/me/top/artists?limit=50&time_range=long_term"
	);

/**
 * Get a User's Top Tracks
 * https://developer.spotify.com/documentation/web-api/reference/personalization/get-users-top-artists-and-tracks/
 */
export const getTopTracksShort = () =>
	axiosClient.get(
		"https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=short_term"
	);
export const getTopTracksMedium = () =>
	axiosClient.get(
		"https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=medium_term"
	);
export const getTopTracksLong = () =>
	axiosClient.get(
		"https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=long_term"
	);

/**
 * Get an Artist
 * https://developer.spotify.com/documentation/web-api/reference/artists/get-artist/
 */
export const getArtist = (artistId) =>
	axiosClient.get(`https://api.spotify.com/v1/artists/${artistId}`);

/**
 * Follow an Artist
 * https://developer.spotify.com/documentation/web-api/reference/follow/follow-artists-users/
 */
export const followArtist = (artistId) => {
	const url = `https://api.spotify.com/v1/me/following?type=artist&ids=${artistId}`;
	return axiosClient.put(url);
};

/**
 * Check if Current User Follows Artists
 * https://developer.spotify.com/documentation/web-api/reference/follow/follow-artists-users/
 */
export const doesUserFollowArtist = (artistId) =>
	axiosClient.get(
		`https://api.spotify.com/v1/me/following/contains?type=artist&ids=${artistId}`
	);

/**
 * Check if Users Follow a Playlist
 * https://developer.spotify.com/documentation/web-api/reference/follow/follow-artists-users/
 */
export const doesUserFollowPlaylist = (playlistId, userId) =>
	axiosClient.get(
		`https://api.spotify.com/v1/playlists/${playlistId}/followers/contains?ids=${userId}`
	);

/**
 * Create a Playlist (The playlist will be empty until you add tracks)
 * https://developer.spotify.com/documentation/web-api/reference/playlists/create-playlist/
 */
export const createPlaylist = (userId, name) => {
	const url = `https://api.spotify.com/v1/users/${userId}/playlists`;
	const data = JSON.stringify({ name });
	return axiosClient.post(url, data);
};

/**
 * Add Tracks to a Playlist
 * https://developer.spotify.com/documentation/web-api/reference/playlists/add-tracks-to-playlist/
 */
export const addTracksToPlaylist = (playlistId, uris) => {
	const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${uris}`;
	return axiosClient.post(url);
};

/**
 * Follow a Playlist
 * https://developer.spotify.com/documentation/web-api/reference/follow/follow-playlist/
 */
export const followPlaylist = (playlistId) => {
	const url = `https://api.spotify.com/v1/playlists/${playlistId}/followers`;
	return axiosClient.put(url);
};

/**
 * Get a Playlist
 * https://developer.spotify.com/documentation/web-api/reference/playlists/get-playlist/
 */
export const getPlaylist = (playlistId) =>
	axiosClient.get(`https://api.spotify.com/v1/playlists/${playlistId}`);

/**
 * Get a Playlist's Tracks
 * https://developer.spotify.com/documentation/web-api/reference/playlists/get-playlists-tracks/
 */
export const getPlaylistTracks = (playlistId) =>
	axiosClient.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`);

/**
 * Return a comma separated string of track IDs from the given array of tracks
 */
const getTrackIds = (tracks) => tracks.map(({ track }) => track.id).join(",");

/**
 * Get Audio Features for Several Tracks
 * https://developer.spotify.com/documentation/web-api/reference/tracks/get-several-audio-features/
 */
export const getAudioFeaturesForTracks = (tracks) => {
	const ids = getTrackIds(tracks);
	return axiosClient.get(
		`https://api.spotify.com/v1/audio-features?ids=${ids}`
	);
};

/**
 * Get Recommendations Based on Seeds
 * https://developer.spotify.com/documentation/web-api/reference/browse/get-recommendations/
 */
export const getRecommendationsForTracks = (tracks) => {
	const shuffledTracks = tracks.sort(() => 0.5 - Math.random());
	const seed_tracks = getTrackIds(shuffledTracks.slice(0, 5));
	const seed_artists = "";
	const seed_genres = "";

	return axiosClient.get(
		`https://api.spotify.com/v1/recommendations?seed_tracks=${seed_tracks}&seed_artists=${seed_artists}&seed_genres=${seed_genres}`
	);
};

/**
 * Get a Track
 * https://developer.spotify.com/documentation/web-api/reference/tracks/get-track/
 */
export const getTrack = (trackId) =>
	axiosClient.get(`https://api.spotify.com/v1/tracks/${trackId}`);

/**
 * Get Audio Analysis for a Track
 * https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-analysis/
 */
export const getTrackAudioAnalysis = (trackId) =>
	axiosClient.get(`https://api.spotify.com/v1/audio-analysis/${trackId}`);

/**
 * Get Audio Features for a Track
 * https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-features/
 */
export const getTrackAudioFeatures = (trackId) =>
	axiosClient.get(`https://api.spotify.com/v1/audio-features/${trackId}`);

export const getUserInfo = () =>
	Promise.all([
		getUser(),
		getFollowing(),
		getPlaylists(),
		getTopArtistsLong(),
		getTopTracksLong(),
	]).then(([user, followedArtists, playlists, topArtists, topTracks]) => ({
		user: user.data,
		followedArtists: followedArtists.data,
		playlists: playlists.data,
		topArtists: topArtists.data,
		topTracks: topTracks.data,
	}));

export const getTrackInfo = (trackId) =>
	Promise.all([
		getTrack(trackId),
		getTrackAudioAnalysis(trackId),
		getTrackAudioFeatures(trackId),
	]).then(([track, audioAnalysis, audioFeatures]) => ({
		track: track.data,
		audioAnalysis: audioAnalysis.data,
		audioFeatures: audioFeatures.data,
	}));
