$(document).ready(function () { // --- start

"use strict";

//----------------------------------------------- meni
$("#pocetna").click(function() {
  $("#btnKosarica").hide();
  $(".nav li").removeClass("active");
  $("#pocetna").addClass('active');
  LoadHtml("#mainDiv","vijesti.html");
});
$("#onama").click(function() {
  $("#btnKosarica").hide();
  $(".nav li").removeClass("active");
  $("#onama").addClass('active');
  $("#mainDiv").load("onama.html");
});
$("#izdanja").click(function() {
  $("#btnKosarica").show();
  $(".nav li").removeClass("active");
  $("#izdanja").addClass("active");
  $("#mainDiv").load("izdanja.html");
});
$("#kontakt").click(function() {
  $("#btnKosarica").hide();
  $(".nav li").removeClass("active");
  $("#kontakt").addClass('active');
  $("#mainDiv").load("kontakt.html");
});

//----------------------------------------------------

var total=sessionStorage.getItem( "total");
//----------------------------------------------------------------------
var LoadHtml=function(id,html) {
  $(id).load(html); 		 
};
//----------------------------------------------------------------------
var ReplaceDiv=function(id,content) {
  $(id).html(content);
};
//----------------------------------------------------------------------
var kosaricaClick=function () {
	LoadHtml("#mainDiv","kosarica.html");		
};
//----------------------------------------------------------------------


//----------------------------------------------------------------------
//---- RUN
//----------------------------------------------------------------------
$("#btnKosarica").click(kosaricaClick);
$("#btnKosarica").hide();
LoadHtml("#mainDiv","vijesti.html");


}); // ---end

