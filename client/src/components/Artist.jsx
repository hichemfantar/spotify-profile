import PropTypes from "prop-types";
import React from "react";
import { useGetArtist } from "../spotify";
import { formatWithCommas } from "../utils";

import Loader from "./Loader";

import { useParams } from "react-router-dom";
import styled from "styled-components/macro";
import { Main, media, mixins, theme } from "../styles";
const { colors, fontSizes, spacing } = theme;

const ArtistContainer = styled(Main)`
	${mixins.flexCenter};
	flex-direction: column;
	height: 100%;
	text-align: center;
`;
const Artwork = styled.div`
	${mixins.coverShadow};
	border-radius: 100%;
	img {
		object-fit: cover;
		border-radius: 100%;
		width: 300px;
		height: 300px;
		${media.tablet`
      width: 200px;
      height: 200px;
    `};
	}
`;
const ArtistName = styled.h1`
	font-size: 70px;
	margin-top: ${spacing.md};
	${media.tablet`
    font-size: 7vw;
  `};
`;
const Stats = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	grid-gap: 10px;
	margin-top: ${spacing.md};
	text-align: center;
`;
const Stat = styled.div``;
const Number = styled.div`
	color: ${colors.blue};
	font-weight: 700;
	font-size: ${fontSizes.lg};
	text-transform: capitalize;
	${media.tablet`
    font-size: ${fontSizes.md};
  `};
`;
const Genre = styled.div`
	font-size: ${fontSizes.md};
`;
const NumLabel = styled.p`
	color: ${colors.lightGrey};
	font-size: ${fontSizes.xs};
	text-transform: uppercase;
	letter-spacing: 1px;
	margin-top: ${spacing.xs};
`;

const Artist = () => {
	const { artistId } = useParams();
	const getArtistQuery = useGetArtist(artistId);
	const { data: getArtistQueryData } = getArtistQuery;

	return (
		<React.Fragment>
			{getArtistQueryData ? (
				<ArtistContainer>
					<Artwork>
						<img
							src={getArtistQueryData?.images[0]?.url}
							alt="Artist Artwork"
						/>
					</Artwork>
					<div>
						<ArtistName>{getArtistQueryData?.name}</ArtistName>
						<Stats>
							<Stat>
								<Number>
									{formatWithCommas(getArtistQueryData?.followers?.total)}
								</Number>
								<NumLabel>Followers</NumLabel>
							</Stat>
							{getArtistQueryData?.genres && (
								<Stat>
									<Number>
										{getArtistQueryData?.genres?.map((genre) => (
											<Genre key={genre}>{genre}</Genre>
										))}
									</Number>
									<NumLabel>Genres</NumLabel>
								</Stat>
							)}
							{getArtistQueryData?.popularity && (
								<Stat>
									<Number>{getArtistQueryData?.popularity}%</Number>
									<NumLabel>Popularity</NumLabel>
								</Stat>
							)}
						</Stats>
					</div>
				</ArtistContainer>
			) : (
				<Loader />
			)}
		</React.Fragment>
	);
};

Artist.propTypes = {
	artistId: PropTypes.string,
};

export default Artist;
