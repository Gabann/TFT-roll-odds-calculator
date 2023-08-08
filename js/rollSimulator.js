const unitsPoolSize = [29, 22, 18, 12, 10] //How many of each tier units there are in the pool, may change with patches
const distinctUnits = [13, 13, 13, 12, 8] // How many distinct units there are in every tier, may change with patches

// Reroll chances, row = level, column = cost - May change with patches
const rollProbabilities = [
	[1, 0, 0, 0, 0],
	[1, 0, 0, 0, 0],
	[0.75, 0.25, 0, 0, 0],
	[0.55, 0.30, 0.15, 0, 0],
	[0.45, 0.33, 0.20, 0.02, 0],
	[0.25, 0.40, 0.30, 0.05, 0],
	[0.19, 0.30, 0.35, 0.15, 0.01],
	[0.16, 0.20, 0.35, 0.25, 0.04],
	[0.09, 0.15, 0.30, 0.30, 0.16],
	[0.05, 0.10, 0.20, 0.40, 0.25],
	[0.01, 0.02, 0.12, 0.50, 0.35]
];

let costInPool = 0;
let costOutPool = 0;
let contestedCopies = 0;
let copiesLeftInPool = 0;
let copiesRolled = 0;

// Get a random unit from given level (use this function 5 times to get a full shop)
function getUnit(level)
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
function roll(level, desiredCost)
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
function rollDown(amountOfGolds, level, desiredCost)
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

export function simulateRolldown(numberOfSimulations, amountOfGolds, level, desiredCost, copiesContested, poolContested)
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
