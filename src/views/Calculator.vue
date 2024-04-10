<script lang="ts" setup>
import {useRollSimulatorStore} from "../store/rollSimulatorStore.js";
import {Chart} from "chart.js/auto";
import {onMounted, Ref, ref, watch} from "vue";

let rollSimulatorStore = useRollSimulatorStore();

let chart: Chart;

let desiredCost: Ref<number> = ref(1);
let playerLevel: Ref<number> = ref(4);
let copiesOutPool: Ref<number> = ref(0);
let sameCostOutPool: Ref<number> = ref(0);
let goldsToRoll: Ref<number> = ref(50);
let simulationsCount: Ref<number> = ref(100);

function UpdateChart(): void {
	let odds = rollSimulatorStore.simulateRolldown(simulationsCount.value, goldsToRoll.value, playerLevel.value, desiredCost.value, copiesOutPool.value, sameCostOutPool.value);

	chart.data.datasets = [{
		label: 'Chance to get at least x units',
		data: odds
	}]
	chart.update();
}

watch(playerLevel, (newValue, oldValue) => {
	UpdateChart();
});

watch(desiredCost, (newValue, oldValue) => {
	UpdateChart();
});

watch(copiesOutPool, (newValue, oldValue) => {
	UpdateChart();
});

watch(sameCostOutPool, (newValue, oldValue) => {
	UpdateChart();
});

watch(goldsToRoll, (newValue, oldValue) => {
	UpdateChart();
});

watch(simulationsCount, (newValue, oldValue) => {
	UpdateChart();
});

onMounted(() => {
	const chartCanvas = document.getElementById("probability-chart");

	if (chartCanvas instanceof HTMLCanvasElement) {
		chart = new Chart(chartCanvas, {
			type: "bar", data: {
				labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9"], datasets: [{
					label: "Chance to get at least x units", data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
				}]
			}, options: {
				scales: {
					y: {
						max: 100, min: 0,
					}
				}
			}
		})
	} else {
		console.error('Element with id "probability-chart" not found or is not a canvas element');
	}

	UpdateChart();
});
</script>

<template>
	<div class="container">
		<h4><label for="player-level-slider">Player level</label></h4>
		<input id="player-level-slider" v-model.number="playerLevel" class="slider" max="10" min="3" type="range">

		<input id="player-level-number" v-model="playerLevel" max="10" min="3" type="number">

		<br>

		<h4><label for="unit-cost-slider">Unit desired cost</label></h4>
		<input id="unit-cost-slider" v-model.number="desiredCost" class="slider" max="5" min="1" type="range">

		<input id="unit-cost-number" v-model="desiredCost" max="5" min="1" type="number">

		<br>

		<h4><label for="copies-out-pool">Number of copies out of the pool</label></h4>
		<input id="copies-out-pool" v-model="copiesOutPool" max="29" min="0" type="number" value="0">

		<h4><label for="same-cost-out-pool">Number of same same cost units out of the pool</label></h4>

		<input id="same-cost-out-pool" v-model="sameCostOutPool" max="29" min="0" type="number" value="0">

		<h4><label for="golds-to-roll">How many golds to roll (Huge numbers may crash navigator tab)</label></h4>

		<input id="golds-to-roll" v-model="goldsToRoll" max="1000" min="2" type="number" value="50">

		<h4><label for="simulations-to-run">How many simulation to run (Huge numbers may crash navigator tab)</label></h4>
		<input id="simulations-to-run" v-model="simulationsCount" max="10000" min="1" type="number" value="200">

		<div class="chart-container">
			<canvas id="probability-chart" aria-label="chart"/>
		</div>

	</div>
</template>

<style scoped>
.chart-container {
	display: flex;
	width: auto;
	justify-content: center;
	height: 55vh;
}

.slider {
	cursor: pointer;
}

input[type="range"] {
	-webkit-appearance: none;
	margin-right: 10px;
	width: 150px;
	height: 10px;
	background: grey;
	border-radius: 5px;
}

input[type="range"]::-webkit-slider-thumb {
	-webkit-appearance: none;
	height: 20px;
	width: 20px;
	border-radius: 50%;
	background: cornflowerblue;
	box-shadow: 0 0 2px 0 #555;
}
</style>
