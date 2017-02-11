<?php
	
	if(isset($_POST['rut']) && isset($_POST['email'])){

		$rut = db_quote($_POST['rut']);
		$email = db_quote($_POST['email']);
		$fono = db_quote($_POST['fono']);
		$nombre = db_quote($_POST['nombre']);
		$comprobante = $_FILES['comprobante'];

		$connection = db_connect();

		if(!$connection){

			echo '{code: 2, msg: "error conexion bd"}';

		}else{

			$code = genCode($rut);
			$filename = renameFile($comprobante, $code);

			db_query("INSERT into 'raffle' ('rut', 'email', 'nombre', 'fono', 'comprobante', 'codigo') VALUES ($rut, $email, $fono, $nombre, $filename, $codigo)");
		}

	}else{

		echo '{code: 1, msg: "campos incompletos"}';
		exit;
	}

	function db_connect(){
		
	    static $connection;
	    
	    if(!isset($connection)) {
	         
	        $config = parse_ini_file('../config.ini'); 
	        $connection = mysqli_connect('localhost',$config['username'],$config['password'],$config['dbname']);
	    }

	    if($connection === false) {
	      
	        return mysqli_connect_error(); 
	    }

	    return $connection;
	}

	function db_quote($value) {
	    $connection = db_connect();
	    return "'" . mysqli_real_escape_string($connection,$value) . "'";
	}

	function db_query($query) {
	    
	    $connection = db_connect();

	    $result = mysqli_query($connection,$query);

	    return $result;
	}

	function genCode($seed){

		
	}

	function renameFile($file, $name){

		
	}

?>