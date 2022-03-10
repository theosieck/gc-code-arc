let dataObj = {project:'',removable:''};
let optionsList = projObj.projOptions;
const currentProj = document.querySelector('#current-project');
const options = document.querySelector('#project-options');

// create new option
const newOption = (option) => {
	const optionContainer = document.createElement('div');
	const newOption = document.createElement('button');
	const removeOption = document.createElement('button');

	newOption.textContent = option;
	newOption.style.cssText = 'margin-right:10px;margin-bottom:10px;';
	newOption.addEventListener('click',() => {
		dataObj.project = newOption.textContent;
		currentProj.textContent = `Current Project: ${dataObj.project}`;
		sendData();
	});
	// newOption.disabled = true;	// disable button

	removeOption.textContent = "x";
	removeOption.addEventListener('click',() => {
		dataObj.removable = option;
		sendData();
	})

	optionContainer.setAttribute("id",option.replace(/ /g,'-'));

	optionContainer.appendChild(newOption);
	optionContainer.appendChild(removeOption);
	options.appendChild(optionContainer);
}

// generate project options
const genOptions = () => {
	options.innerHTML = '';
	optionsList.forEach((option) => {
		newOption(option);
	})
}

genOptions();

// update html elements and page meta
const updateHTML = () => {
	// update current project
	currentProj.textContent = `Current Global Project: ${dataObj.project}`;

	if(optionsList.indexOf(dataObj.project)>-1) {
		alert('That project already exists.');
		return;
	}

	// update project options
	optionsList.push(dataObj.project);
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
				dataObj.removable = '';	// reset the removable thing regardless of what happened
					console.log("something went wrong: ", e.statusText);
			},
			success : function( response ) {
				dataObj.removable = '';
				if(response.type != 'success') {
					alert(response.type);
				} else {
					const removed = response.removed;
					if(removed) {
						optionsList.splice(optionsList.indexOf(removed));
						document.querySelector(`#${removed.replace(/ /g,"-")}`).innerHTML = '';
					}
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
