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

const setUpIndRev = (resultsObj, codeLabels) => {
	const results = resultsObj;
	const tmpCodes = [];
	const tmpExcerpts = [];
	const tmpRows = [];
	for (let i = 1; i < 16; i++) {
		const codeNum = parseInt(results[`code${i}`]);
		tmpCodes[i] = codeNum;
		tmpExcerpts[i] = results[`excerpt${i}`];
		if (codeNum === 1) {
			console.log(codeLabels);
			tmpRows[i] = {
				text: tmpExcerpts[i],
				code: `${i}. ${codeLabels[i]}`
			};
		}
	}
	const tmpComment = results['judg_comments'];

	return { tmpCodes, tmpExcerpts, tmpRows, tmpComment };
}

export { genMatches, genCodes, setUpIndRev };
