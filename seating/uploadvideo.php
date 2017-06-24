<?php
    define('PHOTOURL', 'server/files/mapping/');
    define('ARENAURL', 'server/files/mapping/');

    $org_name = basename($_FILES['mapping_videoupload']['name']);
    $real_name = convertToUniqueFilename($org_name);
    $target_path = PHOTOURL.$real_name;
    if(move_uploaded_file($_FILES['mapping_videoupload']['tmp_name'], $target_path))
        echo ARENAURL.$real_name;
    else
        echo "error";

    function convertToUniqueFilename($original_Name)
    {
        list($pre_name, $extension) = explode('.', $original_Name);
        $uniqu_ID = time(true);
        $tmp_filename = $pre_name.$uniqu_ID.".".$extension;

        return $tmp_filename;
    }
?>