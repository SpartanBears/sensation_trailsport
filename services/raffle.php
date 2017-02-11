<?php
	
	if(isset($_POST['rut']) && isset($_POST['email'])){

		$rut = $_POST['rut'];
		$email = $_POST['email'];
		$fono = $_POST['fono'];
		$nombre = $_POST['nombre'];

	}else{

		echo '{code: 1, msg: "campos incompletos"}';
	}

?>