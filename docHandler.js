function documentHandler(){

	var file = document.getElementsByClassName('file');

	function extension(filename){
		return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
	}

	for(var x = 0; x < file.length; x++){

		var ext = extension(file[x].children[0].innerText);

		file[x].style.background = 'url(images/'+ ext.toLowerCase() +'.png) no-repeat 3px center';
	
	}

	deleteHandler();

	function deleteHandler(){
		var deleteFile = document.getElementsByClassName('deleteFile');

		for(var i = 0; i < deleteFile.length; i++){
			deleteFile[i].onclick = function(){
				
				var xhttp = new XMLHttpRequest();
				
				var tag = this.nextElementSibling; // получаем соседний элемент
				var reference = tag.getAttribute('href');
				var params = 'delete='+ reference;
				var filename = reference.replace(/^.*[\\\/]/, ''); // получаем имя файла

				var requestToDel = confirm('Do you want to delete '+ filename +' ?');

				if(requestToDel){
					xhttp.open('GET', fileHandler +'?'+ params);

					xhttp.onreadystatechange = function(){
						actionStatus.innerText = this.responseText;
						loadDocument('update');
					}
					xhttp.send()
				}
			}
		}
	}

	// downloadHandler();

	// function downloadHandler(){
	// 	var downloadFile = document.getElementsByClassName('downloadFile');
		
	// 	for(var i = 0; i < downloadFile.length; i++){
	// 		downloadFile[i].onclick = function(){

	// 			var thisAttr = this.getAttribute('href');
	// 			var filename = thisAttr.replace(/^.*[\\\/]/, '');
	// 			actionStatus.innerText = 'File '+ filename  +' successfully downloaded';
	// 		}
	// 	}
	// }

}