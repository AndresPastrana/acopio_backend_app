import { compare, hash } from "bcrypt";
const saltRounds = 10;
export const hashString = async (valueToHash: string) => {
	const bcryptHash = await hash(valueToHash, saltRounds);
	return bcryptHash;
};

export const compareHash = async (plainText: string, hashedData: string) => {
	const isTheSame = await compare(plainText, hashedData);
	return isTheSame;
};
