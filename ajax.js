var fileHandler = 'dataList.php';
loadDocument();

function loadDocument(num){
	var xhttp = new XMLHttpRequest();

	if(num !== undefined && typeof num === 'number'){
		var tag = document.getElementById('dir_'+ num);
		var reference = tag.getAttribute('href');
		var params = 'path='+ reference;

		xhttp.open('GET', fileHandler +'?'+ params);
	}
	// обновляем после загрузки файла
	else if(num !== undefined && num === 'update'){
		var params = 'path='+ pathName.innerText;
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

var form = document.createElement('form');
document.body.insertBefore(form, file);
form.method = 'POST';
form.enctype = 'multipart/form-data';
form.appendChild(file);

file.onchange = function(event){
	// выводим окно выбора файлов
	windowSelectedFiles.style.transform = 'translateY(0)';
	var files = event.target.files;
	var fileName = document.getElementsByClassName('fileName');

	var counter = 0; // счетчик количества имеющихся файлов
	for(var i = 0; i < files.length; i++){
  		listSelectedFiles.innerHTML += '<li><span>'+ files[i].name +'</span><span>'+ convSize(files[i].size) +'</span></li>';
		
  		for(var x = 0; x < fileName.length; x++){
			if(files[i].name == fileName[x].innerText){ // проверяем наличие файла в текущем директории

				listSelectedFiles.children[i].style.color = 'red';
				counter++;
			}
		}
	}
	var countFiles = listSelectedFiles.children.length;
	var actionText = 'Selected file '+ countFiles;

	if(countFiles == 1){
		if(counter == 1)
			actionStatus.innerText = actionText +' (The file already exists in the directory) ';
		else
			actionStatus.innerText = actionText;
	}
	else{
		if(counter > 1)
			actionStatus.innerText = actionText +' ('+ counter +' files already exist in the directory) ';
		else
			actionStatus.innerText = actionText;
	}
}

send.onclick = function(){

	var formData = new FormData(form);
	var xhttp = new XMLHttpRequest();
	xhttp.open('POST', 'upload.php');

	// создаем прогресс бар
	actionStatus.innerText = '';
	var progress = document.createElement('progress');
	var statusProgress = document.createElement('span');

	actionStatus.appendChild(statusProgress);
	actionStatus.appendChild(progress);

	xhttp.upload.onprogress = function(event){
		windowSelectedFiles.style.transform = 'translateY(-999px)';

		if(event.lengthComputable){ // проверяем количество байт для отправки (записывается в total) 

			progress.max = event.total;
			progress.value = event.loaded;

			statusProgress.innerText = 'Uploaded '+ convSize(event.loaded) +'/'+ convSize(event.total) +' ';
		}
	}

	xhttp.upload.onerror = function(){
  		actionStatus.innerText = 'An error occurred while uploading data to the server !';
	}

	xhttp.onreadystatechange = function(){
	    if(this.status == 200){
	        actionStatus.innerText = this.responseText;	
	 		listSelectedFiles.innerHTML = '';
	 		form.reset(); // очищаем кэш
	      	
	      	loadDocument('update');
	    }
	    else{
	      	actionStatus.innerHTML = 'Server response failed !'+ this.status;
	    } 
	}
  	xhttp.send(formData);
}

reject.onclick = function(){
	windowSelectedFiles.style.transform = 'translateY(-999px)';
	listSelectedFiles.innerHTML = '';
	actionStatus.innerText = 'Rejected upload';
	form.reset();
}

function convSize(sizeB){
	var sizeKb = sizeB / 1024;
    var sizeMb = sizeKb / 1024;
    var size;

	if(sizeKb <= 1024){
        size = parseInt(sizeKb) +' Kb';
	}
	else if(sizeKb >= 1024 && sizeMb <= 1024){
		size = parseInt(sizeMb * 100) / 100 +' Mb';
	}
    return size;
}