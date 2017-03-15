<?php

	header("Access-Control-Allow-Origin: *");

	$enabled = false;

	if($_POST['p'] != 'trailsport2017' && $enabled){

		$resp['code'] = 4;
		$resp['resp'] = "error password";
		
		echo json_encode($resp);

	}else{

		$connection = db_connect();

		if(!$connection){

			$resp['code'] = 2;
			$resp['resp'] = "error conexion bd";
			
			echo json_encode($resp);

		}else{

			$result = db_query("SELECT * FROM raffle WHERE confirmado = 1");

			if($result){

				while($row = $result->fetch_array(MYSQL_ASSOC)) {

			    	$temp[] = $row;
				}
				
				echo json_encode($temp);

			}else{

				$resp['code'] = 3;
				$resp['resp'] = "error query";
				
				echo json_encode($resp);
			}
		}
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

	function db_query($query) {

	    $connection = db_connect();

	    $result = mysqli_query($connection,$query);

	    return $result;
	}

	function formatRut($rut) {
		
		return substr($rut, 0, (strlen($rut) > 8?2:1)).".".substr($rut, -7, -4).".".substr($rut, -4, -1)."-".substr($rut, -1);
	}

?>