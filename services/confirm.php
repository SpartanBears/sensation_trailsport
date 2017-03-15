<?php

	header("Access-Control-Allow-Origin: *");

	if($_POST['p'] == 'trailsport2017'){

		$connection = db_connect();

		switch($_POST['opt']){

			case 'users':

				echo json_encode(getAllParticipants());

			break;

			case 'confirm':

				if(isset($_POST['code'])){

					if(confirmCode($_POST['code'], $_POST['status'])){

						$resp['code'] = $_POST['code'];
						$resp['status'] = $_POST['status'];

						echo json_encode($resp);

					}else{

						$resp['code'] = $_POST['code'];
						$resp['status'] = "error";

						echo json_encode($resp);
					}
				}

			break;

			case 'login':

				echo login($_POST['p']);

			break;

			default:

				die;

			break;
		}

		if(!$connection){

			$resp['code'] = 2;
			$resp['resp'] = "error conexion bd";
			
			echo json_encode($resp);

		}else{

			
		}
	}

	function getAllParticipants(){

		$result = db_query("SELECT * FROM raffle");

		if($result){

			while($row = $result->fetch_array(MYSQL_ASSOC)) {

		    	$temp[] = $row;
			}
			
			return $temp;

		}else{

			$resp['code'] = 3;
			$resp['resp'] = "error query";
			
			return $resp;
		}

	}

	function confirmCode($code, $status){

		$result = db_query("UPDATE raffle SET confirmado = '$status' WHERE codigo = '$code'");

		if(mysqli_affected_rows(db_connect()) > 0){
			
			return true;

		}else{

			return false;
		}
	}

	function login($pw){

		$valid = false;

		if($pw == 'trailsport2017'){

			$valid = true;
		}

		return $valid;
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

?>