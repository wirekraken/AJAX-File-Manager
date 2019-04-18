let documentHandler = () => {

	let files = document.getElementsByClassName('file');

	let extension = (filename) => {
		return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
	}

	for(let item of files){
		let ext = extension(item.children[0].innerText);
		item.style.background = `url(images/${ ext.toLowerCase() }.png) no-repeat 3px center`;
	
	}

	let deleteHandler = () => {
		var deleteFile = document.getElementsByClassName('deleteFile');
		for(let item of deleteFile){

			item.onclick = function(){
				
				let xhttp = new XMLHttpRequest();
				
				let tag = this.nextElementSibling, // получаем соседний элемент
				reference = tag.getAttribute('href'),
				params = 'delete='+ reference,
				filename = reference.replace(/^.*[\\\/]/, ''); // получаем имя файла

				let requestToDel = confirm(`Do you want to delete ${ filename } ?`);

				if(requestToDel){
					xhttp.open('GET', fileHandler +'?'+ params);

					xhttp.onreadystatechange = function(){
						actionStatus.innerText = this.responseText;
						new loadDocument('update')
					}
					xhttp.send()
				}
			}
		}
	}

	deleteHandler();

}