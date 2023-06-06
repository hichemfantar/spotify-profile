import React, { useState } from "react";
import { useGetTopTracks } from "../spotify";
import { catchErrors } from "../utils";

import Loader from "./Loader";
import TrackItem from "./TrackItem";

import styled from "styled-components/macro";
import { Main, media, mixins, theme } from "../styles";
const { colors, fontSizes } = theme;

const Header = styled.header`
	${mixins.flexBetween};
	${media.tablet`
    display: block;
  `};
	h2 {
		margin: 0;
	}
`;
const Ranges = styled.div`
	display: flex;
	margin-right: -11px;
	${media.tablet`
    justify-content: space-around;
    margin: 30px 0 0;
  `};
`;
const RangeButton = styled.button`
	background-color: transparent;
	color: ${(props) => (props.isActive ? colors.white : colors.lightGrey)};
	font-size: ${fontSizes.base};
	font-weight: 500;
	padding: 10px;
	${media.phablet`
    font-size: ${fontSizes.sm};
  `};
	span {
		padding-bottom: 2px;
		border-bottom: 1px solid
			${(props) => (props.isActive ? colors.white : `transparent`)};
		line-height: 1.5;
		white-space: nowrap;
	}
`;
const TracksContainer = styled.ul`
	margin-top: 50px;
`;

const TopTracks = () => {
	const [activeRange, setActiveRange] = useState("long");

	const getTopTracksQuery = useGetTopTracks(activeRange);

	const changeRange = async (range) => {
		setActiveRange(range);
	};

	const setRangeData = (range) => catchErrors(changeRange(range));

	return (
		<Main>
			<Header>
				<h2>Top Tracks</h2>
				<Ranges>
					<RangeButton
						isActive={activeRange === "long"}
						onClick={() => setRangeData("long")}
					>
						<span>All Time</span>
					</RangeButton>
					<RangeButton
						isActive={activeRange === "medium"}
						onClick={() => setRangeData("medium")}
					>
						<span>Last 6 Months</span>
					</RangeButton>
					<RangeButton
						isActive={activeRange === "short"}
						onClick={() => setRangeData("short")}
					>
						<span>Last 4 Weeks</span>
					</RangeButton>
				</Ranges>
			</Header>
			<TracksContainer>
				{getTopTracksQuery.data ? (
					getTopTracksQuery.data?.items.map((track, i) => (
						<TrackItem track={track} key={i} />
					))
				) : (
					<Loader />
				)}
			</TracksContainer>
		</Main>
	);
};

export default TopTracks;
