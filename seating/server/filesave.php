<?php
	// $time = date( "Y_m_d_H_i_s");
	// $filename = "./files/save/" . $time .".bin";
  	// echo $filename;
	$sv_str = $_POST["save_data"];
	$filename = $_POST["filename"];
	echo $filename;
	$file = fopen($filename, "w");
	fwrite($file, $sv_str);
	fclose($file);
?>