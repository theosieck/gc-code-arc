console.log(progData);

// get the page title (we'll insert just before this)
const pageTitle = document.getElementById('gcac-progress-title');

// create the selector
const selector = document.createElement('select');
progData.allProjects.forEach((project) => {
	const option = document.createElement('option');
	option.value = project;
	option.innerText = project;
	selector.append(option);
});

// append the selector to the start of the body
pageTitle.before(selector);

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
	jQuery.ajax({
		type: 'post',
		url: progData.ajax_url,
		data: {
			project: selected,
			_ajax_nonce: progData.nonce,
			action: 'gcac_change_prog_proj'
		},
		error: function (e) {console.log('error', e)},
		success: function (resp) {console.log(resp.type)}
	});
}