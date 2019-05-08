$(document).ready(function () { // --- start

	"use strict";
	
	//----------------------------------------------------------------------
	var SendGmail=function(){
		
	  var salje_ime=$("#cf_ime").val();
	  var ema=$("#cf_mail").val();
	  var tel=$("#cf_tel").val();
	  var por=$("#cf_por").val();
	 
	   emailjs.send("gmail","template1",{ime: salje_ime, email: ema,telefon: tel,poruka: por})
	   .then(function(response) {
   			alert("Hvala! Poruka je poslana.");
		}, function(err) {
   			alert("Poruka nije poslana : "+err);
		});
		
	    
	};
	
	
	var mailInit=function(){
		emailjs.init("user_THmYDhLj743OB0QaWfG3s");
	};
	//----------------------------------------------------------------------  RUN
	
	$("#btnSendMail").jqxButton();
	$("#btnSendMail").on('click', SendGmail);
	mailInit();

}); // ---end
