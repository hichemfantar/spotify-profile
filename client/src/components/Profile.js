import React from "react";

import Artist from "./Artist";
import Nav from "./Nav";
import Playlist from "./Playlist";
import Playlists from "./Playlists";
import RecentlyPlayed from "./RecentlyPlayed";
import Recommendations from "./Recommendations";
import ScrollToTop from "./ScrollToTop";
import TopArtists from "./TopArtists";
import TopTracks from "./TopTracks";
import Track from "./Track";
import User from "./User";

import { Route, Routes } from "react-router-dom";
import styled from "styled-components/macro";
import { media, theme } from "../styles";

const SiteWrapper = styled.div`
	padding-left: ${theme.navWidth};
	${media.tablet`
    padding-left: 0;
    padding-bottom: 50px;
  `};
`;

const Profile = () => (
	<SiteWrapper>
		<Nav />
		<ScrollToTop />
		<Routes>
			<Route path="/" element={<User />} />

			<Route path="recent" element={<RecentlyPlayed />} />

			<Route path="artists" element={<TopArtists />} />
			<Route path="artist/:artistId" element={<Artist />} />

			<Route path="tracks" element={<TopTracks />} />
			<Route path="track/:trackId" element={<Track />} />

			<Route path="playlists" element={<Playlists />} />
			<Route path="playlists/:playlistId" element={<Playlist />} />

			<Route path="recommendations/:playlistId" element={<Recommendations />} />

			<Route path="*" element={<User />} />
		</Routes>
	</SiteWrapper>
);

export default Profile;
