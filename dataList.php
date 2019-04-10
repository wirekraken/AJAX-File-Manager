<?php
session_start();

class Data{
    public $path;

    function create_list(){
        
        $sep = DIRECTORY_SEPARATOR;
        $this->path = isset($_GET['path']) ? $_GET['path'] : __DIR__.$sep."Home";
    
        $_SESSION['path'] = $this->path; // передаем тукущий путь для загрузки файла

        $array = explode($sep, $this->path);
        $end = end($array);

        echo "<span id='pathName' style='display:none'>".$this->path."</span>";//передаем тукущий путь в JS

        $pos = strrpos($this->path, $sep."Home");
        $sub = substr($this->path, $pos+1);

        function conv_size($sizeB){
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

        echo "<div id='currentLoc'>".$sub."</div>";

        $folder_list;
        $file_list;

        if(is_dir($this->path)){
            $dir = scandir($this->path);
            echo '<ol>';
            $num = 1;
            foreach($dir as $item){
                if(is_dir($this->path.$sep.$item)){
                    $dir_class;
                    
                    if($item === ".") continue;
                    else if($item === ".." && $end === "Home") continue; // запрещаем выход за корневой директории
                    else if($item === "..") $dir_class = "dir_back";
                    else if($item !== "..") $dir_class = "dir";

                    $folder_list .= '<li class="'.$dir_class.'"><a id="dir_'.$num.'" onclick="loadDocument('.$num.'); return false;" href="'.
                        realpath($this->path.$sep.$item).'">'. $item.'</a></li>';
                }
                else{
                    $ext = pathinfo($item)['extension'];
                    $file_size = conv_size(filesize($sub.$sep.$item));

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
}

$data = new Data();

$delete_file = $_GET["delete"];

if(!empty($delete_file)){
    @unlink($delete_file);
    echo "File ".basename($delete_file)." successfully removed";
}
else{
    echo $data->create_list();
}