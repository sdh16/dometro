/*
 *  Project: Domoticz plugin
 *  Description: library of functions that use the Domoticz API for use with JQuery projects
 *  Author: Original by Sander Filius. Adapted for Metro Theme by sdh16
 *  License: MIT
 *
 *  Implemented:
 *  
 *  uservariables by CopyCatz (very awesome & great improvement to Domoticz!)
 *  
 *
 */
 
;(function ( $, window, document, undefined ){
  //Settings
  
  /* Get the rows which are currently selected */
  fnGetSelected =function( oTableLocal )
  {
    return oTableLocal.$('tr.row_selected');
  }
  
  ShowNotify = function(txt, timeout, iserror)
  {
	  $("#notification").html('<p>' + txt + '</p>');
	
	  if (typeof iserror != 'undefined') {
		  $("#notification").css("background-color","red");
	  } else {
		  $("#notification").css("background-color","#204060");
	  }
	  $("#notification").center();
	  $("#notification").fadeIn("slow");

	  if (typeof timeout != 'undefined') {
		  setTimeout(function() {
			  HideNotify();
		  }, timeout);
	  }
  }

  HideNotify = function()
  {
	  $("#notification").hide();
  }

  
  DeleteVariable = function(idx)
  {
	  confirm("Are you sure you want to remove this variable?", function(result) {
		  if (result==true) {
			  $.ajax({
				  url: "json.htm?type=command&param=deleteuservariable&idx=" + idx,
				  async: false, 
				  dataType: 'json',
				  success: function(data) {
					  RefreshUserVariablesTable();
				  }
			  });
		  }
	  });
  }
	

  AddLink = function(type)
  {
	  var idx = $.userVariableIdx;
	  var uservariablename = $('#uservariablesedittable #uservariablename').val();
	  var uservariabletype = $('#uservariablesedittable #uservariabletype option:selected').val();
	  var uservariablevalue = $('#uservariablesedittable #uservariablevalue').val();
	
	  if((type=="a") && (jQuery.inArray(uservariablename,$.varNames) != -1)){
		  ShowNotify('Variable name already exists!', 2500, true);
	  }
	  else {
		  if (type == "a") {
			  var url = "/json.htm?type=command&param=saveuservariable&vname=" + uservariablename + "&vtype=" + uservariabletype + "&vvalue=" + uservariablevalue;
		  }
		  else if (type == "u") {
			  var url = "/json.htm?type=command&param=updateuservariable&idx=" + idx + "&vname=" + uservariablename + "&vtype=" + uservariabletype + "&vvalue=" + uservariablevalue;
		  }
		
		  $.ajax({
			   url: url, 
			   async: false, 
			   dataType: 'json',
			   success: function(data) {
				  if (typeof data != 'undefined') {
					  if (data.status=="OK") {
						  alert('User variable saved');
						  RefreshUserVariablesTable();
						  $('#uservariablesedittable #uservariablename').val("");
						  $('#uservariablesedittable #uservariablevalue').val("");
						  $('#uservariablesedittable #uservariabletype').val("0");
					  }
					  else {
						  ShowNotify(data.status, 2500, true);
					  }
				  }
			   },
			   error: function(){
					  ShowNotify('Problem saving user variable!', 2500, true);
			   }     
		  });
	  }
		
  }
	
	
  RefreshUserVariablesTable = function()
  {
    $('#modal').show();

	  $('#uservariablesedittable #uservariableupdate').attr("class", "button-dis");
	  $('#uservariablesedittable #uservariabledelete').attr("class", "button-dis");

    $.varNames = [];	
    var oTable = $('#uservariablestable').dataTable();
    oTable.fnClearTable();
    $.ajax({
       url: "/json.htm?type=command&param=getuservariables",
       async: false, 
       dataType: 'json',
       success: function(data) {   
        if (typeof data.result != 'undefined') {
          $.each(data.result, function(i,item){
			  $.varNames.push(item.Name);
			  var typeWording;
			  switch( item.Type ) {
				  case "0" :
					  typeWording = 'Integer';
					  break;
				  case "1" :
					  typeWording = 'Float';
					  break;
				  case "2" :
					  typeWording = 'String';
					  break;					
				  case "3" :
					  typeWording = 'Date';
					  break;				
				  case "4" :
					  typeWording = 'Time'
					  break;
				  case "5" :
					  typeWording = 'DateTime';
					  break;
				  default:
					  typeWording = "undefined";
			  }
			  var addId = oTable.fnAddData( {
				  "DT_RowId": item.idx,
				  "DT_ItemType": item.Type,
				  "0": item.Name,
				  "1": typeWording,
				  "2": item.Value,
				  "3": item.LastUpdate
			  } );
          });
	    }
       }
    });
    $('#modal').hide();
  }


  ShowUserVariables = function()
  {
	  var oTable = $('#uservariablestable').dataTable( {
	    "sDom": '<"H"lfrC>t<"F"ip>',
	    "oTableTools": {
		  "sRowSelect": "single",
	    },
	    "fnDrawCallback": function (oSettings) {
          var nTrs = this.fnGetNodes();
          $(nTrs).click(
			  function(){
				  $(nTrs).removeClass('row_selected');
				  $(this).addClass('row_selected');
				  $('#uservariablesedittable #uservariableupdate').attr("class", "bg-darkRed fg-white");
				  $('#uservariablesedittable #uservariabledelete').attr("class", "bg-darkRed fg-white");
				  var anSelected = fnGetSelected( oTable );
				  if ( anSelected.length !== 0 ) {
					  var data = oTable.fnGetData( anSelected[0] );
					  var idx= data["DT_RowId"];
					  $.userVariableIdx=idx;	
					  $("#uservariablesedittable #uservariableupdate").attr("href", "javascript:AddLink('u')");
					  $("#uservariablesedittable #uservariabledelete").attr("href", "javascript:DeleteVariable(" + idx + ")");
					  $("#uservariablesedittable #uservariablename").val(data["0"]);
					  $("#uservariablesedittable #uservariabletype").val(data["DT_ItemType"]);
					  $("#uservariablesedittable #uservariablevalue").val(data["2"]);
				  }
		  });
	    },    
	    "aaSorting": [[ 0, "desc" ]],
	    "bSortClasses": false,
	    "bProcessing": true,
	    "bStateSave": true,
	    "bJQueryUI": true,
	    "iDisplayLength" : 10,
	    'bLengthChange': false,
	    "sPaginationType": "full_numbers"
	  } );
	
	  RefreshUserVariablesTable()
  }
  
}(jQuery, window, document));

$(document).ready(function() {
  $.userVariableIdx=0;
	$.varNames = [];
	ShowUserVariables();

});
