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
  
  // get a used device's data
  $.getDevice = function(idx){
    var device = [];
    $.ajax({
      url: '/json.htm?type=devices&rid=' +idx,
      async: false,
      dataType: 'json',
      success: function (json) {
        device = json;
      }
    });
    return device.result;
  }
  
  
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
	  //$("#notification").center();
	  $("#notification").attr("align", "center")
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
	  //confirm("Are you sure you want to remove this variable?", function(result) {
	  var result = confirm("Are you sure you want to remove this variable?")
	  if (result==true) {
		  $.ajax({
			  url: "/json.htm?type=command&param=deleteuservariable&idx=" + idx,
			  async: false, 
			  dataType: 'json',
			  success: function(data) {
				  RefreshUserVariablesTable();
			  }
		  });
	  }
	  //});
  }
	

  AddUpdateVariable = function(type)
  {
	  var idx = $.userVariableIdx;
	  var uservariablename = "vd_" +($('#uservariablesedittable #uservariablename').val());
	  var uservariabletype = 2 //$('#uservariablesedittable #uservariabletype option:selected').val();
	  var uservariablevalue = $('#uservariablesedittable #uservariablevdtype').val() +"," +($('#uservariablesedittable #uservariablevalue').val());
	
	  if((type=="a") && (jQuery.inArray(uservariablename,$.varNames) != -1)){
		  alert('Variable name already exists!', 2500, true);
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
						  $('#uservariablesedittable #uservariablevdtype').val("0");
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
	
  RefreshDevicesComboArray = function()
  {
	  $.usedDevices = [];
	  $("#settings #comboactivedevice").empty();
	  $.ajax({
		  url: "/json.htm?type=devices&used=true", 
		  async: false, 
		  dataType: 'json',
		  success: function(data) {
			  if (typeof data.result != 'undefined') {
				  $.each(data.result, function(i,item) {
					  $.usedDevices.push({
						  type: item.type,
						  idx: item.idx,
						  name: item.Name
					  });
				  });
				  $.each($.usedDevices, function(i,item){
					  var option = $('<option />');
					  option.attr('value', item.idx).text(item.name);
					  $("#settings #comboactivedevice").append(option);
				  });
			  }
		  }
	  });
  }	
	
  RefreshActiveDevicesTable = function(idx)
  {
    $('#modal').show();

    $('#settings #activedevicedelete').toggleClass("disabled")

    var oTable = $('#settings #activetable').dataTable();
    oTable.fnClearTable();
    for(i = 0; i < $.virtualDeviceString.length; i++) {
      var device = $.getDevice($.virtualDeviceString[i])
		  var addId = oTable.fnAddData({
		    "DT_RowId": device[0].idx,
		    //"Order": device.Order,
		    "0": device[0].idx,
		    "1": device[0].Name,
		  });
		}
    
	  /* Add a click handler to the rows - this could be used as a callback */
	  $("#settings #activetable tbody").off();
	  $("#settings #activetable tbody").on( 'click', 'tr', function () {
		  if ( $(this).hasClass('row_selected') ) {
			  $(this).removeClass('row_selected');
			  $('#settings #activedevicedelete').toggleClass("disabled");
		  }
		  else {
			  var oTable = $('#settings #activetable').dataTable();
			  oTable.$('tr.row_selected').removeClass('row_selected');
			  $(this).addClass('row_selected');
			  $('#settings #activedevicedelete').toggleClass("disabled");
			
			  var anSelected = fnGetSelected( oTable );
			  if ( anSelected.length !== 0 ) {
				  var data = oTable.fnGetData( anSelected[0] );
				  var idx= data["DT_RowId"];
				  //alert(idx)
				  $("#settings #activedevicedelete").attr("onClick", "DeleteActiveDevice(" + idx + ")");
			  }
		  }
	  }); 

    $('#modal').hide();
  }
  
  AddActiveDevice = function()
  {
	  if ($.devIdx==-1) {
		  alert('No Vierual Device Selected!');
		  return;
	  }
	
    var ActiveDeviceIdx=$("#settings #comboactivedevice option:selected").val();
    $.virtualDeviceString.push(ActiveDeviceIdx)
	  RefreshActiveDevicesTable();
 	  RefreshUserVariables();
 

  }

  DeleteActiveDevice = function(idx)
  {
	  var result = confirm("Are you sure to delete this Active Device?\n\nThis action can not be undone...")
	  if (result==true) {
      var index = $.virtualDeviceString.indexOf(idx.toString())
      $.virtualDeviceString.splice(index,1)
	    RefreshActiveDevicesTable();
	    RefreshUserVariables();
	  }
  }	
	
  RefreshUserVariablesTable = function()
  {
    $('#modal').show();
    $('#uservariablesedittable #uservariableupdate').toggleClass("disabled");
    $('#uservariablesedittable #uservariabledelete').toggleClass("disabled");

    $.varNames = [];	
    var oTable = $('#Variables-table').dataTable();
    oTable.fnClearTable();
    $.ajax({
       url: "/json.htm?type=command&param=getuservariables",
       async: false, 
       dataType: 'json',
       success: function(data) {   
        if (typeof data.result != 'undefined'){
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
			      var addId = oTable.fnAddData({
				      "DT_RowId": item.idx,
				      "DT_ItemType": item.Type,
				      "0": item.Name,
				      "1": typeWording,
				      "2": item.Value,
				      "3": item.LastUpdate
			      });
          });
	      }
       }
    });
    $('#modal').hide();
  }

  RefreshUserVariables = function()
  {
            var deviceIdx = ""
            for(i = 0; i < $.virtualDeviceString.length; i++) {
              deviceIdx = deviceIdx + $.virtualDeviceString[i] +"," 
            }
            deviceIdx = deviceIdx.substr(0, deviceIdx.length -1)
            $("#uservariablesedittable #uservariablevalue").val(deviceIdx)  
  }
  
  ShowUserVariables = function()
  {
    var oTable = $('#Variables-table').dataTable({
      //"sDom": '<"H"lfrC>t<"F"ip>',
      //"oTableTools": {
      //  "sRowSelect": "single",
      //},
      "fnDrawCallback": function (oSettings){
        var nTrs = this.fnGetNodes();
        $(nTrs).click(function(){
          $(nTrs).removeClass('row_selected');
          //$(nTrs).removeClass('selected');
          $(this).addClass('row_selected');
          //$(this).addClass('selected');
          $('#uservariablesedittable #uservariableupdate').toggleClass("disabled")
          $('#uservariablesedittable #uservariabledelete').toggleClass("disabled")
          var anSelected = fnGetSelected( oTable );
          if ( anSelected.length !== 0 ){
            var data = oTable.fnGetData( anSelected[0] );
            var idx= data["DT_RowId"];
            $.devIdx=idx;
            $.userVariableIdx=idx;	
            $("#uservariablesedittable #uservariableupdate").attr("onClick", "AddUpdateVariable('u')");
            $("#uservariablesedittable #uservariabledelete").attr("onClick", "DeleteVariable(" + idx + ")");
            $("#uservariablesedittable #uservariablename").val(data["0"].split('_')[1]);
            //$("#uservariablesedittable #uservariabletype").val(data["DT_ItemType"]);
            //$("#uservariablesedittable #uservariablevalue").val(data["2"]);
            $("#uservariablesedittable #uservariablevdtype").val(data["2"].split(",")[0]);
            $.virtualDeviceString = data["2"].split(",");
            $.virtualDeviceString.splice(0,1);
            var deviceIdx = ""
            for(i = 0; i < $.virtualDeviceString.length; i++){
              deviceIdx = deviceIdx + $.virtualDeviceString[i] +"," 
            }
            deviceIdx = deviceIdx.substr(0, deviceIdx.length -1)
            $("#uservariablesedittable #uservariablevalue").val(deviceIdx)
            RefreshActiveDevicesTable(idx);

          }
        });
      },    
      //"aaSorting": [[ 0, "desc" ]],
      //"bSortClasses": false,
      //"bProcessing": true,
      //"bStateSave": true,
      //"bJQueryUI": true,
      //"iDisplayLength" : 10,
      //'bLengthChange': false,
      //"sPaginationType": "full_numbers"
    });
    RefreshUserVariablesTable()    
  }
  


  ShowSettingsPage = function()
  {
    $("<table></table>")
      .attr("id", "Variables-table")
      .appendTo("#settings")
      .addClass("table table-bordered table-hovered dataTable")
      .attr("border","0")
      .attr("cellpadding","0")
      .attr("cellspacing","20")
    
    $("<thead><thead")
      .attr("id","Variables-table-thead")
      .appendTo("#Variables-table")
      .addClass("text-left")
    $("<tr><tr")
      .attr("id","Variables-table-thead-row")
      .appendTo("#Variables-table-thead")
    $("<th></th")
      .appendTo("#Variables-table-thead-row")
      .text("Variable name")
      .attr("width", "240")
      .attr("align", "left")
    $("<th></th")
      .appendTo("#Variables-table-thead-row")
      .text("Variable type")
      .attr("width", "150")
      .attr("align", "left")
    $("<th></th")
      .appendTo("#Variables-table-thead-row")
      .text("Current value")
      .attr("width", "240")
      .attr("align", "left")
    $("<th></th")
      .appendTo("#Variables-table-thead-row")
      .text("Last update")
      .attr("width", "200")
      .attr("align", "left")
    $("<tbody></tbody")
      .attr("id","Variables-table-tbody")
      .appendTo("#Variables-table")    
      
    $("<h2></h2>")
    .attr("id", "Devices-list")
    .appendTo("#settings")
    .text("Devices:")
    $("<p></p>")
    .appendTo("#Devices-list")
    .text("(Select Virtual Device first to Edit...)")
    $("<table></table>")
      .attr("id", "activetable")
      .appendTo("#settings")
      .addClass("table table-bordered table-hover table-condensed dataTable")
    $("<thead><thead")
      .attr("id","activetable-thead")
      .appendTo("#activetable")
      .addClass("text-left")
    $("<tr><tr")
      .attr("id","activetable-thead-row")
      .appendTo("#activetable-thead")
    $("<th></th>")
      .appendTo("#activetable-thead-row")
      .text("Idx")
      .attr("width", "75")
      .attr("align", "left")
    $("<th></th>")
      .appendTo("#activetable-thead-row")
      .text("Name")
      .attr("width", "250")
      .attr("align", "left")  
    $("<tbody></tbody")
      .attr("id","activetable-tbody")
      .appendTo("#activetable")    
        
    $("<table></table>")
      .attr("id", "activetable-actions")
      .appendTo("#settings")
      .addClass("table")
    $("<tr><tr")
      .attr("id","activetableactions")
      .appendTo("#activetable-actions")      
    $("<td><td")
      .attr("id","activetableactionstd")
      .appendTo("#activetableactions")
      .attr("colspan", "2")
    $("<button><button")
      .attr("id","activedevicedelete")
      .appendTo("#activetableactionstd")
      .attr("type", "button")
      .addClass("btn btn-primary disabled")
      .text("Delete")        

    $("<h2></h2>")
    .attr("id", "Device-list")
    .appendTo("#settings")
    .text("Add New Device:")
    $("<table></table>")
      .attr("id", "activeparamstable")
      .appendTo("#settings")
      .addClass("table")
    $("<tr><tr")
      .attr("id","activeparamstablerow")
      .appendTo("#activeparamstable")      
    $("<td><td")
      .attr("id","activeparamstablerowtd")
      .appendTo("#activeparamstablerow")
      .attr("align", "left")
      .attr("style", "width:200px")
    $("<label><label")
      .appendTo("#activeparamstablerowtd")
      .attr("align", "left")
      .attr("width", "240")
      .text("Device:")
    $("<select><select")
      .attr("id","comboactivedevice")
      .appendTo("#activeparamstablerowtd")
      .attr("style", "width:500px")
      .addClass("combobox ui-corner-all")
    $("<button><button")
      .appendTo("#activeparamstablerowtd")
      .attr("onclick","AddActiveDevice();")
      .attr("type", "button")
      .addClass("btn btn-primary")
      .text("Add")

    $("<h2></h2>")
    .attr("id", "Edit-variables")
    .appendTo("#settings")
    .text("Edit Virtual Device")
    
    $("<table></table>")
      .attr("id", "uservariablesedittable")
      .appendTo("#settings")
      .addClass("table")
      
    $("<tr><tr")
      .attr("id","uservariablenamerow")
      .appendTo("#uservariablesedittable")      
    $("<td><td")
      .attr("id","uservariablenamelabel")
      .appendTo("#uservariablenamerow")
      .attr("align", "right")
      .attr("style", "width:200px")
    $("<label><label>")
      .appendTo("#uservariablenamelabel")
      .attr("for", "uservariablename")
      .text("Virtual Device Name:")
    $("<td><td")
      .attr("id","uservariablenameinput")
      .appendTo("#uservariablenamerow")
    $("<input><input")
      .attr("id","uservariablename")
      .appendTo("#uservariablenameinput")
      .attr("style", "width: 250px; padding: .2em;")
      .addClass("text ui-widget-content ui-corner-all")
      
    $("<tr><tr")
      .attr("id","uservariablevdtyperow")
      .appendTo("#uservariablesedittable")      
    $("<td><td")
      .attr("id","uservariablevdtypelabel")
      .appendTo("#uservariablevdtyperow")
      .attr("align", "right")
      .attr("style", "width:200px")
    $("<label><label>")
      .appendTo("#uservariablevdtypelabel")
      .attr("for", "uservariablevdtype")
      .text("Virtual Device Type: ")
    $("<td><td")
      .attr("id","uservariablevdtypeinput")
      .appendTo("#uservariablevdtyperow")
    $("<input><input")
      .attr("id","uservariablevdtype")
      .appendTo("#uservariablevdtypeinput")
      .attr("style", "width: 250px; padding: .2em;")
      .addClass("text ui-widget-content ui-corner-all")
/*
    $("<tr><tr")
      .attr("id","uservariabletyperow")
      .appendTo("#uservariablesedittable")      
    $("<td><td")
      .attr("id","uservariabletypelabel")
      .appendTo("#uservariabletyperow")
      .attr("align", "right")
      .attr("style", "width:200px")
    $("<label><label>")
      .appendTo("#uservariabletypelabel")
      .text("Variable type:")
    $("<td><td")
      .attr("id","uservariabletypeselect")
      .appendTo("#uservariabletyperow")
    $("<select><select")
      .attr("id","uservariabletype")
      .appendTo("#uservariabletypeselect")
      .attr("style", "width: 250px; padding: .2em;")
      .addClass("text ui-widget-content ui-corner-all")
    $("<option><option")
      .appendTo("#uservariabletype")
      .attr("value", "0")
      .text("Integer")
    $("<option><option")
      .appendTo("#uservariabletype")
      .attr("value", "1")
      .text("Float")
    $("<option><option")
      .appendTo("#uservariabletype")
      .attr("value", "2")
      .text("String")
    $("<option><option")
      .appendTo("#uservariabletype")
      .attr("value", "3")
      .text("Date")
    $("<option><option")
      .appendTo("#uservariabletype")
      .attr("value", "4")
      .text("Time")
*/

    $("<tr><tr")
      .attr("id","uservariablevaluerow")
      .appendTo("#uservariablesedittable")      
    $("<td><td")
      .attr("id","uservariablevaluelabel")
      .appendTo("#uservariablevaluerow")
      .attr("align", "right")
      .attr("style", "width:200px")
    $("<label><label>")
      .appendTo("#uservariablevaluelabel")
      .text("Included devices:")
    $("<td><td")
      .attr("id","uservariablevalueinput")
      .appendTo("#uservariablevaluerow")
    $("<input><input")
      .attr("id","uservariablevalue")
      .appendTo("#uservariablevalueinput")
      .attr("style", "width: 250px; padding: .2em;")
      .addClass("text ui-widget-content ui-corner-all")

    //$("<table></table>")
    //  .attr("id", "uservariablesedittable-actions")
    //  .appendTo("#settings")
    //  .addClass("table")
    $("<tr><tr")
      .attr("id","uservariableactions")
      //.appendTo("#uservariablesedittable-actions")  
      .appendTo("#uservariablesedittable")    
    $("<td><td")
      .attr("id","uservariableactionstd")
      .appendTo("#uservariableactions")
      .attr("colspan", "2")
    $("<button><button")
      .appendTo("#uservariableactionstd")
      .attr("onclick","AddUpdateVariable('a');")
      .attr("type", "button")
      .addClass("btn btn-primary")
      .text("Add")
    $("<button><button")
      .attr("id","uservariableupdate")
      .appendTo("#uservariableactionstd")
      .attr("type", "button")
      .addClass("btn btn-primary")
      .text("Update")
    $("<button><button")
      .attr("id","uservariabledelete")
      .appendTo("#uservariableactionstd")
      .attr("type", "button")
      .addClass("btn btn-primary")
      .text("Delete")
    $("<tr><tr>")
      .appendTo("#uservariablesedittable-actions")  
      
  }          

}(jQuery, window, document));

$(document).ready(function() {
  $.userVariableIdx=0;
  $.varNames = [];
  $.virtualDeviceString = [];
  ShowSettingsPage();
  RefreshDevicesComboArray()  
  ShowUserVariables();
});
