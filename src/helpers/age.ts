function excractDigitsANumericString(
	str: string,
	starts: number,
	end: number,
): number {
	return parseInt(str.substring(starts, end));
}

function calculateYearFromCiDigits(digits: number): number {
	const currentYear = new Date().getFullYear();
	const digitsCurrentYear = parseInt(currentYear.toString().slice(2));

	let year;

	if (digits >= digitsCurrentYear) {
		return 1900 + digits;
	}

	if (digits < digitsCurrentYear) {
		return 2000 + digits;
	}

	return 1;
}

export function caluculateAge(ci: string) {
	const year = excractDigitsANumericString(ci, 0, 2);
	const month = excractDigitsANumericString(ci, 2, 4);
	const day = excractDigitsANumericString(ci, 4, 6);
	const currentDate = new Date(Date.now());
	const threeDigitsYear = calculateYearFromCiDigits(year);

	const aproxAge = currentDate.getFullYear() - threeDigitsYear;

	if (threeDigitsYear > 2023 || threeDigitsYear < 1923) {
		throw new Error("Invalid params, year");
	}

	if (month < 1 || month > 12) {
		throw new Error("Invalid params, month");
	}

	if (currentDate.getMonth() < month) {
		return aproxAge - 1;
	}

	if (currentDate.getMonth() === month) {
		if (currentDate.getDay() < day) {
			return aproxAge - 1;
		}
	}
	console.log(`Here ${aproxAge}`);

	return aproxAge;
}
