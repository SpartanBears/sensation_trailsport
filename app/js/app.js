$(document).ready(function(){

	document.getElementById('partiparBtn').addEventListener('click', participarBtnEvt, false);
	document.getElementById('enviarBtn').addEventListener('click', enviarBtnEvt, false);
	
	$('#modalEnviado').modal({
		complete: function(){

			toggleFormulario();
		}
	});

	$('#nombre,#fono,#emailComprobar,#email,#rut,input[type=file]').each(function(){

		// this.addEventListener('blur', onBlurEvt, false);
		this.addEventListener('change', onBlurEvt, false);
	});

});

function participarBtnEvt(e){

	toggleFormulario();
}

function enviarBtnEvt(e){

	var formData = new FormData();

	formData.append('rut', $('#rut').val());
	formData.append('email', $('#email').val());
	formData.append('fono', $('#fono').val());
	formData.append('nombre', $('#nombre').val());
	formData.append('comprobante', $('#comprobanteInput').prop('files')[0]);

	var formDataBkp = {rut: $('#rut').val(), email: $('#email').val(), fono: $('#fono').val(), nombre: $('#nombre').val(), comprobante: $('#comprobanteInput').prop('files')[0]};

	toggleEnviarSpinner();

	$.ajax({
		method: 'POST',
		url: "http://trailsport.cl/sensation/services/register.php",
		data: formData,
		customData: {
			formData: formDataBkp,
		},
		crossDomain: true,
		cache: false,
        contentType: false,
        processData: false,
		success: function(data){

			var response = JSON.parse(data);

			if(response.code == 0){

				$('#modalEnviadoCodigo').html(response.resp);

				codigoSendMail(response.resp, this.customData.formData);

				$('#nombre,#fono,#emailComprobar,#email,#rut,input[type=file]').each(function(){

					$(this).val('');
				});

			}else{

				$('#modalEnviadoCodigo').html('<<Inténtelo nuevamente>>');
			}

			$('#modalEnviado').modal("open");

			toggleEnviarSpinner();
		}
	});
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

function toggleEnviarSpinner(){

	if($('#enviarBtn').is(":visible")){

		$('#enviarBtn').fadeOut(500, function(){

			$('#enviarBtnSpinner').fadeIn(500, function(){

				//TODO
			});
		});

	}else{

		$('#enviarBtn').removeClass('disabled');

		$('#enviarBtnSpinner').fadeOut(500, function(){

			$('#enviarBtn').fadeIn(500, function(){

				//TODO
			});
		});

	}
}

function validarFields(){

	var fieldsId = '#nombre,#fono,#emailComprobar,#email,#rut,input[type=file]';
	var textFields = '#nombre,#fono,input[type=file]';
	var flagtext = true, flagMail = false, flagRut = false;

	// $(fieldsId).each(function(){

	// 	if(this.value.length>0){

	// 		toggleErrorForm(this, true);
	// 	}else{
	// 		toggleErrorForm(this, false);
	// 	}
	// });

	$(textFields).each(function(){

		if(this.value.length>0 && flagtext){

		}else{

			flagtext = false;
		}
	});

	if(validarMail($('#email')[0]) && validarMail($('#emailComprobar')[0]) && $('#email').val() == $('#emailComprobar').val()){

		toggleErrorForm($('#email')[0], true);
		toggleErrorForm($('#emailComprobar')[0], true);
		flagMail = true;
	}else if($('#email').val() != $('#emailComprobar').val()){

		toggleErrorForm($('#email')[0], false);
		toggleErrorForm($('#emailComprobar')[0], false);
		flagMail = false;
	}

	if($('#rut').val().length>1){
		flagRut = validaRut($('#rut')[0]);
		toggleErrorForm($('#rut')[0], flagRut);
	}

	if($('#fono').val().length > 1){
		if(onlyNumbers($('#fono').val())){
			toggleErrorForm($('#fono')[0], true);
		}else{

			toggleErrorForm($('#fono')[0], false);
		}
		
	}else{

		// 
	}

	if(flagtext * flagMail * flagRut * onlyNumbers($('#fono').val()) == 1){

		$('#enviarBtn').removeClass('disabled');
	}else{

		$('#enviarBtn').addClass('disabled');
	}

	return flagtext * flagMail * flagRut * onlyNumbers($('#fono').val()) * validarMail($('#email')[0]);
}

function validarMail(inputMail){

	var email = inputMail.value;

	var flag = false;

	if(email.match(/@/g) != null){
		if(email.match(/@/g).length == 1){
			if(email.match(/\./g) != null){
				flag = true;
			}else{
				flag = false;
			}
		}else{
			flag = false;
		}
	}else{
		flag = false;
	}

	if(flag){
		jQuery(inputMail).css("box-shadow", "none");
	}else{
		jQuery(inputMail).css("box-shadow", "inset 0px 0px 10px 1px rgba(255,0,0,0.63)");
	}
	return flag;
}

function validaRut(elemento){
	var rut = $(elemento).val();
	var outflag = false;

	if(typeof rut != 'undefined'){

		var rutAux = rut.replace(/\.|-/g,"").slice(0, -1);
		var digVer = rut.slice(-1);

		if(digVer == "1" || digVer == "2" || digVer == "3" || digVer == "4" || digVer == "5" ||
			digVer == "6" || digVer == "7" || digVer == "8" || digVer == "9" || digVer == "0" || 
			digVer == "k" || digVer == "K"){

			digVer = (digVer == "k" || digVer == "K") ? 10 : parseInt(digVer)

			if(!isNaN(rutAux)){

				var sumatoria = 0, cont = 0;
				for(var index = rutAux.length-1; index >= 0 ; index--){

					sumatoria+= parseInt(rutAux[index]) * ((cont%6)+2);
					cont++;
				}
	          
	          	if(sumatoria%11 == 0 && digVer == 0){
					outflag = true;
	            }else{
	            	outflag = ((11 - (sumatoria%11)) === digVer);
	            }
	          	
			}else{
				outflag = false;
			}
		}else{
			outflag = false;
		}

	    if(outflag){
			toggleErrorForm(elemento, true);
	    }else{
	      	toggleErrorForm(elemento, false);
	    }
	}else{

		outflag = false;
	}

	return outflag;
}

function onlyNumbers(string){

	var reg = /^\d+$/;
	return reg.test(string);
}

function toggleErrorForm(element, flag){

	var flagBool = (typeof flag != 'undefined') ? flag: false;

	if(flagBool){

		$(element).css("box-shadow", "none");
	}else{

		$(element).css("box-shadow", "inset 0px 0px 10px 1px rgba(255,0,0,0.63)");
	}
}

function onBlurEvt(e){

	validarFields();
}

function login(password){

	sessionStorage.pw = password;
}

function prepareRaffle(){

	getParticipants();
}

function runRaffle(winnerQty, ignoreQty){

	var pool = JSON.parse(sessionStorage.pt);
	var max = pool.length-1;

	getRandomNumbers(10, 0, max, winnerQty, ignoreQty, pool);
}

function getWinners(winnerQty, ignoreQty, playerPool, rngPool){

	for(var index = 0; index < (winnerQty + ignoreQty); index++){

		if(ignoreQty <= index){

			console.log("Winner - Ticket: " + rngPool[index] + " RUT: " + playerPool[rngPool[index]].rut + " Nombre: " + playerPool[rngPool[index]].nombre);

		}else{

			console.log("Ignored - Ticket: " + rngPool[index] + " RUT: " + playerPool[rngPool[index]].rut + " Nombre: " + playerPool[rngPool[index]].nombre);
		}
	}
}

function getRandomNumbers(qty, min, max, winnerQty, ignoreQty, playerPool){

	$.ajax({
		method: 'GET',
		url: "https://www.random.org/integers/?num="+qty+"&min="+min+"&max="+max+"&col=1&base=10&format=plain&rnd=new",
		customData:{

			winnerQty:winnerQty,
			ignoreQty:ignoreQty,
			playerPool:playerPool
		},
		success: function(data){

			getWinners(this.customData.winnerQty, this.customData.ignoreQty, this.customData.playerPool, data.split("\n"));
		}
	});
}

function getParticipants(){

	$.ajax({
		method: 'POST',
		data:{p:sessionStorage.pw},
		url: "http://trailsport.cl/sensation/services/raffle.php",
		success: function(data){

			sessionStorage.pt = data;
		}
	});
}