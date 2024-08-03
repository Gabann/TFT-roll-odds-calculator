import {defineStore} from 'pinia';

const unitsPoolSize: number[] = [30, 25, 18, 10, 9];
const distinctUnits: number[] = [13, 13, 13, 12, 8];
const rollProbabilitiesPerLevel: number[][] = [
	[1, 0, 0, 0, 0],
	[1, 0, 0, 0, 0],
	[0.75, 0.25, 0, 0, 0],
	[0.55, 0.30, 0.15, 0, 0],
	[0.45, 0.33, 0.20, 0.02, 0],
	[0.30, 0.40, 0.25, 0.05, 0],
	[0.19, 0.30, 0.40, 0.10, 0.01],
	[0.18, 0.27, 0.32, 0.20, 0.03],
	[0.15, 0.20, 0.25, 0.30, 0.10],
	[0.05, 0.10, 0.20, 0.40, 0.25],
];

export const useRollSimulatorStore = defineStore('rollSimulator', () => {
	let contestedCopiesCount: number;
	let contestedSameCostCount: number;
	let copiesRolledCount: number;
	let goldCount: number;
	let playerLevel: number;
	let searchedCost: number;

	function getUnit(): number {
		let rng: number = Math.random();
		let index: number = playerLevel - 1;
		let unitCost: number = 0;

		for (let i: number = 0; i < rollProbabilitiesPerLevel[index].length; i++) {
			if (rng <= rollProbabilitiesPerLevel[index][i]) {
				unitCost = i + 1;
				break;
			} else {
				rng -= rollProbabilitiesPerLevel[index][i];
			}
		}

		return unitCost;
	}

	function checkIfUnitIsDesired(unitRolledCost: number): boolean {
		if (unitRolledCost !== searchedCost) {
			return false;
		}

		let totalUnits = unitsPoolSize[searchedCost - 1] * distinctUnits[searchedCost - 1] - contestedCopiesCount - copiesRolledCount - contestedSameCostCount;
		let desiredUnitsLeft = unitsPoolSize[searchedCost - 1] - contestedCopiesCount - copiesRolledCount;
		return Math.random() * totalUnits < desiredUnitsLeft;
	}

	function roll() {
		goldCount -= 2;

		for (let i = 0; i < 5; i++) {
			let unitRolledCost = getUnit();

			if (checkIfUnitIsDesired(unitRolledCost)) {
				goldCount -= unitRolledCost;
				copiesRolledCount++;
			}
		}
	}

	function rollDown(): number {

		while (true) {
			if (goldCount < 2) break;
			if (copiesRolledCount > 9) break;
			if (contestedCopiesCount + copiesRolledCount > unitsPoolSize[searchedCost - 1]) break;

			roll();
		}

		return copiesRolledCount;
	}

	function simulateRolldown(numberOfSimulations: number, amountOfGolds: number, level: number, desiredCost: number, contestedCopies: number, poolContested: number): number[] {
		let numberOfCopiesFoundPerRolldown: number[] = [];

		for (let i = 0; i < numberOfSimulations; i++) {
			playerLevel = level;
			goldCount = amountOfGolds;
			searchedCost = desiredCost;
			copiesRolledCount = 0;
			contestedCopiesCount = contestedCopies;
			contestedSameCostCount = poolContested;

			numberOfCopiesFoundPerRolldown.push(rollDown());
		}

        return numberOfCopiesFoundPerRolldown.map((copies, i) => (1 - (numberOfCopiesFoundPerRolldown.filter(x => x <= i).length) / numberOfSimulations) * 100);
	}

	return {
		simulateRolldown
	};
});
