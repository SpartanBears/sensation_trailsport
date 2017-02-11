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

	var formData = new FormData();

	formData.append('rut', $('#rut').val());
	formData.append('email', $('#email').val());
	formData.append('fono', $('#fono').val());
	formData.append('nombre', $('#nombre').val());
	formData.append('comprobante', $('#comprobanteInput').prop('files')[0]);

	$.ajax({
		method: 'POST',
		url: "http://127.0.0.1/sensation_trailsport/services/raffle.php"/*"spartanbears.cl/WIP/services/raffle.php"*/,
		data: formData,
		crossDomain: true,
		cache: false,
        contentType: false,
        processData: false,
		success: function(data){

			console.log(data);
		}
	});

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

function validarFields(){

	var fieldsId = '#nombre,#fono,#emailComprobar,#email,#rut';
	var textFields = '#nombre,#fono,input[type=file]';
	var flagtext = true, flagMail = true, flagRut = true;

	$(fieldsId).each(function(){

		if(this.value.length>0){

			toggleErrorForm(this, true);
		}else{
			toggleErrorForm(this, false);
		}
	});

	$(textFields).each(function(){

		if(this.value.length>0 && flagtext){

			toggleErrorForm(this, true);
		}else{

			flagtext = false;
			toggleErrorForm(this, false);
		}
	});

	if($('#email').val().length > 0 && $('#emailComprobar').val().length > 0 && $('#email').val() == $('#emailComprobar').val()){

		flagMail = true;
	}else if($('#email').val() != $('#emailComprobar').val()){

		toggleErrorForm($('#email')[0], false);
		toggleErrorForm($('#emailComprobar')[0], false);
		flagMail = false;
	}

	flagRut = validaRut($('#rut')[0]);

	if(onlyNumbers($('#fono').val())){

		toggleErrorForm($('#fono')[0], true);
	}else{

		toggleErrorForm($('#fono')[0], false);
	}

	return flagtext * flagMail * flagRut * onlyNumbers($('#fono').val());
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


}