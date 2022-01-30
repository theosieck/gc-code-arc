const genMatches = (codes, matches) => {
	const matchArray = [];
	matchArray[0] = 0;
	for (let i = 1; i <= codes.length; i++) {
		if (matches[i] && matches[i][0] != '' && matches[i][1] != '') {
			matchArray[0]++;
			matchArray[i] = [];
			matchArray[i][0] = [codes[i], matches[i][0]];
			matchArray[i][1] = [codes[i], matches[i][1]];
		}
	}
	return matchArray;
};

const genCodes = (codes, excerpts) => {
	const codeArray = [];
	for (let i = 1; i <= codes.length; i++) {
		if (excerpts[i]) {
			codeArray[i] = [codes[i], excerpts[i]];
		}
	}
	return codeArray;
};

export {
	genMatches,
	genCodes
}