$(document).ready(function () { // --- start

"use strict";

var xmlurl="data/artikli.xml";
var data_loaded=false;
var itemsInCart = 0;
var total=0;
var cart = {items:[]};



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
var ReplaceDiv=function(id,content) {
  $(id).html(content);
};
//----------------------------------------------------------------------
var createCart=function(obj) {
	sessionStorage.setItem( "kosarica", JSON.stringify(obj));
	sessionStorage.setItem( "total", 0 );
};
//----------------------------------------------------------------------
var source =
{
	datatype: "xml",
	datafields: [
	     { name: 'ID', type: 'number' },
		 { name: 'naziv', type: 'string' },
		 { name: 'cijena', type: 'number' },		 
		 { name: 'slika', type: 'string' },		 
		 { name: 'lnk', type: 'string' },
		 { name: 'sadrzaj', type: 'string' },
		 { name: 'autori', type: 'string' }
	], 
	root: 'DATA',
	record: 'ROW',
	url: xmlurl
};

var afterLoad=function(records) { 
  data_loaded=true;
};

var dataAdapter = new $.jqx.dataAdapter(source,{loadComplete: afterLoad});
dataAdapter.dataBind();

//----------------------------------------------------------------------
var postaviNot=function(){
	$("#noteId").jqxNotification({
		width: '350px', appendContainer: '#noteCont', opacity: 0.9, autoOpen: false, 
		animationOpenDelay: 800, autoClose: true, autoCloseDelay: 3000, template: 'info'
	 });
};

//----------------------------------------------------------------------
var addToCart= function ( values ) {
	var cart = sessionStorage.getItem( "kosarica");
	var cartObj = JSON.parse(cart);
	
	cartObj.items.push(values);		
	sessionStorage.setItem( "kosarica", JSON.stringify(cartObj));
};

//----------------------------------------------------------------------
var BrojiCartItems=function(){
	var cart = sessionStorage.getItem( "kosarica");
	var cartObj = JSON.parse(cart);
	var len=cartObj.items.length;
  	return len;	
};
//----------------------------------------------------------------------
var dajArtikle= function(){
    var poruka="";	
	var total=parseFloat(sessionStorage.getItem( "total")); 
	var cart = sessionStorage.getItem( "kosarica");
	var cartObj = JSON.parse(cart);
	var len=cartObj.items.length;
		
	var id,naziv,cijena;
	
	for(var i=0;i<len;i++){	
	  id=cartObj.items[i].ID;
	  naziv=cartObj.items[i].naziv;
	  cijena=cartObj.items[i].cijena;
	  poruka+="<br>"+id+" "+naziv+" "+cijena;
	}
		
	poruka+="<br>--------------------------------<br><br>";
	poruka+="Total: "+formatBroj(total);
	
	return 	poruka;
};
//----------------------------------------------------------------------
var buyClick=function () {
	itemsInCart++;
		
	$("#brojArt").html(itemsInCart);
	
	var row = $(this).attr("datarow");
	var total=parseFloat(sessionStorage.getItem( "total"));
	var rec=dataAdapter.records;
	var id = rec[row].ID;
	var naziv = rec[row].naziv;
	var cijena = parseFloat(rec[row].cijena);
	
				
	var add={ID: id, naziv: naziv, cijena: cijena, kol: 1};
	addToCart(add);
	
	total=total+cijena;
	sessionStorage.setItem( "total",total);
	
	var poruka=dajArtikle();
		
	$("#noteId").html(poruka);
	$("#noteId").jqxNotification("closeAll");
	$("#noteId").jqxNotification("open");
	
};
//----------------------------------------------------------------------
var setButtons=function () {
	$(".buy").jqxButton();
	$(".buy").click(buyClick);
};

//----------------------------------------------------------------------
var RenderCell=function (){
    var lnk, slika,naziv,cijena,sadrzaj,autori,img,infodiv,izborbtn,imgdiv;
	var rec=dataAdapter.records;
	var len=rec.length;
	var naslov='<h3 style="color:white">STRIP3P IZDANJA</h3>';
	var celldiv=naslov+'<div class="row">';
	var artdiv='';
	
	for(var i=0;i<len;i++){	
		lnk=rec[i].lnk;
		slika=rec[i].slika;
		naziv=rec[i].naziv;
		cijena=rec[i].cijena;
		sadrzaj=rec[i].sadrzaj;
		autori=rec[i].autori;
				
		artdiv +='<div class="col-xs-4 col-sm-4 col-md-2 col-lg-2">';
		artdiv +=	'<div class="thumbnail">';
		artdiv +=		'<div class="img-responsive" style="horizontal-align: middle;">';
		artdiv +=			'<a id="nav" href="'+lnk+'" target="#mainDiv"> <img  src="' + slika + '" class="img-responsive" align="middle"/> </a>';
		artdiv +=			'<div class="caption">';
		artdiv +=				'<h4>'+naziv+'</h4>';
		artdiv +=				'<div>Cijena (kn):'+cijena +'</div>';
		artdiv +=			'</div>';
		artdiv +=			'<div><button class="buy" datarow="'+i+'">Izbor</button></div>';
		artdiv +=		'</div>';
		artdiv +=	'</div>';
		artdiv +='</div>';
	}

	celldiv+=artdiv;
	celldiv += '</div>';
	
	return celldiv;
};

//----------------------------------------------------------------------
var PokaziArtikle=function(){
  if(data_loaded){
	var cells=RenderCell();
	ReplaceDiv("#mainDiv",cells);
	setButtons();
  }else{
	 setTimeout(PokaziArtikle, 300);  
  }
};


//----------------------------------------------------------------------
//---- RUN
//----------------------------------------------------------------------

postaviNot(); // postavi prozor za prikaz poruka

if(sessionStorage.getItem( "total")===null){
	createCart(cart);	
}

itemsInCart=BrojiCartItems();
total=parseFloat(sessionStorage.getItem( "total")); 

$("#brojArt").html(itemsInCart);

PokaziArtikle();

}); // ---end
