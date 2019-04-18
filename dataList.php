<?php
session_start();

class Data{

    function __construct($path){

        $sep = DIRECTORY_SEPARATOR;
    
        $_SESSION['path'] = $path; // передаем тукущий путь для загрузки файла

        $array = explode($sep, $path);
        $end = end($array);

        echo "<span id='pathName' data-path='".$path."' style='display:none'></span>";//передаем тукущий путь в JS

        $pos = strrpos($path, $sep."Home");
        $sub = substr($path, $pos+1);

        echo "<div id='currentLoc' data-location='".$sub.$sep."''>".$sub."</div>";

        $folder_list;
        $file_list;

        if(is_dir($path)){
            $dir = scandir($path);
            echo '<ol>';
            $num = 1;
            foreach($dir as $item){
                if(is_dir($path.$sep.$item)){
                    $dir_class;
                    
                    if($item === ".") continue;
                    else if($item === ".." && $end === "Home") continue; // запрещаем выход за корневой директории
                    else if($item === "..") $dir_class = "dir_back";
                    else if($item !== "..") $dir_class = "dir";

                    $folder_list .= '<li class="'.$dir_class.'"><a id="dir_'.$num.'" onclick="new loadDocument('.$num.'); return false;" href="'.
                        realpath($path.$sep.$item).'">'. $item.'</a></li>';
                }
                else{
                    $ext = pathinfo($item)['extension'];
                    $file_size = $this->conv_size(filesize($sub.$sep.$item));

                    $file_list .= '<li class="file ext_'.$ext.'"><span class="fileName">'.$item.'</span><span class="sizeFile">'.$file_size.'</span><span class="deleteFile"></span><a href="'.$sub.$sep.$item.'" download class="downloadFile"></a></li>';
                }
                $num++;
            }
            echo $folder_list;
            echo $file_list;
            echo '</ol>';
        }
        else{
            echo 'Error loading content !';
        }
    }

    public function conv_size($sizeB){
        $sizeKb = $sizeB / 1024;
        $sizeMb = $sizeKb / 1024;
        $size;

        if($sizeKb <= 1024){
            $size = round($sizeKb, 1).' Kb';
        }
        else if($sizeKb >= 1024 && $sizeMb <= 1024){
            $size = round($sizeMb, 1).' Mb';
        }
        return $size;
    }

}

$path = isset($_GET['path']) ? $_GET['path'] : __DIR__. DIRECTORY_SEPARATOR. "Home";

$delete_file = $_GET["delete"];
$create_folder = $_GET["create"];

if(!empty($delete_file)){
    @unlink($delete_file);
    echo "File ".basename($delete_file)." successfully removed";
}
elseif(!empty($create_folder)){
    @mkdir($create_folder);
    $folder_name = substr($create_folder, strrpos($create_folder, DIRECTORY_SEPARATOR)+1);
    echo "Directory ".$folder_name." successfully created";
}
else{
    new Data($path);
}

