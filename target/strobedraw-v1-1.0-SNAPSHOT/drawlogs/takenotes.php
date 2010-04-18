<?php
	if($_POST['savedStrokes']) {
		$savedStrokes = $_POST['savedStrokes'];
		$file = fopen("getStuff.js","w");
		fwrite($file,"var drawing = '");
		fwrite($file,$savedStrokes);
		fwrite($file,"';");
		fclose($file);
		
		echo $savedStrokes;
	} else {
		echo "nothing?";
	}
?>