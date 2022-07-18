import PropTypes from "prop-types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
	getTrackIds,
	useAddTracksToPlaylist,
	useCreatePlaylist,
	useDoesUserFollowPlaylist,
	useFollowPlaylist,
	useGetPlaylist,
	useGetRecommendationsForTracks,
	useGetUser,
} from "../spotify";
import { catchErrors } from "../utils";

import TrackItem from "./TrackItem";

import styled from "styled-components/macro";
import { Main, media, mixins, theme } from "../styles";
const { colors } = theme;

const PlaylistHeading = styled.div`
	${mixins.flexBetween};
	${media.tablet`
    flex-direction: column;

  `};
	h2 {
		margin-bottom: 0;
	}
`;
const SaveButton = styled.button`
	${mixins.greenButton};
`;
const OpenButton = styled.a`
	${mixins.button};
`;
const TracksContainer = styled.ul`
	margin-top: 50px;
`;
const PlaylistLink = styled(Link)`
	&:hover,
	&:focus {
		color: ${colors.offGreen};
	}
`;

const Recommendations = () => {
	const { playlistId } = useParams();

	// const [playlist, setPlaylist] = useState(null);
	// const [recommendations, setRecommmendations] = useState(null);
	const [recPlaylistId, setRecPlaylistId] = useState(null);
	// const [userId, setUserId] = useState(null);
	// const [isFollowing, setIsFollowing] = useState(false);
	const [isFollowPlaylistMutationSucc, setIsFollowPlaylistMutationSucc] =
		useState(false);

	const getPlaylistQuery = useGetPlaylist(playlistId);

	const getUserQuery = useGetUser();

	const seed_artists = "";
	const seed_genres = "";

	const seed_tracks = useMemo(() => {
		// if (getPlaylistQuery.data?.tracks?.items) {
		// let shuffledTracks = [];
		// shuffledTracks = getPlaylistQuery.data?.tracks?.items?.sort(
		// 	() => 0.5 - Math.random()
		// );
		// if (shuffledTracks) {
		if (getPlaylistQuery.data?.tracks?.items) {
			return getTrackIds(getPlaylistQuery.data?.tracks?.items?.slice(0, 5));
			// setSeed_tracks(getTrackIds(shuffledTracks?.slice(0, 5)));
		}
		// }
	}, [getPlaylistQuery.data?.tracks?.items]);

	const getRecommendationsForTracksQuery = useGetRecommendationsForTracks(
		{ seed_tracks, seed_artists, seed_genres },
		getPlaylistQuery.data
	);

	const [shouldAddTracksAndFollow, setShouldAddTracksAndFollow] =
		useState(false);

	// If recPlaylistId has been set, add tracks to playlist and follow
	const addTracksToPlaylistMutation = useAddTracksToPlaylist();
	const { mutateAsync: addTracksToPlaylistMutationMutateAsync } =
		addTracksToPlaylistMutation;
	const followPlaylistMutation = useFollowPlaylist();
	const { mutateAsync: followPlaylistMutationMutateAsync } =
		followPlaylistMutation;

	const doesUserFollowPlaylistQuery = useDoesUserFollowPlaylist(
		recPlaylistId,
		getUserQuery.data?.id,
		isFollowPlaylistMutationSucc
	);

	const uris = getRecommendationsForTracksQuery.data?.tracks
		.map(({ uri }) => uri)
		.join(",");

	// const isUserFollowingPlaylist = async (plistId) => {
	// 	const { data } = await doesUserFollowPlaylist(
	// 		plistId,
	// 		getUserQuery.data?.id
	// 	);
	// 	setIsFollowing(data[0]);
	// };

	const addTracksAndFollow = useCallback(async () => {
		const data = await addTracksToPlaylistMutationMutateAsync({
			playlistId: recPlaylistId,
			uris,
		});

		// Then follow playlist
		if (data) {
			await followPlaylistMutationMutateAsync({ playlistId: recPlaylistId });
			setIsFollowPlaylistMutationSucc(true);
			setShouldAddTracksAndFollow(false);
			// Check if user is following so we can change the save to spotify button to open on spotify
			// catchErrors(isUserFollowingPlaylist(recPlaylistId));
		}
	}, [
		addTracksToPlaylistMutationMutateAsync,
		followPlaylistMutationMutateAsync,
		recPlaylistId,
		uris,
	]);

	// const addTracksAndFollow = async () => {
	// 	// if (!getRecommendationsForTracksQuery.data) {
	// 	// 	return;
	// 	// }

	// 	// const { data } = await addTracksToPlaylist(recPlaylistId, uris);
	// 	const data = await addTracksToPlaylistMutationMutateAsync({
	// 		playlistId: recPlaylistId,
	// 		uris,
	// 	});

	// 	// Then follow playlist
	// 	if (data) {
	// 		// await followPlaylist(recPlaylistId);
	// 		await followPlaylistMutationMutateAsync({ playlistId: recPlaylistId });
	// 		setIsFollowPlaylistMutationSucc(true);
	// 		setShouldAddTracksAndFollow(false);
	// 		// Check if user is following so we can change the save to spotify button to open on spotify
	// 		// catchErrors(isUserFollowingPlaylist(recPlaylistId));
	// 	}
	// };

	useEffect(() => {
		if (shouldAddTracksAndFollow) {
			catchErrors(addTracksAndFollow(recPlaylistId));
		}
	}, [addTracksAndFollow, recPlaylistId, shouldAddTracksAndFollow]);

	useMemo(() => {
		if (
			recPlaylistId &&
			getRecommendationsForTracksQuery.data &&
			getUserQuery.data?.id
		) {
			setShouldAddTracksAndFollow(true);
			// catchErrors(addTracksAndFollow(recPlaylistId));
		}
	}, [
		getRecommendationsForTracksQuery.data,
		getUserQuery.data?.id,
		recPlaylistId,
	]);

	const createPlaylistMutation = useCreatePlaylist();

	const createPlaylistOnSave = async () => {
		if (!getUserQuery.data.id) {
			return;
		}

		const name = `Recommended Tracks Based on ${getPlaylistQuery.data.name}`;
		// const { data } = await createPlaylist(getUserQuery.data?.id, name);
		const data = await createPlaylistMutation.mutateAsync({
			userId: getUserQuery.data?.id,
			name,
		});
		setRecPlaylistId(data?.id);
	};

	return (
		<Main>
			{getPlaylistQuery.data && (
				<PlaylistHeading>
					<h2>
						Recommended Tracks Based On{" "}
						<PlaylistLink to={`playlists/${getPlaylistQuery.data.id}`}>
							{getPlaylistQuery.data.name}
						</PlaylistLink>
					</h2>
					{/* {isFollowing && */}
					{doesUserFollowPlaylistQuery.data &&
					doesUserFollowPlaylistQuery.data[0] &&
					recPlaylistId ? (
						<OpenButton
							href={`https://open.spotify.com/playlist/${recPlaylistId}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							Open in Spotify
						</OpenButton>
					) : (
						<SaveButton onClick={catchErrors(createPlaylistOnSave)}>
							Save to Spotify
						</SaveButton>
					)}
				</PlaylistHeading>
			)}
			<TracksContainer>
				{getRecommendationsForTracksQuery.data &&
					getRecommendationsForTracksQuery.data.tracks.map((track, i) => (
						<TrackItem track={track} key={i} />
					))}
			</TracksContainer>
		</Main>
	);
};

Recommendations.propTypes = {
	playlistId: PropTypes.string,
};

export default Recommendations;
