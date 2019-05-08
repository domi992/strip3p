// JavaScript Document

$(document).ready(function () { // --- start

"use strict";

//------------------------------------------------------ Inicijalizacija mail servisa za slanje narudžbe
var mailInit=function(){
	emailjs.init("user_THmYDhLj743OB0QaWfG3s");
};
//------------------------------------------------------  Vraća string ponovljen n puta
function stringFill(x, n) { 
    var s = ''; 
    while (s.length<n){
		s=s+x;
	} 
    return s; 
} 

//---------------------------------------------------------------------- Broj s dvije decimale (string)
var formatBroj=function(x) { 
    var nbDec=100;
    var a = Math.abs(x);
    var e = Math.floor(a);
    var d = Math.round((a-e)*nbDec); if (d === nbDec) { d=0; e++; }
    var signStr = (x<0) ? "-" : " ";
    var decStr = d.toString(); var tmp = 10; while(tmp<nbDec && d*tmp < nbDec) {decStr = "0"+decStr; tmp*=10;}
    var eStr = e.toString();
    return signStr+eStr+"."+decStr;
};
//---------------------------------------------------------------------- 
var delKosaricaAll= function(){
	var emptycart = {items:[]};
	$("#brojArt").html("0");
	sessionStorage.setItem( "kosarica", JSON.stringify(emptycart));
	sessionStorage.setItem( "total", 0 );
	$("#grKosarica").jqxGrid('clear');
	var totalStr="<h4>Ukupna cijena: "+formatBroj(0)+" kn</h4>";
	$("#total_div").html(totalStr);
};
//---------------------------------------------------------------------- 
var delKosaricaRow= function(row){
	var total=parseFloat(sessionStorage.getItem( "total"));
    var cart = sessionStorage.getItem( "kosarica");	
	var cartObj = JSON.parse(cart);
	var cijena=parseFloat(cartObj.items[row].cijena);
	
	cartObj.items.splice(row,1); // brise jedan red na indeksu row
	var len=cartObj.items.length;
	total=total-cijena;
				
	$("#brojArt").html(len);
	sessionStorage.setItem( "kosarica", JSON.stringify(cartObj));
	sessionStorage.setItem( "total", total);
	var totalStr="<h4>Ukupna cijena: "+formatBroj(total)+" kn</h4>";
	$("#total_div").html(totalStr);	
};

//---------------------------------------------------------- kod kreiranja dugmeta za brisanje
var rendBris=function(){
	return "x";
};
//---------------------------------------------------------- klik na dugme za brisanje
var clickBris=function(row){
	  var id = $("#grKosarica").jqxGrid('getrowid', row);
	  $('#grKosarica').jqxGrid('deleterow', id);
	  delKosaricaRow(row);
};

//----------------------------------------------------------- Generira tablicu s izabranim artiklima
var vidiKosaricu= function(){
	var total=parseFloat(sessionStorage.getItem( "total"));
	
	var cart = sessionStorage.getItem( "kosarica");
	var cartObj = JSON.parse(cart);
	
	var sourceKos = {
		dataType: "json",
		localData: cartObj,
		dataFields:
		[
		  	{name: "ID"},
			{name: "naziv"},
			{name: "cijena"},
			{name: "kol"}
		]
	};	
	
	var dataAdapterKos = new $.jqx.dataAdapter(sourceKos);
	dataAdapterKos.dataBind();
	
	
	$("#grKosarica").jqxGrid({
                width: 600,
                source: dataAdapterKos,
                autoheight: true,
                columns: [
                  { text: "ID", datafield: "ID", width: 50 ,cellsalign: "center" },
                  { text: "Naziv", datafield: "naziv", width: 400 },
                  { text: "Cijena", datafield: "cijena", width: 80,cellsalign: "center" },
                  { text: "Kol", datafield: "kol", width: 30, cellsalign: "center" },
				  { text: '...', datafield: 'Delete', columntype: 'button', width: 20, cellsrenderer: rendBris, buttonclick: clickBris}
                ]
    });
	
	var totalStr="<h4>Ukupna cijena: "+formatBroj(total)+" kn</h4>";
	$("#total_div").html(totalStr);
};


//--------------------------------------------------------------- Daje string s izabranim artiklima 
var dajArtikle= function(){
    var poruka="";	
	var total=parseFloat(sessionStorage.getItem( "total")); 
	var cart = sessionStorage.getItem( "kosarica");
	var cartObj = JSON.parse(cart);
	var len=cartObj.items.length;
		
	var id,naziv,cijena;
	
	poruka+="<br><br>"+stringFill("-",80);
	poruka+="<br><br>Naručeni artikli:<br>";
	for(var i=0;i<len;i++){	
	  id=cartObj.items[i].ID;
	  naziv=cartObj.items[i].naziv;
	  cijena=cartObj.items[i].cijena;
	  poruka+="<br>Šifra: "+id+" Naziv: "+naziv+" Iznos (kn): "+cijena;
	}
		
	poruka+="<br>"+stringFill("-",80)+"<br><br>";
	poruka+="Ukupni iznos (kn): "+formatBroj(total);
	
	return 	poruka;
};

//----------------------------------------------------------------------
var funNaruci=function(){
	
  var salje_ime=$("#cf_ime").val();
  var ema=$("#cf_mail").val();
  var tel=$("#cf_tel").val();
  var por=$("#cf_por").val();
  
  // dodaj narucene artikle u poruku
  por=por+dajArtikle();

  $("#kosPoruka").html("Slanje ...");
   
   emailjs.send("gmail","template1",{ime: salje_ime, email: ema,telefon: tel,poruka: por})
   .then(function(response) {
	    $("#kosPoruka").html("PODACI NARUČITELJA"); 
		delKosaricaAll();
		alert("Hvala! Narudzba je poslana.");
	}, function(err) {
		$("#kosPoruka").html("PODACI NARUČITELJA"); 
		alert("Narudzba nije poslana : "+err);
	});
};
//----------------------------------------------------------------------
var funNaIzdanja=function(){
  $("#btnKosarica").show();
  $("#mainDiv").load("izdanja.html");
};
//----------------------------------------------------------------------
$("#btnNaruci").jqxButton();
$("#btnNaruci").on('click', funNaruci);
$("#btnNaIzdanja").jqxButton();
$("#btnNaIzdanja").on('click', funNaIzdanja);


//----------------------------------------------------------------------
// RUN
//----------------------------------------------------------------------
$("#btnKosarica").hide();
mailInit();
vidiKosaricu();

}); // ---end