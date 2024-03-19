import {defineStore} from "pinia";

const unitsPoolSize: number[] = [22, 20, 17, 10, 9] //How many of each tier units there are in the pool, may change with patches
const distinctUnits: number[] = [13, 13, 13, 13, 8] // How many distinct units there are in every tier, may change with patches

// Reroll chances, row = level, column = cost - May change with patches
const rollProbabilities : number[][] = [
	[1, 0, 0, 0, 0], // 1
	[1, 0, 0, 0, 0], // 2
	[0.75, 0.25, 0, 0, 0], // 3
	[0.55, 0.30, 0.15, 0, 0], // 4
	[0.45, 0.33, 0.20, 0.02, 0], // 5
	[0.30, 0.40, 0.25, 0.05, 0], // 6
	[0.19, 0.35, 0.35, 0.10, 0.01], // 7
	[0.18, 0.25, 0.36, 0.18, 0.03], // 8
	[0.10, 0.20, 0.25, 0.35, 0.10], // 9
	[0.05, 0.10, 0.20, 0.40, 0.25], // 10
];

export const useRollSimulatorStore = defineStore('rollSimulator', () => {
	let costInPool = 0;
	let costOutPool = 0;
	let contestedCopies = 0;
	let copiesLeftInPool = 0;
	let copiesRolled = 0;

	// Get a random unit from given level (use this function 5 times to get a full shop)
	function getUnit(level: number): number
	{
		let array = [];

		for (let i = 0; i < 5; i++)
		{
			for (let j = 0; j < rollProbabilities[level - 1][i] * 100; j++)
			{
				array.push(i + 1);
			}
		}

		let rng = Math.floor(Math.random() * 100)

		return array[rng];
	}

	//Get a single random unit from desired level and check if it is the desired unit (a full shop in the game consist of 5 rolls)
	function roll(level : number, desiredCost : number)
	{
		if (desiredCost === getUnit(level))
		{
			//Test for desired unit
			copiesLeftInPool = unitsPoolSize[desiredCost - 1] - contestedCopies - copiesRolled;

			let rng = Math.floor(Math.random() * costInPool)

			if (rng < copiesLeftInPool)
			{
				copiesRolled++;
				costOutPool++;
				costInPool--;
			}
		}
	}

	//Spend x gold and check how many of desired units were rolled
	function rollDown(amountOfGolds : number, level : number, desiredCost : number) : number
	{
		costInPool = unitsPoolSize[desiredCost - 1] * distinctUnits[desiredCost - 1];
		costInPool -= costOutPool;
		costInPool -= contestedCopies

		if (costInPool <= 0){
			return 0;
		}

		for (let i = 0; i < amountOfGolds * 5 / 2; i++)
		{
			if (copiesRolled >= 9)
			{
				break;
			}

			roll(level, desiredCost)
		}

		return copiesRolled;
	}

	function simulateRolldown(numberOfSimulations : number, amountOfGolds : number, level : number, desiredCost : number, copiesContested : number, poolContested : number) : number[]
	{
		let rollDownArray = [];
		for (let i = 0; i < numberOfSimulations; i++)
		{
			copiesRolled = 0;
			contestedCopies = copiesContested;
			costOutPool = poolContested;

			rollDownArray.push(rollDown(amountOfGolds, level, desiredCost));
		}

		let probabilitiesArray = []

		for (let i = 0; i < 9; i++)
		{
			probabilitiesArray.push((1 - (rollDownArray.filter(x => x <= i).length) / numberOfSimulations) * 100);
		}

		return probabilitiesArray;
	}

	console.log(simulateRolldown(100, 100, 9, 5, 5, 20));

	return {
		simulateRolldown
	}
});
