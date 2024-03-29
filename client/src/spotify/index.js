import axios from "axios";
import { useMutation, useQuery } from "react-query";
import appConstants from "../appConstants";
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

const axiosSpotifyClient = axios.create({
	baseURL: appConstants.spotify.api.url,
	headers: {
		// Authorization: `Bearer ${token}`,
		"Content-Type": "application/json",
	},
});

// Refresh the token
const refreshAccessToken = async () => {
	try {
		const { data } = await axios.get(
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
axiosSpotifyClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

/**
 * Get Current User's Profile
 * https://developer.spotify.com/documentation/web-api/reference/users-profile/get-current-users-profile/
 */
export const getUser = () => axiosSpotifyClient.get("me");

export function useGetUser() {
	return useQuery(["user"], async () => {
		return getUser().then((res) => res.data);
	});
}

/**
 * Get User's Followed Artists
 * https://developer.spotify.com/documentation/web-api/reference/follow/get-followed/
 */
export const getFollowing = () =>
	axiosSpotifyClient.get("me/following?type=artist");

export function useGetFollowing() {
	return useQuery(["following"], async () => {
		return getFollowing().then((res) => res.data);
	});
}

/**
 * Get Current User's Recently Played Tracks
 * https://developer.spotify.com/documentation/web-api/reference/player/get-recently-played/
 */
export const getRecentlyPlayed = () =>
	axiosSpotifyClient.get("me/player/recently-played");

export function useGetRecentlyPlayed() {
	return useQuery(["RecentlyPlayed"], async () => {
		return getRecentlyPlayed().then((res) => res.data);
	});
}

/**
 * Get a List of Current User's Playlists
 * https://developer.spotify.com/documentation/web-api/reference/playlists/get-a-list-of-current-users-playlists/
 */
export const getPlaylists = () => axiosSpotifyClient.get("me/playlists");

export function useGetPlaylists() {
	return useQuery(["Playlists"], async () => {
		return getPlaylists().then((res) => res.data);
	});
}

/**
 * Get a User's Top Artists
 * https://developer.spotify.com/documentation/web-api/reference/personalization/get-users-top-artists-and-tracks/
 */
export const getTopArtists = (range) =>
	axiosSpotifyClient.get(`me/top/artists?limit=50&time_range=${range}_term`);

export function useGetTopArtists(range) {
	return useQuery(["TopArtists", range], async () => {
		return getTopArtists(range).then((res) => res.data);
	});
}

// export const getTopArtistsShort = () =>
// 	axiosSpotifyClient.get("me/top/artists?limit=50&time_range=short_term");

// export function useGetTopArtistsShort() {
// 	return useQuery(["TopArtistsShort"], async () => {
// 		return getTopArtistsShort().then((res) => res.data);
// 	});
// }

// export const getTopArtistsMedium = () =>
// 	axiosSpotifyClient.get("me/top/artists?limit=50&time_range=medium_term");

// export function useGetTopArtistsMedium() {
// 	return useQuery(["TopArtistsMedium"], async () => {
// 		return getTopArtistsMedium().then((res) => res.data);
// 	});
// }

export const getTopArtistsLong = () =>
	axiosSpotifyClient.get("me/top/artists?limit=50&time_range=long_term");

export function useGetTopArtistsLong() {
	return useQuery(["TopArtistsLong"], async () => {
		return getTopArtistsLong().then((res) => res.data);
	});
}

/**
 * Get a User's Top Tracks
 * https://developer.spotify.com/documentation/web-api/reference/personalization/get-users-top-artists-and-tracks/
 */
export const getTopTracks = (range = "short") =>
	axiosSpotifyClient.get(`me/top/tracks?limit=50&time_range=${range}_term`);

export function useGetTopTracks(range = "short") {
	return useQuery(["TopTracks", range], async () => {
		return getTopTracks(range).then((res) => res.data);
	});
}

/**
 * Get an Artist
 * https://developer.spotify.com/documentation/web-api/reference/artists/get-artist/
 */
export const getArtist = (artistId) =>
	axiosSpotifyClient.get(`artists/${artistId}`);

export function useGetArtist(artistId) {
	return useQuery(["Artist", artistId], async () => {
		return getArtist(artistId).then((res) => res.data);
	});
}

/**
 * Follow an Artist
 * https://developer.spotify.com/documentation/web-api/reference/follow/follow-artists-users/
 */
export const followArtist = (artistId) => {
	const url = `me/following?type=artist&ids=${artistId}`;
	return axiosSpotifyClient.put(url);
};

export function useFollowArtist(artistId) {
	return useMutation(["followArtist", artistId], async () => {
		return followArtist(artistId).then((res) => res.data);
	});
}

/**
 * Check if Current User Follows Artists
 * https://developer.spotify.com/documentation/web-api/reference/follow/follow-artists-users/
 */
export const doesUserFollowArtist = (artistId) =>
	axiosSpotifyClient.get(`me/following/contains?type=artist&ids=${artistId}`);

export function useDoesUserFollowArtist(artistId) {
	return useQuery(["doesUserFollowArtist", artistId], async () => {
		return doesUserFollowArtist(artistId).then((res) => res.data);
	});
}

/**
 * Check if Users Follow a Playlist
 * https://developer.spotify.com/documentation/web-api/reference/follow/follow-artists-users/
 */
export const doesUserFollowPlaylist = (playlistId, userId) =>
	axiosSpotifyClient.get(
		`playlists/${playlistId}/followers/contains?ids=${userId}`
	);

export function useDoesUserFollowPlaylist(playlistId, userId, enabled) {
	return useQuery(
		["doesUserFollowPlaylist", playlistId, userId, enabled],
		async () => {
			return doesUserFollowPlaylist(playlistId, userId).then((res) => res.data);
		},
		{
			enabled: !!enabled,
		}
	);
}

/**
 * Create a Playlist (The playlist will be empty until you add tracks)
 * https://developer.spotify.com/documentation/web-api/reference/playlists/create-playlist/
 */
export const createPlaylist = (userId, name) => {
	const url = `users/${userId}/playlists`;
	const data = JSON.stringify({ name });
	return axiosSpotifyClient.post(url, data);
};

export function useCreatePlaylist() {
	return useMutation(["createPlaylist"], async ({ userId, name }) => {
		return createPlaylist(userId, name).then((res) => res.data);
	});
}

/**
 * Add Tracks to a Playlist
 * https://developer.spotify.com/documentation/web-api/reference/playlists/add-tracks-to-playlist/
 */
export const addTracksToPlaylist = (playlistId, uris) => {
	const url = `playlists/${playlistId}/tracks?uris=${uris}`;
	return axiosSpotifyClient.post(url);
};

export function useAddTracksToPlaylist() {
	return useMutation(["addTracksToPlaylist"], async ({ playlistId, uris }) => {
		return addTracksToPlaylist(playlistId, uris).then((res) => res.data);
	});
}

/**
 * Follow a Playlist
 * https://developer.spotify.com/documentation/web-api/reference/follow/follow-playlist/
 */
export const followPlaylist = (playlistId) => {
	const url = `playlists/${playlistId}/followers`;
	return axiosSpotifyClient.put(url);
};

export function useFollowPlaylist() {
	return useMutation(["useFollowPlaylist"], async ({ playlistId }) => {
		return followPlaylist(playlistId).then((res) => res.data);
	});
}

/**
 * Get a Playlist
 * https://developer.spotify.com/documentation/web-api/reference/playlists/get-playlist/
 */
export const getPlaylist = (playlistId) =>
	axiosSpotifyClient.get(`playlists/${playlistId}`);

export function useGetPlaylist(playlistId) {
	return useQuery(["Playlist", playlistId], async () => {
		return getPlaylist(playlistId).then((res) => res.data);
	});
}

/**
 * Get a Playlist's Tracks
 * https://developer.spotify.com/documentation/web-api/reference/playlists/get-playlists-tracks/
 */
export const getPlaylistTracks = (playlistId) =>
	axiosSpotifyClient.get(`playlists/${playlistId}/tracks`);

export function useGetPlaylistTracks(playlistId) {
	return useQuery(["PlaylistTracks", playlistId], async () => {
		return getPlaylistTracks(playlistId).then((res) => res.data);
	});
}

/**
 * Return a comma separated string of track IDs from the given array of tracks
 */
export const getTrackIds = (tracks) =>
	tracks.map(({ track }) => track.id).join(",");

/**
 * Get Audio Features for Several Tracks
 * https://developer.spotify.com/documentation/web-api/reference/tracks/get-several-audio-features/
 */
export const getAudioFeaturesForTracks = (tracks) => {
	const ids = getTrackIds(tracks);
	return axiosSpotifyClient.get(`audio-features?ids=${ids}`);
};

export function useGetAudioFeaturesForTracks(tracks, enabled) {
	return useQuery(
		["AudioFeaturesForTracks", tracks, enabled],
		async () => {
			return getAudioFeaturesForTracks(tracks).then((res) => res.data);
		},
		{
			// The query will not execute until the userId exists
			enabled: !!enabled,
		}
	);
}

/**
 * Get Recommendations Based on Seeds
 * https://developer.spotify.com/documentation/web-api/reference/browse/get-recommendations/
 */
export const getRecommendationsForTracks = (seeds) => {
	// const shuffledTracks = tracks.sort(() => 0.5 - Math.random());
	// const seed_tracks = getTrackIds(shuffledTracks.slice(0, 5));
	// const seed_artists = "";
	// const seed_genres = "";

	return axiosSpotifyClient.get(
		`recommendations?seed_tracks=${seeds?.seed_tracks}&seed_artists=${seeds?.seed_artists}&seed_genres=${seeds?.seed_genres}`
	);
};

export function useGetRecommendationsForTracks(seeds, enabled) {
	return useQuery(
		["RecommendationsForTracks", seeds, enabled],
		async () => {
			return getRecommendationsForTracks(seeds).then((res) => res.data);
		},
		{
			refetchOnWindowFocus: false,
			enabled: !!enabled,
		}
	);
}

/**
 * Get a Track
 * https://developer.spotify.com/documentation/web-api/reference/tracks/get-track/
 */
export const getTrack = (trackId) =>
	axiosSpotifyClient.get(`tracks/${trackId}`);

export function useGetTrack(trackId) {
	return useQuery(["Track", trackId], async () => {
		return getTrack(trackId).then((res) => res.data);
	});
}

/**
 * Get Audio Analysis for a Track
 * https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-analysis/
 */
export const getTrackAudioAnalysis = (trackId) =>
	axiosSpotifyClient.get(`audio-analysis/${trackId}`);

export function useGetTrackAudioAnalysis(trackId) {
	return useQuery(["TrackAudioAnalysis", trackId], async () => {
		return getTrackAudioAnalysis(trackId).then((res) => res.data);
	});
}

/**
 * Get Audio Features for a Track
 * https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-features/
 */
export const getTrackAudioFeatures = (trackId) =>
	axiosSpotifyClient.get(`audio-features/${trackId}`);

export function useGetTrackAudioFeatures(trackId) {
	return useQuery(["TrackAudioFeatures", trackId], async () => {
		return getTrackAudioFeatures(trackId).then((res) => res.data);
	});
}

export const getUserInfo = async () => {
	const [user, followedArtists, playlists, topArtists, topTracks] =
		await Promise.all([
			getUser(),
			getFollowing(),
			getPlaylists(),
			getTopArtistsLong(),
			getTopTracks("long"),
		]);

	return {
		user: user.data,
		followedArtists: followedArtists.data,
		playlists: playlists.data,
		topArtists: topArtists.data,
		topTracks: topTracks.data,
	};
};

export function useUserInfo() {
	return useQuery(["user-info"], async () => {
		return getUserInfo();
	});
}

export const getTrackInfo = async (trackId) => {
	const [track, audioAnalysis, audioFeatures] = await Promise.all([
		getTrack(trackId),
		getTrackAudioAnalysis(trackId),
		getTrackAudioFeatures(trackId),
	]);

	return {
		track: track.data,
		audioAnalysis: audioAnalysis.data,
		audioFeatures: audioFeatures.data,
	};
};

export function useTrackInfo(trackId) {
	return useQuery(["track-info", trackId], async () => {
		return getTrackInfo(trackId);
	});
}
