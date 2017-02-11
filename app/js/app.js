$(document).ready(function(){

	document.getElementById('partiparBtn').addEventListener('click', participarBtnEvt, false);
	document.getElementById('enviarBtn').addEventListener('click', enviarBtnEvt, false);
	
	$('#modalEnviado').modal({
		complete: function(){

			toggleFormulario();
		}
	});

});

function participarBtnEvt(e){

	toggleFormulario();
}

function enviarBtnEvt(e){

	/*$.ajax({
		method: 'POST',
		url: "spartanbears.cl/WIP/services/raffle.php",
		data:{
			rut:,
			email:,
			fono:,
			nombre:
		},
		crossDomain: true,
		success: function(data){

			if(!data.includes('token invalido')){

				//TODO

			}else{

				sessionStorage.clear();
				location.href = "../index.html";
			}
		}
	});*/

	$('#modalEnviado').modal("open");
}

function toggleFormulario(){

	if($('.inscripcionButton').is(":visible")){

		$('.inscripcionButton').fadeOut(500, function(){

			$('.formularioReal').fadeIn(500, function(){

				//TODO
			});
		});

	}else{

		$('.formularioReal').fadeOut(500, function(){

			$('.inscripcionButton').fadeIn(500, function(){

				//TODO
			});
		});

	}
}