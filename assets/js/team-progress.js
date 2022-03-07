console.log(progData);

// get the page header (we'll insert the selector at the end of this)
const pageHead = document.querySelector('.entry-header');

// create a container
const selCont = document.createElement('div');
selCont.className = 'gcac-progress-selector-div';

// create a label
const selLabel = document.createElement('span');
selLabel.innerText = 'Select project: ';

// create the selector
const selector = document.createElement('select');
progData.allProjects.forEach((project) => {
	const option = document.createElement('option');
	option.value = project;
	option.innerText = project;
	selector.append(option);
});

// append the selector + label to the start of the body
selCont.appendChild(selLabel);
selCont.appendChild(selector);
pageHead.appendChild(selCont);

// add an event listener
selector.addEventListener('change', (e) => {
	// grab the selected option
	const {options} = e.target;
	const selected = options[options.selectedIndex].value;
	// send to php
	sendReq(selected);
})

// ajax request
const sendReq = (selected) => {
	// save the current innerHTML
	const savedPage = document.getElementById('gcac-progress-page').innerHTML;
	// print loading message
	document.getElementById('gcac-progress-page').innerHTML = '<h3>Loading...</h3>';

	// send request
	jQuery.ajax({
		type: 'post',
		url: progData.ajax_url,
		data: {
			project: selected,
			_ajax_nonce: progData.nonce,
			action: 'gcac_change_prog_proj'
		},
		error: function (e) {
			console.log('error', e);
			// put the saved page back + an error message
			const htmlToInsert = `<h3>Sorry, something went wrong changing the selected project to ${selected}.</h3>` + savedPage;
			document.getElementById('gcac-progress-page').innerHTML = htmlToInsert;
		},
		success: function (response) {
			console.log(response);
			// just wipe the page & replace with this
			document.getElementById('gcac-progress-page').innerHTML = response;
		}
	});
}