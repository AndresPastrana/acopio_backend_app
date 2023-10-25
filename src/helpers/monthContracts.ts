import { log } from "console";
import { MonthContract } from "../types.js";
export function mergeMonthContratcs(args: {
  defaults: Array<MonthContract>;
  replacer: Array<MonthContract>;
}): Array<MonthContract> {
  const { defaults, replacer } = args;
  // Create a copy of the default array to avoid modifying the original.

  //TODO: use a map here to garante no duplicates
  const mergedArray = [...defaults];

  // Iterate over the input array and update values in the mergedArray.
  for (const inputContract of replacer) {
    const index = mergedArray.findIndex(
      (contract) =>
        contract.month.toLowerCase() === inputContract.month.toLowerCase()
    );

    if (index >= 0) {
      mergedArray[index] = inputContract;
    }
  }
  return mergedArray;
}

export function validateNoDuplicateMonths(contracts: MonthContract[]): boolean {
  const seenMonths = new Set<string>();

  for (const contract of contracts) {
    if (seenMonths.has(contract.month)) return false;
    seenMonths.add(contract.month);
  }

  return true;
}
