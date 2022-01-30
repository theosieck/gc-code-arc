const genMatches = (codes, matches) => {
	console.log(codes, matches);
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

export {
	genMatches
}