import React from "react";
import { useGetRecentlyPlayed } from "../spotify";

import Loader from "./Loader";
import TrackItem from "./TrackItem";

import styled from "styled-components/macro";
import { Main } from "../styles";

const TracksContainer = styled.ul`
	margin-top: 50px;
`;

const RecentlyPlayed = () => {
	const getRecentlyPlayedQuery = useGetRecentlyPlayed();

	return (
		<Main>
			<h2>Recently Played Tracks</h2>
			<TracksContainer>
				{getRecentlyPlayedQuery.data ? (
					getRecentlyPlayedQuery.data.items.map(({ track }, i) => (
						<TrackItem track={track} key={i} />
					))
				) : (
					<Loader />
				)}
			</TracksContainer>
		</Main>
	);
};

export default RecentlyPlayed;
