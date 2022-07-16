import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Chart, registerables } from "chart.js";

import styled from "styled-components/macro";
import { theme } from "../styles";
const { fonts } = theme;

Chart.register(...registerables);

const properties = [
	"acousticness",
	"danceability",
	"energy",
	"instrumentalness",
	"liveness",
	"speechiness",
	"valence",
];

const Container = styled.div`
	/* position: relative; */
	width: 100%;
	max-width: 700px;
	margin: 0 auto;
	margin-top: -30px;

	/* #chart {
		margin: 0 auto;
		margin-top: -30px;
	} */
`;

const FeatureChart = (props) => {
	const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

	useEffect(() => {
		const createDataset = (features) => {
			const dataset = {};
			properties.forEach((prop) => {
				dataset[prop] = features.length
					? avg(features.map((feat) => feat && feat[prop]))
					: features[prop];
			});
			return dataset;
		};

		let myChart;

		const createChart = (dataset) => {
			const { type, indexAxis } = props;
			const ctx = document.getElementById("chart");
			const labels = Object.keys(dataset);
			const data = Object.values(dataset);

			return new Chart(ctx, {
				type: type || "bar",
				data: {
					labels,
					datasets: [
						{
							label: "",
							data,
							backgroundColor: [
								"rgba(255, 99, 132, 0.3)",
								"rgba(255, 159, 64, 0.3)",
								"rgba(255, 206, 86, 0.3)",
								"rgba(75, 192, 192, 0.3)",
								"rgba(54, 162, 235, 0.3)",
								"rgba(104, 132, 245, 0.3)",
								"rgba(153, 102, 255, 0.3)",
							],
							borderColor: [
								"rgba(255,99,132,1)",
								"rgba(255, 159, 64, 1)",
								"rgba(255, 206, 86, 1)",
								"rgba(75, 192, 192, 1)",
								"rgba(54, 162, 235, 1)",
								"rgba(104, 132, 245, 1)",
								"rgba(153, 102, 255, 1)",
							],
							borderWidth: 1,
						},
					],
				},
				options: {
					indexAxis: indexAxis || "x",
					layout: {
						padding: {
							left: 0,
							right: 0,
							top: 0,
							bottom: 0,
						},
					},
					plugins: {
						title: {
							display: true,
							text: `Audio Features`,
							font: {
								size: 18,
								family: `${fonts.primary}`,
							},
							color: "#ffffff",
							padding: 30,
						},
						legend: {
							display: false,
						},
					},
					scales: {
						x: {
							grid: {
								color: "rgba(255, 255, 255, 0.3)",
							},
							ticks: {
								font: {
									size: 12,
									family: `${fonts.primary}`,
								},
							},
						},
						y: {
							grid: {
								color: "rgba(255, 255, 255, 0.3)",
							},
							ticks: {
								font: {
									size: 12,
									family: `${fonts.primary}`,
								},
							},
							beginAtZero: true,
						},
					},
				},
			});
		};

		const parseData = () => {
			const { features } = props;
			const dataset = createDataset(features);
			myChart = createChart(dataset);
		};

		parseData();

		return () => {
			myChart.destroy();
		};
	}, [props]);

	return (
		<Container>
			<canvas id="chart" width="400" height="400" />
		</Container>
	);
};

FeatureChart.propTypes = {
	features: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
	type: PropTypes.string,
};

export default FeatureChart;
