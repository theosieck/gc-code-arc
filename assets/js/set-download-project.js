console.log(projDownloadInfo);

// get the body
const wpContBod = document.getElementById('wpbody-content');

// create the title and instructions
const title = document.createElement('h1');
title.innerText = 'ARC Data Export';
const subtitle = document.createElement('p');
subtitle.innerText = 'Select a project to download its data.';

// create the selector
const selector = document.createElement('select');
projDownloadInfo.allProjects.forEach((project) => {
	const option = document.createElement('option');
	option.value = project;
	option.innerText = project;
	selector.append(option);
});

// create a button container
const buttonCont = document.createElement('div');

// create a button for the first option
const downloadButton = document.createElement('button');
const firstOpt = projDownloadInfo.allProjects[0];
downloadButton.innerText = `Download ${firstOpt} Data`;
downloadButton.addEventListener('click', (e) => {sendReq(e, firstOpt)});
// add it to the container
buttonCont.appendChild(downloadButton);

// render everything in the body
wpContBod.appendChild(title);
wpContBod.appendChild(subtitle);
wpContBod.appendChild(selector);
wpContBod.appendChild(buttonCont);

// add an event listener to the selector
selector.addEventListener('change', (e) => {
	// clear the buttons
	buttonCont.innerHTML = '';
	// grab the selected option
	const {options} = e.target;
	const selected = options[options.selectedIndex].value;
	// create a download button for the selected option
	const downloadButton = document.createElement('button');
	downloadButton.innerText = `Download ${selected} Data`;
	downloadButton.addEventListener('click', (e) => {sendReq(e, selected)});
	// add it to the container
	buttonCont.appendChild(downloadButton);
});

// ajax request
const sendReq = (e, selected) => {
	e.preventDefault();
	jQuery.ajax({
		type: 'post',
		url: projDownloadInfo.ajax_url,
		data: {
			// project: selected,
			// _ajax_nonce: projDownloadInfo.nonce,
			// action: 'gcca_do_export'
		},
		dataType: 'json',
		error: function (e) {console.log(e)},
		success: function (response) {console.log(response.type)}
	});
}