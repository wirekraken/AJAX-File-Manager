<?php
session_start();
$path_upload = $_SESSION['path']; // получаем тукущий путь для загрузки

$pos = strrpos($path_upload, DIRECTORY_SEPARATOR."Home" );
$dir_upload = substr($path_upload, $pos + 1);

$name = $_FILES['files']['name'];
$tmp_name = $_FILES['files']['tmp_name'];
$error = $_FILES['files']['error'];

$converter = [
	'а' => 'a',  'б' => 'b',  'в' => 'v',   'г' => 'g',  'д' => 'd',  'е' => 'e',
	'ё' => 'e',  'ж' => 'zh', 'з' => 'z',   'и' => 'i',  'й' => 'y',  'к' => 'k',
	'л' => 'l',  'м' => 'm',  'н' => 'n',   'о' => 'o',  'п' => 'p',  'р' => 'r',
	'с' => 's',  'т' => 't',  'у' => 'u',   'ф' => 'f',  'х' => 'h',  'ц' => 'c',
	'ч' => 'ch', 'ш' => 'sh', 'щ' => 'sch', 'ь' => '',   'ы' => 'y',  'ъ' => '',
	'э' => 'e',  'ю' => 'yu', 'я' => 'ya', 

	'А' => 'A',  'Б' => 'B',  'В' => 'V',  'Г' => 'G', 'Д' => 'D', 'Е' => 'E',
	'Ё' => 'E',  'Ж' => 'Zh', 'З' => 'Z',  'И' => 'I', 'Й' => 'Y', 'К' => 'K',
	'Л' => 'L',  'М' => 'M',  'Н' => 'N',  'О' => 'O', 'П' => 'P', 'Р' => 'R',
	'С' => 'S',  'Т' => 'T',  'У' => 'U',  'Ф' => 'F', 'Х' => 'H', 'Ц' => 'C',
	'Ч' => 'Ch', 'Ш' => 'Sh', 'Щ' => 'Sch','Ь' => '',  'Ы' => 'Y', 'Ъ' => '',
	'Э' => 'E',  'Ю' => 'Yu', 'Я' => 'Ya',
];

$status;
$counter;

for($x=0; $x<count($name);$x++){
	if(is_uploaded_file($tmp_name[$x])){
		$converted_name = strtr($name[$x], $converter);

		move_uploaded_file($tmp_name[$x], $dir_upload.DIRECTORY_SEPARATOR.$converted_name);
		
		$counter++;
		if($counter == 1){
			$status = $counter." file uploaded successfully";
		}
		else{
			$status = $counter." files uploaded successfully";
		}
		if(!empty($error[$x]) || empty($tmp_name[$x])){
            echo "Error uploading !";
		}
	}
}
echo $status;