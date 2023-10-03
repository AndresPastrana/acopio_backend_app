export const trimedLowerRegExp = (param) => {
	return new RegExp(param.replace(/\s/g, "").toLowerCase(), "i");
};
