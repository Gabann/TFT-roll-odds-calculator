<script lang="ts" setup>
import {useRollSimulatorStore} from "../store/rollSimulatorStore.js";
import {Chart} from "chart.js/auto";
import {onMounted, Ref, ref, watch} from "vue";

let rollSimulatorStore = useRollSimulatorStore();

let chart: Chart;

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

let cost: Ref<number> = ref(1);
let lvl: Ref<number> = ref(3);
let copies: Ref<number> = ref(0);
let pool: Ref<number> = ref(0);
let golds: Ref<number> = ref(50);
let simulations: Ref<number> = ref(200);

watch(lvl, (newValue, oldValue) => {
	UpdateChart();
});

watch(cost, (newValue, oldValue) => {
	UpdateChart();
});

watch(copies, (newValue, oldValue) => {
	UpdateChart();
});

watch(pool, (newValue, oldValue) => {
	UpdateChart();
});

watch(golds, (newValue, oldValue) => {
	UpdateChart();
});

watch(simulations, (newValue, oldValue) => {
	UpdateChart();
});

function UpdateChart(): void {


	let odds = rollSimulatorStore.simulateRolldown(simulations.value, golds.value, lvl.value, cost.value, copies.value, pool.value);

	chart.data.datasets = [{
		label: 'Chance to get at least x units',
		data: odds
	}]
	chart.update();
}

</script>

<template>
	<div class="container">
		<h4><label for="player-level-slider">Player level</label></h4>
		<input id="player-level-slider" v-model="lvl" class="slider" max="10" min="3" type="range">

		<input id="player-level-number" v-model="lvl" max="10" min="3" type="number" value="3">

		<br>

		<h4><label for="unit-cost-slider">Unit cost</label></h4>
		<input id="unit-cost-slider" v-model="cost" class="slider" max="5" min="1" type="range">
		
		<input id="unit-cost-number" v-model="cost" max="5" min="1" type="number" value="1">

		<br>

		<h4><label for="copies-out-pool">Number of copies out of the pool</label></h4>
		<input id="copies-out-pool" v-model="copies" max="29" min="0" type="number" value="0">

		<h4><label for="same-cost-out-pool">Number of same cost units out of the pool</label></h4>

		<input id="same-cost-out-pool" v-model="pool" max="29" min="0" type="number" value="0">

		<h4><label for="golds-to-roll">How many golds to roll (Huge numbers may crash navigator tab)</label></h4>

		<input id="golds-to-roll" v-model="golds" max="1000" min="2" type="number" value="50">

		<h4><label for="simulations-to-run">How many simulation to run (Huge numbers may crash navigator tab)</label></h4>
		<input id="simulations-to-run" v-model="simulations" max="10000" min="1" type="number" value="200">

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
