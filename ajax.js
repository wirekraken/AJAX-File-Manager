const fileHandler = 'dataList.php';

class loadDocument{

	constructor(call){
		let xhttp = new XMLHttpRequest();

		if(call !== undefined && typeof call === 'number'){
			let tag = document.getElementById('dir_'+ call),
			reference = tag.getAttribute('href'),
			params = 'path='+ reference;

			xhttp.open('GET', fileHandler +'?'+ params);
		}
		// обновляем после загрузки файла
		else if(call !== undefined && call === 'update'){
			let params = 'path='+ pathName.getAttribute('data-path');
			xhttp.open('GET', fileHandler +'?'+ params);
		}
		else{
			xhttp.open('GET', fileHandler);
		}

		xhttp.onreadystatechange = function(){
			if(this.status == 200 && this.readyState == 4){
				block.innerHTML = this.responseText;
				documentHandler(); 
			}
			else{
				block.innerHTML = 'Error loading document !'+ this.status;
				return 0;
			}
		}
		xhttp.send();
	}
}

new loadDocument();

let form = document.createElement('form');
document.body.insertBefore(form, file);
form.method = 'POST';
form.enctype = 'multipart/form-data';
form.appendChild(file);

file.onchange = (event) => {
	// выводим окно выбора файлов
	windowCreateItems.style.transform = 'translateY(-999px)';
	windowSelectedFiles.style.transform = 'translateY(0)';

	let files = event.target.files; // получаем выбранные файлы
	let fileName = document.getElementsByClassName('fileName');

	let counter = 0; // счетчик количества имеющихся файлов

	for(let item of files){

  		listSelectedFiles.innerHTML += `<li><span>${ item.name }</span><span> ${ convSize(item.size) }</span></li>`;
		
		let i = 0; // счетчик количества имеющихся файлов в директории
  		for(let subItem of fileName){
			if(item.name == subItem.innerText){ // проверяем наличие файла в текущем директории

				listSelectedFiles.children[i].style.color = 'red';
				counter++;
				i++;
			}
		}
	}
	let countFiles = listSelectedFiles.children.length;
	let actionText = 'Selected file '+ countFiles;

	if(countFiles == 1){
		if(counter == 1)
			actionStatus.innerText = actionText +' (The file already exists in the directory) ';
		else
			actionStatus.innerText = actionText;
	}
	else{
		if(counter > 1)
			actionStatus.innerText = `${ actionText } (${ counter } files already exist in the directory) `;
		else
			actionStatus.innerText = actionText;
	}
}

confirmUpload.onclick = () => {

	let formData = new FormData(form);
	let xhttp = new XMLHttpRequest();

	xhttp.open('POST', 'upload.php');
	// создаем прогресс бар
	actionStatus.innerText = '';
	let progress = document.createElement('progress');
	let statusProgress = document.createElement('span');

	actionStatus.appendChild(statusProgress);
	actionStatus.appendChild(progress);

	xhttp.upload.onprogress = (event) => {
		windowSelectedFiles.style.transform = 'translateY(-999px)';

		if(event.lengthComputable){ // проверяем количество байт для отправки (записывается в total) 

			progress.max = event.total;
			progress.value = event.loaded;

			statusProgress.innerText = `Uploaded ${ convSize(event.loaded) }/${ convSize(event.total) } `;
		}
	}

	xhttp.upload.onerror = () => {
  		actionStatus.innerText = 'An error occurred while uploading data to the server !';
	}

	xhttp.onreadystatechange = function(){
	    if(this.status == 200){
	        actionStatus.innerText = this.responseText;	
	 		listSelectedFiles.innerHTML = '';
	 		form.reset(); // очищаем кэш выбранных файлов
	      	
	      	new loadDocument('update');
	    }
	    else{
	      	actionStatus.innerHTML = 'Server response failed !'+ this.status;
	    } 
	}
  	xhttp.send(formData);
}

let rejectUploadFunc = () => {
	windowSelectedFiles.style.transform = 'translateY(-999px)';
	listSelectedFiles.innerHTML = '';
	actionStatus.innerText = 'Rejected upload';
	form.reset();
}
rejectUpload.onclick = rejectUploadFunc;

function convSize(sizeB){
	let sizeKb = sizeB / 1024,
    sizeMb = sizeKb / 1024,
    size;

	if(sizeKb <= 1024){
        size = parseInt(sizeKb) +' Kb';
	}
	else if(sizeKb >= 1024 && sizeMb <= 1024){
		size = parseInt(sizeMb * 100) / 100 +' Mb';
	}
    return size;
}


createItems.onclick = () => {
	rejectUploadFunc(); // убираем окно выбранных файлов
	windowCreateItems.style.transform = 'translateY(0)';
	createInput.focus();
}

confirmCreation.onclick = () => {
	let xhttp = new XMLHttpRequest();

	let params = 'create='+ currentLoc.getAttribute('data-location') + createInput.value;

	if(createInput.value !== ''){
		xhttp.open('GET', fileHandler +'?'+ params);
		createInput.value = '';

		xhttp.onreadystatechange = function(){
			if(this.status == 200 && this.readyState == 4){
				actionStatus.innerText = this.responseText;
				new loadDocument('update');
			}
			else{
				actionStatus.innerText = 'Error creating !'+ this.status;
				return 0;
			}
		}
		xhttp.send();
	}
	else{
		actionStatus.innerText = 'Fill in the field!';
	}
}

rejectCreation.onclick = () => {
	windowCreateItems.style.transform = 'translateY(-999px)';
}