import PropTypes from "prop-types";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { useGetAudioFeaturesForTracks, useGetPlaylist } from "../spotify";

import FeatureChart from "./FeatureChart";
import Loader from "./Loader";
import TrackItem from "./TrackItem";

import styled from "styled-components/macro";
import { Main, media, mixins, theme } from "../styles";
const { colors, fontSizes, spacing } = theme;

const PlaylistContainer = styled.div`
	display: flex;
	${media.tablet`
    display: block;
  `};
`;
const Left = styled.div`
	width: 30%;
	text-align: center;
	min-width: 200px;
	${media.tablet`
    width: 100%;
    min-width: auto;
  `};
`;
const Right = styled.div`
	flex-grow: 1;
	margin-left: 50px;
	${media.tablet`
    margin: 50px 0 0;
  `};
`;
const PlaylistCover = styled.div`
	${mixins.coverShadow};
	width: 100%;
	max-width: 300px;
	margin: 0 auto;
	${media.tablet`
    display: none;
  `};
`;
const Name = styled.h3`
	font-weight: 700;
	font-size: ${fontSizes.xl};
	margin-top: 20px;
`;
const Description = styled.p`
	font-size: ${fontSizes.sm};
	color: ${colors.lightGrey};
	a {
		color: ${colors.white};
		border-bottom: 1px solid transparent;
		&:hover,
		&:focus {
			border-bottom: 1px solid ${colors.white};
		}
	}
`;
const RecButton = styled(Link)`
	${mixins.greenButton};
	margin-bottom: ${spacing.lg};
`;
const Owner = styled.p`
	font-size: ${fontSizes.sm};
	color: ${colors.lightGrey};
`;
const TotalTracks = styled.p`
	font-size: ${fontSizes.sm};
	color: ${colors.white};
	margin-top: 20px;
`;

const Playlist = () => {
	const { playlistId } = useParams();

	const getPlaylistQuery = useGetPlaylist(playlistId);

	const getAudioFeaturesForTracksQuery = useGetAudioFeaturesForTracks(
		getPlaylistQuery.data?.tracks?.items,
		getPlaylistQuery.data
	);

	return (
		<React.Fragment>
			{getPlaylistQuery.data ? (
				<Main>
					<PlaylistContainer>
						<Left>
							{getPlaylistQuery.data.images.length && (
								<PlaylistCover>
									<img
										src={getPlaylistQuery.data.images[0].url}
										alt="Album Art"
									/>
								</PlaylistCover>
							)}

							<a
								href={getPlaylistQuery.data.external_urls.spotify}
								target="_blank"
								rel="noopener noreferrer"
							>
								<Name>{getPlaylistQuery.data.name}</Name>
							</a>

							<Owner>By {getPlaylistQuery.data.owner.display_name}</Owner>

							{getPlaylistQuery.data.description && (
								<Description
									dangerouslySetInnerHTML={{
										__html: getPlaylistQuery.data.description,
									}}
								/>
							)}

							<TotalTracks>
								{getPlaylistQuery.data.tracks.total} Tracks
							</TotalTracks>

							<RecButton to={`/recommendations/${getPlaylistQuery.data.id}`}>
								Get Recommendations
							</RecButton>

							{getAudioFeaturesForTracksQuery.data && (
								<FeatureChart
									features={getAudioFeaturesForTracksQuery.data.audio_features}
									// type="horizontalBar"
									indexAxis="y"
								/>
							)}
						</Left>
						<Right>
							<ul>
								{getPlaylistQuery.data.tracks &&
									getPlaylistQuery.data.tracks.items.map(({ track }, i) => (
										<TrackItem track={track} key={i} />
									))}
							</ul>
						</Right>
					</PlaylistContainer>
				</Main>
			) : (
				<Loader />
			)}
		</React.Fragment>
	);
};

Playlist.propTypes = {
	playlistId: PropTypes.string,
};

export default Playlist;
