export const trimedLowerRegExp = (param) => {
	return new RegExp(param.replace(/\s/g, "").toLowerCase(), "i");
};

function validateYear(year) {
	const parsedYear = parseInt(year);
	if (parsedYear >= 0 && parsedYear <= 99) {
		return true;
	}

	return false;
}

export function validateCi(ci) {
	// Extract year, month, day, and the last 5 digits
	const year = ci.substring(0, 2);
	const month = ci.substring(2, 4);
	const day = ci.substring(4, 6);
	const last5Digits = ci.substring(6);

	if (!validateYear(year)) {
		return false;
	}

	// TODO: Validate the year without

	// Check if the month is valid (01 to 12)
	if (!/^(0[1-9]|1[0-2])$/.test(month)) {
		return false;
	}

	// Check if the day is valid (01 to 31)
	if (!/^(0[1-9]|[12]\d|3[01])$/.test(day)) {
		return false;
	}

	// Check if the last 5 digits are numeric
	if (!/^\d{5}$/.test(last5Digits)) {
		return false;
	}

	// All checks passed, the CI is valid
	return true;
}
