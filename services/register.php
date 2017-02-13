<?php

	header("Access-Control-Allow-Origin: *");
	
	if(isset($_POST['rut']) && isset($_POST['email'])){

		$rut = cleanRut(db_quote($_POST['rut']));
		$email = db_quote($_POST['email']);
		$fono = db_quote($_POST['fono']);
		$nombre = db_quote($_POST['nombre']);
		$comprobante = $_FILES['comprobante'];

		$connection = db_connect();

		if(!$connection){

			$resp['code'] = 2;
			$resp['resp'] = "error conexion bd";
			
			echo json_encode($resp);

		}else{

			$code = genCode($rut);
			$filename = renameFile($comprobante, $code);

			$result = db_query("INSERT into raffle (rut, email, nombre, fono, comprobante, codigo) VALUES ($rut, $email, $nombre, $fono, '$filename', '$code')");

			if($result){

				$resp['code'] = 0;
				$resp['resp'] = $code;
				
				echo json_encode($resp);

			}else{

				$resp['code'] = 3;
				$resp['resp'] = "error query";
				
				echo json_encode($resp);
			}
		}

	}else{

		$resp['code'] = 1;
		$resp['resp'] = "campos incompletos";
		
		echo json_encode($resp);
	}

	function db_connect(){
		
	    static $connection;
	    
	    if(!isset($connection)) {
	         
	        $config = parse_ini_file('../config.ini');
	        $connection = mysqli_connect($config['server'],$config['username'],$config['password'],$config['dbname'],$config['port']);
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

		$ts = microtime();

		return md5($seed.$ts);
	}

	function renameFile($file, $name){

		$tmpFile = $file['tmp_name'];
		$extension = end(explode(".",$file['name']));

		$newDir = "../comprobantes/";
		$newName = $name.".".$extension;

		rename($tmpFile, $newDir.$newName);

		return $newName;
	}

	function cleanRut($rut){

		return str_replace('.', '', str_replace('-', '', $rut));
	}

	function formatRut($rut) {
		
		return substr($rut, 0, (strlen($rut) > 8?2:1)).".".substr($rut, -7, -4).".".substr($rut, -4, -1)."-".substr($rut, -1);
	}

?>