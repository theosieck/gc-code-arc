let dataObj = {project: ''};
const currentProj = document.querySelector('#current-project');
const options = document.querySelector('#project-options');

// create new option
const newOption = (option) => {
	const newOption = document.createElement('button');
	newOption.textContent = option;
	newOption.style.cssText = 'margin-right:10px;margin-bottom:10px;';
	newOption.addEventListener('click',() => {
		dataObj.project = newOption.textContent;
		currentProj.textContent = `Current Project: ${dataObj.project}`;
		sendData();
	});
	options.appendChild(newOption);
}

// generate project options
const genOptions = () => {
	options.innerHTML = '';
	projObj.projOptions.forEach((option) => {
		newOption(option);
	})
}

genOptions();

// update html elements and page meta
const updateHTML = () => {
	// update current project
	currentProj.textContent = `Current Project: ${dataObj.project}`;

	// update project options
	newOption(dataObj.project);

	// update page meta
	sendData();
}

// update page meta
const sendData = () => {
	dataObj.action = 'gc_update_project';
	dataObj._ajax_nonce =  projObj.nonce;
	jQuery.ajax({
			type : "POST",
			url : projObj.ajax_url,
			data : dataObj,
			dataType: "json",
			error : function( e ) {
					console.log("something went wrong: ", e.statusText);
			},
			success : function( response ) {
				if(response.type != 'success') {
					alert(response.type);
				}
			}
	});
}

// get new project name
document.querySelector('#new-project-form').addEventListener('submit',(e) => {
    e.preventDefault();
		const textVal = e.target.elements.newProjectName.value;
		if(textVal) {
			dataObj.project = textVal;
	    e.target.elements.newProjectName.value = '';
			updateHTML();
		} else {
			alert('Please enter a project title.');
		}
});
