import {simulateRolldown} from "./rollSimulator.js";

const chartCanvas = document.getElementById("probability-chart");

const chart = new Chart(chartCanvas, {
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

// Make all inputs update the charts when changed
let allInputs = document.querySelectorAll('input');
allInputs.forEach(function (elem)
{
	elem.addEventListener("input", function ()
	{
		UpdateChart();
	})
})

//Sync the sliders and numbers inputs
let costSlider = document.getElementById("unit-cost-slider");
let costNumber = document.getElementById("unit-cost-number");

costSlider.addEventListener('input', function (e)
{
	costNumber.value = e.target.value;
});
costNumber.addEventListener('input', function (e)
{
	costSlider.value = e.target.value;
});

let levelSlider = document.getElementById("player-level-slider");
let levelNumber = document.getElementById("player-level-number");

levelSlider.addEventListener('input', function (e)
{
	levelNumber.value = e.target.value;
});
levelNumber.addEventListener('input', function (e)
{
	levelSlider.value = e.target.value;
});

function UpdateChart()
{
	let cost = parseInt(document.getElementById("unit-cost-slider").value);
	let lvl = parseInt(document.getElementById("player-level-slider").value);
	let copies = parseInt(document.getElementById("copies-out-pool").value);
	let pool = parseInt(document.getElementById("same-cost-out-pool").value);
	let golds = parseInt(document.getElementById("golds-to-roll").value);
	let simulations = parseInt(document.getElementById("simulations-to-run").value);

	let odds = simulateRolldown(simulations, golds, lvl, cost, copies, pool);

	chart.data.datasets = [{
		label: 'Chance to get at least x units',
		data: odds
	}]
	chart.update();
}

UpdateChart();
