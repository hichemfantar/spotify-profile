import React from "react";
import { Link, NavLink } from "react-router-dom";

import {
	IconSpotify,
	IconUser,
	IconTime,
	IconMicrophone,
	IconPlaylist,
	IconMusic,
	IconGithub,
} from "./icons";

import styled from "styled-components/macro";
import { theme, mixins, media } from "../styles";
const { colors } = theme;

const Container = styled.nav`
	${mixins.coverShadow};
	${mixins.flexBetween};
	flex-direction: column;
	min-height: 100vh;
	position: fixed;
	top: 0;
	left: 0;
	width: ${theme.navWidth};
	background-color: ${colors.navBlack};
	text-align: center;
	z-index: 99;
	${media.tablet`
    top: auto;
    bottom: 0;
    right: 0;
    width: 100%;
    min-height: ${theme.navHeight};
    height: ${theme.navHeight};
    flex-direction: row;
  `};
	& > * {
		width: 100%;
		${media.tablet`
      height: 100%;
    `};
	}
`;
const Logo = styled.div`
	color: ${colors.green};
	margin-top: 30px;
	width: 70px;
	height: 70px;
	transition: ${theme.transition};
	${media.tablet`
    display: none;
  `};
	&:hover,
	&:focus {
		color: ${colors.offGreen};
	}
	svg {
		width: 50px;
	}
`;
const Github = styled.div`
	color: ${colors.lightGrey};
	width: 45px;
	height: 45px;
	margin-bottom: 30px;
	${media.tablet`
    display: none;
  `};
	a {
		&:hover,
		&:focus,
		&.active {
			color: ${colors.blue};
		}
		svg {
			width: 30px;
		}
	}
`;
const Menu = styled.ul`
	display: flex;
	flex-direction: column;
	${media.tablet`
    flex-direction: row;
    align-items: flex-end;
    justify-content: center;
  `};
`;
const MenuItem = styled.li`
	color: ${colors.lightGrey};
	font-size: 11px;
	${media.tablet`
    flex-grow: 1;
    flex-basis: 100%;
    height: 100%;
  `};
	a {
		display: block;
		padding: 15px 0;
		border-left: 5px solid transparent;
		width: 100%;
		height: 100%;
		${media.tablet`
      ${mixins.flexCenter};
      flex-direction: column;
      padding: 0;
      border-left: 0;
      border-top: 3px solid transparent;
    `};
		&:hover,
		&:focus,
		&.active {
			color: ${colors.white};
			background-color: ${colors.black};
			border-left: 5px solid ${colors.offGreen};
			${media.tablet`
        border-left: 0;
        border-top: 3px solid ${colors.offGreen};
      `};
		}
	}
	svg {
		width: 20px;
		height: 20px;
		margin-bottom: 7px;
	}
`;

const isActiveRoute = ({ isActive }) => (isActive ? "active" : "");

const CustomNavLink = (props) => (
	<NavLink className={isActiveRoute} {...props} />
);

const Nav = () => (
	<Container>
		<Logo>
			<Link to="/">
				<IconSpotify />
			</Link>
		</Logo>
		<Menu>
			<MenuItem>
				<CustomNavLink to="/">
					<IconUser />
					<div>Profile</div>
				</CustomNavLink>
			</MenuItem>
			<MenuItem>
				<CustomNavLink to="artists">
					<IconMicrophone />
					<div>Top Artists</div>
				</CustomNavLink>
			</MenuItem>
			<MenuItem>
				<CustomNavLink to="tracks">
					<IconMusic />
					<div>Top Tracks</div>
				</CustomNavLink>
			</MenuItem>
			<MenuItem>
				<CustomNavLink to="recent">
					<IconTime />
					<div>Recent</div>
				</CustomNavLink>
			</MenuItem>
			<MenuItem>
				<CustomNavLink to="playlists">
					<IconPlaylist />
					<div>Playlists</div>
				</CustomNavLink>
			</MenuItem>
		</Menu>
		<Github>
			<a
				href="https://github.com/hichemfantar/spotify-observer"
				target="_blank"
				rel="noopener noreferrer"
			>
				<IconGithub />
			</a>
		</Github>
	</Container>
);

export default Nav;
