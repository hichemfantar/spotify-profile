import PropTypes from "prop-types";
import React from "react";
import { useTrackInfo } from "../spotify";
import { formatDuration, getYear, parsePitchClass } from "../utils";

import FeatureChart from "./FeatureChart";
import Loader from "./Loader";

import { useParams } from "react-router-dom";
import styled from "styled-components/macro";
import { Main, media, mixins, theme } from "../styles";
const { colors, fontSizes } = theme;

const TrackContainer = styled.div`
	display: flex;
	margin-bottom: 70px;
	${media.phablet`
    flex-direction: column;
    align-items: center;
    margin-bottom: 30px;
  `};
`;
const Artwork = styled.div`
	${mixins.coverShadow};
	max-width: 250px;
	margin-right: 40px;
	${media.tablet`
    max-width: 200px;
  `};
	${media.phablet`
    margin: 0 auto;
  `};
`;
const Info = styled.div`
	flex-grow: 1;
	${media.phablet`
    text-align: center;
    margin-top: 30px;
  `};
`;
const PlayTrackButton = styled.a`
	${mixins.greenButton};
`;
const Title = styled.h1`
	font-size: 42px;
	margin: 0 0 5px;
	${media.tablet`
    font-size: 30px;
  `};
`;
const ArtistName = styled.h2`
	color: ${colors.lightestGrey};
	font-weight: 700;
	text-align: left !important;
	${media.tablet`
    font-size: 20px;
  `};
	${media.phablet`
    text-align: center !important;
  `};
`;
const Album = styled.h3`
	color: ${colors.lightGrey};
	font-weight: 400;
	font-size: 16px;
`;
const AudioFeatures = styled.div`
	${mixins.flexCenter};
	flex-direction: column;
`;
const Features = styled.div`
	display: grid;
	grid-template-columns: repeat(5, minmax(100px, 1fr));
	width: 100%;
	margin-bottom: 50px;
	text-align: center;
	border-top: 1px solid ${colors.grey};
	border-left: 1px solid ${colors.grey};
	${media.thone`
    grid-template-columns: repeat(2, minmax(100px, 1fr));
  `};
	${media.phablet`
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  `};
`;
const Feature = styled.div`
	padding: 15px 10px;
	border-bottom: 1px solid ${colors.grey};
	border-right: 1px solid ${colors.grey};
`;
const FeatureText = styled.h4`
	color: ${colors.lightestGrey};
	font-size: 30px;
	font-weight: 700;
	margin-bottom: 0;
	${media.tablet`
    font-size: 24px;
  `};
`;
const FeatureLabel = styled.p`
	color: ${colors.lightestGrey};
	font-size: ${fontSizes.xs};
	margin-bottom: 0;
`;
const DescriptionLink = styled.a`
	color: ${colors.lightestGrey};
	margin: 20px auto 0;
	border-bottom: 1px solid transparent;
	&:hover,
	&:focus {
		color: ${colors.white};
		border-bottom: 1px solid ${colors.white};
	}
`;

const Track = () => {
	const { trackId } = useParams();

	const trackInfoQuery = useTrackInfo(trackId);

	return (
		<React.Fragment>
			{trackInfoQuery.isSuccess && trackInfoQuery.data?.track ? (
				<Main>
					<TrackContainer>
						<Artwork>
							<img
								src={trackInfoQuery.data?.track.album.images[0].url}
								alt="Album Artwork"
							/>
						</Artwork>
						<Info>
							<Title>{trackInfoQuery.data?.track.name}</Title>
							<ArtistName>
								{trackInfoQuery.data?.track.artists &&
									trackInfoQuery.data?.track.artists.map(({ name }, i) => (
										<span key={i}>
											{name}
											{trackInfoQuery.data?.track.artists.length > 0 &&
											i === trackInfoQuery.data?.track.artists.length - 1
												? ""
												: ","}
											&nbsp;
										</span>
									))}
							</ArtistName>
							<Album>
								<a
									href={trackInfoQuery.data?.track.album.external_urls.spotify}
									target="_blank"
									rel="noopener noreferrer"
								>
									{trackInfoQuery.data?.track.album.name}
								</a>{" "}
								&middot;{" "}
								{getYear(trackInfoQuery.data?.track.album.release_date)}
							</Album>
							<PlayTrackButton
								href={trackInfoQuery.data?.track.external_urls.spotify}
								target="_blank"
								rel="noopener noreferrer"
							>
								Play on Spotify
							</PlayTrackButton>
						</Info>
					</TrackContainer>

					{trackInfoQuery.data?.audioFeatures &&
						trackInfoQuery.data?.audioAnalysis && (
							<AudioFeatures>
								<Features>
									<Feature>
										<FeatureText>
											{formatDuration(
												trackInfoQuery.data?.audioFeatures.duration_ms
											)}
										</FeatureText>
										<FeatureLabel>Duration</FeatureLabel>
									</Feature>
									<Feature>
										<FeatureText>
											{parsePitchClass(trackInfoQuery.data?.audioFeatures.key)}
										</FeatureText>
										<FeatureLabel>Key</FeatureLabel>
									</Feature>
									<Feature>
										<FeatureText>
											{trackInfoQuery.data?.audioFeatures.mode === 1
												? "Major"
												: "Minor"}
										</FeatureText>
										<FeatureLabel>Modality</FeatureLabel>
									</Feature>
									<Feature>
										<FeatureText>
											{trackInfoQuery.data?.audioFeatures.time_signature}
										</FeatureText>
										<FeatureLabel>Time Signature</FeatureLabel>
									</Feature>
									<Feature>
										<FeatureText>
											{Math.round(trackInfoQuery.data?.audioFeatures.tempo)}
										</FeatureText>
										<FeatureLabel>Tempo (BPM)</FeatureLabel>
									</Feature>
									<Feature>
										<FeatureText>
											{trackInfoQuery.data?.track.popularity}%
										</FeatureText>
										<FeatureLabel>Popularity</FeatureLabel>
									</Feature>
									<Feature>
										<FeatureText>
											{trackInfoQuery.data?.audioAnalysis.bars.length}
										</FeatureText>
										<FeatureLabel>Bars</FeatureLabel>
									</Feature>
									<Feature>
										<FeatureText>
											{trackInfoQuery.data?.audioAnalysis.beats.length}
										</FeatureText>
										<FeatureLabel>Beats</FeatureLabel>
									</Feature>
									<Feature>
										<FeatureText>
											{trackInfoQuery.data?.audioAnalysis.sections.length}
										</FeatureText>
										<FeatureLabel>Sections</FeatureLabel>
									</Feature>
									<Feature>
										<FeatureText>
											{trackInfoQuery.data?.audioAnalysis.segments.length}
										</FeatureText>
										<FeatureLabel>Segments</FeatureLabel>
									</Feature>
								</Features>

								<FeatureChart
									features={trackInfoQuery.data?.audioFeatures}
									type=""
									indexAxis="x"
								/>

								<DescriptionLink
									href="https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-features/"
									target="_blank"
									rel="noopener noreferrer"
								>
									Full Description of Audio Features
								</DescriptionLink>
							</AudioFeatures>
						)}
				</Main>
			) : (
				<Loader />
			)}
		</React.Fragment>
	);
};

Track.propTypes = {
	trackId: PropTypes.string,
};

export default Track;
