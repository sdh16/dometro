/*
 *  Project: Domoticz plugin
 *  Description: library of functions that use the Domoticz API for use with JQuery projects
 *  Author: Original by Sander Filius. Adapted for Metro Theme by sdh16
 *  License: MIT
 *
 *	Implemented:
 *	
 *	uservariables by CopyCatz (very awesome & great improvement to Domoticz!)
 *	
 *
 */
 
 ;(function ( $, window, document, undefined ){
 
 // Functions for the API
 
 	// get active tabs
 	$.getActiveTabs = function() {
 	 var activeTabs = [];
 	 
 	 $.ajax({
  			url: '/json.htm?type=command&param=getactivetabs',
  			async: false,
  			dataType: 'json',
  			success: function (json) {		
	  		activeTabs = json;
	  		}
	  	});
	  return activeTabs;
 	 }
  
 	// get all used devices
 	 $.getUseddevices = function(){
 	 var usedDevices = [];
 	 
 	 $.ajax({
  			url: '/json.htm?type=devices&used=true',
  			async: false,
  			dataType: 'json',
  			success: function (json) {
	  		usedDevices = json;
	  		}
	  	});
	  return usedDevices;
 	 }

 	// get a used device's data
 	 $.getDevice = function(idx){
 	 var device = [];
 	 
 	 $.ajax({
  			url: '/json.htm?type=devices&rid=' + idx,
  			async: false,
  			dataType: 'json',
  			success: function (json) {
	  		device = json;
	  		}
	  	});
	  return device.result;
 	 }




 	//get all uservariables return as array
	 $.getUservariables = function() {
		var userVariables = [];
		
		$.ajax({
  			url: '/json.htm?type=command&param=getuservariables',
  			async: false,
  			dataType: 'json',
  			success: function (json) {
	  		userVariables = json;
	  		}
	  	});
	  	
	return userVariables;
	}

	// get specified uservariable, return as array
 	$.getUservariable = function(idx) {
		var userVariable = [];
		
		$.ajax({
  			url: '/json.htm?type=command&param=getuservariable&idx='+idx,
  			async: false,
  			dataType: 'json',
  			success: function (json) {
	  		userVariable = json;
	  		}
	  	});
	  return userVariable;
	  }
	  
 	// try to save a variable & return results as object
	/* 	0 = Integer, e.g. -1, 1, 0, 2, 10  
	*		1 = Float, e.g. -1.1, 1.2, 3.1
	*		2 = String
	*		3 = Date in format DD/MM/YYYY
	*		4 = Time in 24 hr format HH:MM
	*/		
	$.saveUservariable = function(vname, vtype, vvalue){
		  var result = [];
		
		$.ajax({
  			url: '/json.htm?type=command&param=saveuservariable&vname='+vname+'&vtype='+vtype+'&vvalue='+vvalue,
  			async: false,
  			dataType: 'json',
  			success: function (json) {
	  		result = json;
	  		}
	  	});

	  return result;
	  }

	//try to update a variable & return results as object
	$.updateUservariable = function(idx, vname, vtype, vvalue){
		var result = [];
	
		$.ajax({
  			url: '/json.htm?type=command&param=updateuservariable&idx='+idx+'&vname='+vname+'&vtype='+vtype+'&vvalue='+vvalue,
  			async: false,
  			dataType: 'json',
  			success: function (json) {
	  		result = json;
	  		}
	  	});

	  return result;
}

	//	try to delete a variable, print results to console & return results as object
	$.deleteUservariable = function(idx){
		var result = [];
	
		$.ajax({
  			url: '/json.htm?type=command&param=deleteuservariable&idx='+idx,
  			async: false,
  			dataType: 'json',
  			success: function (json) {
	  		result = json;
	  		}
	  	});

	  	return result;
}

// Funtions for the webinterface
	
	// fix forecastIO implementation ;)
	function FixForecastIO(ForecastStr){
 var a = new Date();
 
 var icon ="";
     
     var hour = a.getHours();
          
	if (ForecastStr == "Rain") {
		icon = icon+"rain";
	}
     
        if (ForecastStr == "Cloudy") {
		icon = icon+"partly-cloudy-";
	}
     
        if (ForecastStr == "Partly Cloudy") {
		icon = icon+"partly-cloudy-";
	}
	
	if (ForecastStr == "Sunny") {
		icon = icon+"clear-";
	}

     // my poor definition of 'night' :P
	if (hour >= 0 && hour <= 6 && ForecastStr != "Rain") {
		icon = icon +"night";
	}
     
     // my poor defintion of 'day' :P
	if (hour >= 7 && hour <= 23 && ForecastStr != "Rain") {
		var icon = icon +"day";
	}
     
     return icon;
 }

	//return all variables in an easy objects: name = array, name = idx
	//need to have the names & the idx's arond, want to minimize the for.Eache's, so this seems easy :P
	// very sucky functions, needs fixing
	getDomoticzVariables = function(){
	
	// change
		domoticzUserVariables = $.getUservariables()
		if (!domoticzUserVariables.result.framb0ise_widgets){$.saveUservariable("framb0ise_widgets", 2, "{widgets:0}")}
	// change
		
		domoticzval = {};
		domoticzidx = {};
		
		var variables = $.getUservariables();
		if (variables.result != undefined){
		variables.result.forEach(function(value,key){
			domoticzval[value.Name] = value.Value;
			domoticzidx[value.Name] = value.idx;
			})
			}
	
	//defaults
	
	if (!domoticzval.framb0ise_theme){$.saveUservariable("framb0ise_theme", 0, 0)}
	
	return domoticzval;
	return domoticzidx;
	}
	
	// create some tabs & influence order then merge them
	createDomoticzTabs = function(){
		
		
		var myTabs ={}
		var domoTabs = $.getActiveTabs()

		// second call, buggy json :(
		domoTabs = $.getActiveTabs()
		
		myTabs.Setup = 0
		myTabs.Links = 0
		myTabs.Dashboard = 1
		myTabs.Rooms = 0
		myTabs.Magic = 0
		
				

		var activeTabs = $.extend({}, myTabs, domoTabs.result) 
		
		$.map(activeTabs,function(value,index){
				
		if (value == "1"){
			var tabid = index.replace("Enable", "")
			var tabtext = index.replace("EnableTab", "")
			if(!$("#"+tabid).length){
				tabid = index.replace("Enable", "")
				tabtext = index.replace("EnableTab", "")
				
				switch(tabtext){
					
					case "Setup":
					var tabclass = "icon-tools"
					break;
					
					case "Links":
					var tabclass = "icon-link"
					break;
					
					case "Dashboard":
					var tabclass = "icon-dashboard"
					break;
					
					case "Rooms":
					var tabclass = "fa fa-th-large"
					break;
					
					case "Magic":
					var tabclass = "fa fa-magic"
					break;
					
					case "Lights":
					var tabclass = "fa fa-power-off"
					break;
					
					case "Scenes":
					var tabclass = "fa fa-list-alt"
					break;
					
					case "Temp":
					var tabclass = "icon-thermometer-2"
					break;
					
					case "Utility":
					var tabclass = "icon-home"
					break;
					
					case "Weather":
					var tabclass = "icon-weather"
					break;
					
					default:
					var tabclass = "icon-question"
					break
					
				}
				
						
				$("<li></li>")
					.attr("id",tabid)
					.appendTo("#tabs")
					
				$("<a></a>")
					.appendTo("#"+tabid)
					.attr("href", "#tab-"+tabtext)
					.attr("data-toggle", "tab")
					.attr("title", tabtext)
					.addClass(tabclass)
					
				$("<div></div>")
					.attr("id", "tab-"+tabtext)
					.appendTo("#tab-content")
					.addClass("container tab-pane")
							
				$("<div></div>")
					.attr("id", tabtext+"-row")
					.appendTo("#tab-"+tabtext)
					.addClass("row container")
			
				$("<div></div>")
					.attr("id", tabtext + "-col-1")
					.appendTo("#"+tabtext +"-row")
					.addClass("col-md-3")
		
				$("<div></div>")
					.attr("id", tabtext + "-col-2")
					.appendTo("#"+ tabtext + "-row")
					.addClass("col-md-3")
		
				$("<div></div>")
					.attr("id", tabtext + "-col-3")
					.appendTo("#" +tabtext +"-row")
					.addClass("col-md-3")
				
				$("<div></div>")
					.attr("id", tabtext + "-col-4")
					.appendTo("#" +tabtext +"-row")
					.addClass("col-md-3")	
			
			}
	
	
		}
			
		})

		
	}
	
	// update Setup
	updateDomoticzSetup = function(){
	getDomoticzVariables();
	
		var SetupTabs = {}
		SetupTabs.Main = 1
		SetupTabs.Variables = 1
		SetupTabs.Links = 0
		SetupTabs.Magic = 1
		SetupTabs.Devices = 1

	
	$("<ul></ul>")
		.attr("id","setup-tabs")
		.attr("role","tablist")
		.addClass("nav nav-tabs")
		.appendTo("#Setup-row")
	
	$("<div></div>")
		.attr("id","setup-tabs-content")
		.addClass("tab-content")
		.appendTo("#Setup-row")
	
	$.map(SetupTabs,function(value,index){
		if (value == "1"){
		
	$("<li></li>")
		.attr("id", index+"-setup-tab")
		.appendTo("#setup-tabs")
		
	$("<a></a>")
		.appendTo("#" + index + "-setup-tab")
		.attr("href","#" + index+"-setup-tab-content")
		.attr("data-toggle", "tab")
		.text(index)
		
	$("<div></div>")
		.attr("id", index + "-setup-tab-content")
		.addClass("tab-pane spaced")
		.appendTo("#setup-tabs-content")
	
				$("<div></div>")
					.attr("id", index+"-row")
					.appendTo("#" + index + "-setup-tab-content")
					.addClass("row")
			
				$("<div></div>")
					.attr("id", index + "-col-1")
					.appendTo("#"+ index +"-row")
					.addClass("col-md-3")
		
				$("<div></div>")
					.attr("id", index + "-col-2")
					.appendTo("#"+ index + "-row")
					.addClass("col-md-3")

				$("<div></div>")
					.attr("id", index + "-col-3")
					.appendTo("#" + index +"-row")
					.addClass("col-md-3")
				
				$("<div></div>")
					.attr("id", index + "-col-4")
					.appendTo("#" + index +"-row")
					.addClass("col-md-3")		
				
		}
	})
		

// uservars
			$("<button></button>")
				.attr("id","Variables-refresh-button")
				.appendTo("#Variables-col-1")
				.text("refresh")
				.addClass("btn btn-primary btn-xs")
				.click(function(){refreshVariablesTable()})
		
			$("<table></table>")
				.attr("id", "Variables-setup-table-1")
				.appendTo("#Variables-setup-tab-content")
				.addClass("table table-condensed")
			
			$("<thead><thead")
				.attr("id","Variables-setup-thead-1")
				.appendTo("#Variables-setup-table-1")
			
			$("<th></th>")
				.appendTo("#Variables-setup-thead-1")
				.text("idx")
			$("<th></th>")
				.appendTo("#Variables-setup-thead-1")
				.text("Variable name")
			$("<th></th>")
				.appendTo("#Variables-setup-thead-1")
				.text("Variable type")
			$("<th></th>")
				.appendTo("#Variables-setup-thead-1")
				.text("Current value")
			$("<th></th>")
				.appendTo("#Variables-setup-thead-1")
				.text("Last update")
			


		refreshVariablesTable = function(){
			var userVariables = $.getUservariables()
			
			$("#Variables-setup-table-1 > tbody").remove()	

			$("<tbody></tbody")
				.attr("id","Variables-setup-tbody-1")
				.appendTo("#Variables-setup-table-1")

			userVariables.result.forEach(function(value, index){
				
				$("<tr></tr>")
					.attr("id","Variables-setup-row"+index)
					.appendTo("#Variables-setup-tbody-1")
				$("<td></td>")
					.appendTo("#Variables-setup-row"+index)
					.text(value.idx)
				$("<td></td>")
					.appendTo("#Variables-setup-row"+index)
					.text(value.Name)
				$("<td></td>")
					.appendTo("#Variables-setup-row"+index)
					.text(value.Type)
				$("<td></td>")
					.appendTo("#Variables-setup-row"+index)
					.text(value.Value)
				$("<td></td>")
					.appendTo("#Variables-setup-row"+index)
					.text(value.LastUpdate)
			})
		
		}

// device list
			$("<button></button>")
				.attr("id","Devices-refresh-button")
				.appendTo("#Devices-col-1")
				.text("refresh")
				.addClass("btn btn-primary btn-xs")
				.click(function(){refreshDevicesTable()})
		
			$("<table></table>")
				.attr("id", "Devices-setup-table-1")
				.appendTo("#Devices-setup-tab-content")
				.addClass("table table-condensed")
			
			$("<thead><thead")
				.attr("id","Devices-setup-thead-1")
				.appendTo("#Devices-setup-table-1")
			
			$("<th></th>")
				.appendTo("#Devices-setup-thead-1")
				.text("idx")
			$("<th></th>")
				.appendTo("#Devices-setup-thead-1")
				.text("Device name")
			$("<th></th>")
				.appendTo("#Devices-setup-thead-1")
				.text("Device type")
			$("<th></th>")
				.appendTo("#Devices-setup-thead-1")
				.text("Current value")
			$("<th></th>")
				.appendTo("#Devices-setup-thead-1")
				.text("Last update")

		refreshDevicesTable = function(){
			var devices = $.getUseddevices()
			
			$("#Devices-setup-table-1 > tbody").remove()	

			$("<tbody></tbody")
				.attr("id","Devices-setup-tbody-1")
				.appendTo("#Devices-setup-table-1")

			devices.result.forEach(function(value,index){

				
				$("<tr></tr>")
					.attr("id","Devices-setup-row"+index)
					.appendTo("#Devices-setup-tbody-1")
				$("<td></td>")
					.appendTo("#Devices-setup-row"+index)
					.text(value.idx)
				$("<td></td>")
					.appendTo("#Devices-setup-row"+index)
					.text(value.Name)
				$("<td></td>")
					.appendTo("#Devices-setup-row"+index)
					.text(value.Type)
				$("<td></td>")
					.appendTo("#Devices-setup-row"+index)
					.text(value.Data)
				$("<td></td>")
					.appendTo("#Devices-setup-row"+index)
					.text(value.LastUpdate)
			})
		
		}

// themewatch

			$("<div></div>")
				.attr("id", "Main-setup-panel-1")
				.appendTo("#Main-col-1")
				.addClass("item-group")
			
			$("<a></a>")
				.appendTo("#Main-setup-panel-1")
				.addClass("list-group-item active text-center")
				.text("Theme")
			
			$("<a></a>")
				.attr("id", "Main-setup-panel-body")
				.appendTo("#Main-setup-panel-1")
				.addClass("list-group-item")
	
			$("<select/>")
				.attr("id", "themes")
				.addClass("spaced")
				.appendTo("#Main-setup-panel-body")
			
	// get & fill the select
	$.get("http://api.bootswatch.com/3/", function (data) {
		var themes = data.themes
		
		themes.forEach(function(value, index){
			
			$('#themes').append($("<option/>", {
				value: index,
				text: value.name
			}));
		})

$("#themes").change(function(){
	
	$.get("http://api.bootswatch.com/3/", function (data){
		var themes = data.themes
		var theme = themes[$("#themes").val()];
		$("#bootswatch").attr("href", theme.css);
		$.updateUservariable(domoticzidx.framb0ise_theme, "framb0ise_theme", 0, $("#themes").val());
    })	
})	


$("#themes").val(domoticzval.framb0ise_theme).change();	

$('#themes').selectpicker('refresh');

	})

// Magic
var widgets = {}
var widget = {}
var row = []


// create widget

			$("<div></div>")
				.attr("id", "Magic-setup-list-1")
				.appendTo("#Magic-col-1")
				.addClass("list-group")
				
			$("<a></a>")
				.appendTo("#Magic-setup-list-1")
				.addClass("list-group-item active text-center")
				.text("Create Widget")
			
			$("<a></a>")
				.attr("id","Magic-setup-name-row")
				.appendTo("#Magic-setup-list-1")
				.addClass("list-group-item")
			
			$("<input></input>")
				.attr("id","Magic-setup-widget-name")
				.appendTo("#Magic-setup-name-row")
				.addClass("form-control")
				.val("Widget Name")
								
			$( "#Magic-setup-widget-name").change(function() {
  
				$("#Magic-setup-widget-title-text")
					.text($("#Magic-setup-widget-name").val())
  	
				
  
			});




			$("<a></a>")
				.attr("id","Magic-setup-row-row")
				.appendTo("#Magic-setup-list-1")
				.addClass("list-group-item")
			
			$("<input></input>")
				.attr("id","Magic-row-name")
				.appendTo("#Magic-setup-row-row")
				.addClass("form-control")
				.val("Row Text")
				
			$("<a></a>")
				.attr("id","Magic-setup-select1-row")
				.appendTo("#Magic-setup-list-1")
				.addClass("list-group-item")

			$("<select></select")
				.attr("id","Magic-core-device-select")
				.appendTo("#Magic-setup-select1-row")
				.attr("data-live-search","true")
				.attr("title","Select one of your devices")

			var domoticzDevices = $.getUseddevices()
			
			domoticzDevices.result.forEach(function(value,index){
				
			$("#Magic-core-device-select").append($("<option/>",{
				value: value.idx,
				text: value.Name
				}));
			})



			$("#Magic-core-device-select").change(function(){
				$("#Magic-data-device-select").empty()
					
				var domoticzDeviceData = $.getDevice($("#Magic-core-device-select").val())
	
				$.map(domoticzDeviceData[0], function(value, index) {
		
					$("#Magic-data-device-select").append($("<option/>",{
						value: index,
						text: value
					}));
				});
	
				$('#Magic-data-device-select').selectpicker('refresh'); 
			})
			
	
				

			$("<a></a>")
				.attr("id","Magic-setup-select2-row")
				.appendTo("#Magic-setup-list-1")
				.addClass("list-group-item")

			$("<select></select")
				.attr("id","Magic-data-device-select")
				.appendTo("#Magic-setup-select2-row")

			$("<a></a>")
				.attr("id","Magic-setup-button1-row")
				.appendTo("#Magic-setup-list-1")
				.addClass("list-group-item")
				
			$("<button></button")
				.attr("id","Magic-core-device-adddata")
				.appendTo("#Magic-setup-button1-row")
				.addClass("btn btn-primary btn-xs")
				.text("Add")

			$( "#Magic-core-device-adddata" ).click(function() {
				
				$("<a></a>")
					.addClass("list-group-item small")
					.text($("#Magic-row-name").val()+" "+$("#Magic-data-device-select").find(":selected").text())
					.appendTo("#Magic-setup-widget-body")

				row.push({
					name: $("#Magic-row-name").val(),
					idx : $("#Magic-core-device-select").val(),
					value : $("#Magic-data-device-select").val()
				})
	
			  	
  
			});				

// example widget

			$("<div></div>")
				.attr("id", "Magic-setup-widget-list-2")
				.appendTo("#Magic-col-2")
				.addClass("list-group")
			
			$("<a></a>")
				.attr("id","Magic-setup-widget-title-text")
				.addClass("list-group-item 	active text-center")
				.appendTo("#Magic-setup-widget-list-2")
				.text("Widget Name")
			
			$("<div></div>")
				.attr("id","Magic-setup-widget-body")
				.appendTo("#Magic-setup-widget-list-2")
			
			$("<a></a>")
				.attr("id","Magic-setup-button3-row")
				.appendTo("#Magic-setup-widget-list-2")
				.addClass("list-group-item")

			$("<button></button")
				.attr("id","Magic-save-widget")
				.appendTo("#Magic-setup-button3-row")
				.addClass("btn btn-primary btn-xs")
				.text("Save")

//construct widget & save to Domoticz
			$("#Magic-save-widget" ).click(function() {
				
				//fetch fresh values
				domoticzUserVariables = $.getUservariables()
				domoticzUserVariables.result.forEach(function(value, index){
					
					if(value.Name == "framb0ise_widgets"){
						widgets = value.Value
				
						//construct
						widget.name = $("#Magic-setup-widget-name").val()
						widget.rows= row			
						
						//combine
						var newWidgets = $.extend({}, widget, widgets)
						
						newWidgets = JSON.stringify(newWidgets)
						
						$.updateUservariable(value.idx, value.Name, value.Type, newWidgets)
					}
				})
			})

// existing widgets

domoticzUserVariables.result.forEach(function(value, index){
	
	if (value.Name == "framb0ise_widgets"){
		var idx = value.idx
		
		widgets = $.getUservariable(idx)
	}
	
})


			$("<div></div>")
				.attr("id", "Magic-setup-widget-list-3")
				.appendTo("#Magic-col-3")
				.addClass("list-group-item active text-center")
				.text("Widgets")
}

	//update lights
updateDomoticzDashboard = function(){
	timerDashboard = setTimeout(updateDomoticzDashboard, 5000)

	var deviceidx
	var deviceName
	var vdidx
	var col = 1;
	var domoticzUserVariables = $.getUservariables()
	domoticzUserVariables.result.forEach(function(value, index){
		if(value.Name.match(/vd_/)) {
			//var value = value.Value
			vdidx = value.idx
			deviceidx = value.Value.split(",")
			deviceName = value.Name.split('_')[1];

/*
			switch(deviceidx[0]){
			
				// break up categories into Type or SwitchType
				case undefined:
				var category = value.Type.replace(/[_\s]/g, '').replace(/[^a-z0-9-\s]/gi, '');
				//var text = value.Data
				var virtualDeviceName = deviceName.replace(/[_\s]/g, '').replace(/[^a-z0-9-\s]/gi, '');
				break;
		
				default:
				var category = deviceidx[0].replace(/[_\s]/g, '').replace(/[^a-z0-9-\s]/gi, '');
				//var text = value.Data
				var virtualDeviceName = deviceName.replace(/[_\s]/g, '').replace(/[^a-z0-9-\s]/gi, '');
			}
*/			
			var virtualDeviceType = deviceidx[0].replace(/[_\s]/g, '').replace(/[^a-z0-9-\s]/gi, '');
			var virtualDeviceName = deviceName.replace(/[_\s]/g, '').replace(/[^a-z0-9-\s]/gi, '');
		
			// pretty cattegory labels AFTER defining
			switch(virtualDeviceType){

				case "Dimmer":
				var virtualDeviceTypeClass = "icon-settings"
				break;
			
				case "Rain":
				var virtualDeviceTypeClass = "icon-umbrella"
				break;

				case "Blinds":
				var virtualDeviceTypeClass = "fa fa-unsorted"
				break;
			
				case "P1Smartmeter":
				var virtualDeviceTypeClass = "fa fa-tasks"
				break;
			
				case "Wind":
				var virtualDeviceTypeClass = "icon-compass"
				break;
			
				case "Thermostat":
				var virtualDeviceTypeClass = "fa fa-tachometer"
				break;
		
				case "Contact":
				var virtualDeviceTypeClass = "icon-switch"
				break;
			
				case "TempHumidity":
				var virtualDeviceTypeClass = "icon-thermometer-2"
				break;
			
				case "SmokeDetector":
				var virtualDeviceTypeClass = "icon-fire"
				break;
			
				case "OnOff":
				var virtualDeviceTypeClass = "icon-switch-2"
				break;
			
				case "Security":
				var virtualDeviceTypeClass = "icon-shield"
				break;
			
				case "DuskSensor":
				var virtualDeviceTypeClass = "icon-cloud-5"
				break;
			
				case "General":
				var virtualDeviceTypeClass = "ion ion-ios7-pulse-strong"
				break;
			
				case "Usage":
				var virtualDeviceTypeClass = "icon-electricity"
				break;
			
				case "Energy":
				var virtualDeviceTypeClass = "icon-graph"
				break;
			
				case "YouLessMeter":
				var virtualDeviceTypeClass = "icon-home"
				break;
			
				case "TempHumidityBaro":
				var virtualDeviceTypeClass = "icon-sun"
				break;
			
				case "Temp":
				var virtualDeviceTypeClass = "icon-thermometer"
				break;
			
				case "MotionSensor":
				var virtualDeviceTypeClass = "icon-enter"
				break;
			
				case "Lux":
				var virtualDeviceTypeClass = "icon-adjust"
				break;
			
				case "Weather":
				var virtualDeviceTypeClass = "icon-weather"
				break;

				default:
				var virtualDeviceTypeClass = "icon-question"
				break;			
			}
			//Here create a panorama for each virtual device type
			//and add all the virtual devices of that type to it

			// create a tile for each virtual device
			if(!$("#" + virtualDeviceName +"-tile").length) {
				$("<div></div>")
				.attr("id", "metro")
				.appendTo("#tab-Dashboard")
				.addClass("metro")

				// Create the tile for the virtual deivce
				$("<div></div>")
				.attr("id", virtualDeviceName +"-tile")
				.appendTo("#metro")
				//.addClass("tile wide text")
				//some issue with tile wide text, use tile wide image instead as workaround
				.addClass("tile wide image")
				
				// Tile Heading				
				$("<div></div>")
				.attr("id", virtualDeviceName +"-header")
				.appendTo("#" + virtualDeviceName +"-tile")
				.addClass("text-header")
				.text(deviceName)

			}
			//alert($(virtualDeviceName +"-tile").text())
			for(i = 1; i < deviceidx.length; i++) {
				var device = $.getDevice(deviceidx[i])
				device.forEach(function(value, key) {
				
				//Use status for lighting devices and data for rest
				switch(value.SwitchType){
					case undefined:
					var text = value.Data
					break;
					
					default:
					var text = value.Status
					break;
				}
				// Create Device Type icons
				switch(value.Type){

					case "Dimmer":
					var deviceType = "icon-settings"
					break;
			
					case "Rain":
					var deviceType = "icon-umbrella"
					break;

					case "Wind":
					var deviceType = "icon-compass-2"
					break;
			
					case "Contact":
					var deviceType = "icon-enter"
					break;
			
					case "Temp + Humidity":
					var deviceType = "icon-thermometer"
					break;
			
					case "SmokeDetector":
					var deviceType = "icon-fire"
					break;
				
					case "Lighting 2":
					if (value.SwitchType == "On/Off")
						var deviceType = "icon-lightbulb"
					else if (value.SwitchType == "Contact")
						var deviceType = "icon-enter"
					else if (value.SwitchType == "Motion Sensor")
						var deviceType = "icon-eye"
					else if (value.SwitchType == "Smoke Detector")
						var deviceType = "icon-fire"
					else if (value.SwitchType == "Dimmer")
						var deviceType = "icon-settings"
					else
						var deviceType = "icon-question"
					break;
			
					case "Security":
					var deviceType = "icon-shield"
					break;
		
					case "DuskSensor":
					var deviceType = "icon-sun-5"
					break;
			
					case "General":
					if (value.SubType == "Solar Radiation")
						var deviceType = "icon-warning"
					else
						var deviceType = "icon-stats"
					break;
			
					case "Usage":
					var deviceType = "icon-electricity"
					break;

					case "Energy":
					var deviceType = "icon-graph"
					break;
			
					case "Temp + Humidity + Baro":
					var deviceType = "icon-sun"
					break;
			
					case "Temp":
					var deviceType = "icon-thermometer-2"
					break;
			
					case "MotionSensor":
					var deviceType = "icon-enter"
					break;
			
					case "Lux":
					var deviceType = "icon-adjust"
					break;
			
					case "Weather":
					var deviceType = "icon-weather"
					break;
	
					default:
					var deviceType = "icon-question"
					break;			
			
				}	

				// add a row for each real device in the virtual device tile

				if(!$("#" +value.idx +"-column-label-data").length){
			
					$("<div></div>")
						.attr("id", value.idx +"-column-label")
						.appendTo("#" + virtualDeviceName +"-tile")
						.addClass("column2-label")

					$("<div></div>")
						.attr("id", value.idx +"-column-label-data")
						.appendTo("#" +value.idx +"-column-label")
						.addClass("text")
						.addClass(deviceType)
						//.text(value.Type)
				}			
				if(!$("#" +value.idx +"-column-text-data").length){
					// add data or status
					$("<div></div>")
						.attr("id", value.idx +"-column-text")
						.appendTo("#" + virtualDeviceName +"-tile")
						.addClass("column2-text")
				
					$("<div></div>")
						.attr("id", value.idx +"-column-text-data")
						.appendTo("#" + value.idx + "-column-text" )
						.addClass("text")
						.text(text)
			
				}
		
				// update text if not the same
				if ($(value.idx +"-column-text-data").text() != text){
					//alert($(value.idx +"-column-text-data").text())
					$(value.idx +"-column-text-data")
					.hide()
					.text(text)
					.fadeIn(1500)
				
				}
			
				if ($("#LastUpdate-"+value.idx).text() != value.LastUpdate){				
					$("#LastUpdate-"+value.idx)
					.hide()
					.text(value.LastUpdate)
					.fadeIn(1500)				
				}
			
				if ($("#BatteryStatus-"+value.idx).text() != value.BatteryStatus) {
					$("#BatteryStatus-"+value.idx)
					.hide()
					.text(value.BatteryStatus)
					.fadeIn(1500)
				}

			})
		} //SD For Loop
	} // SD if
}) // SD User Variable
}
/*
	//update dashboard
	updateDomoticzDashboard = function(){
		timerDashboard = setTimeout(updateDomoticzDashboard, 5000)		

		var devices = $.getUseddevices()
		var col = 1;
		devices.result.forEach(function(value,key){

		if(value.Favorite != 0){
		
		//check if DOM elements for device.type exist
		
		switch(value.SwitchType){
			
			// break up categories into Type or SwitchType
			case undefined:
			var category = value.Type.replace(/[_\s]/g, '').replace(/[^a-z0-9-\s]/gi, '');
			var text = value.Data
			break;
			
			default:
			var category = value.SwitchType.replace(/[_\s]/g, '').replace(/[^a-z0-9-\s]/gi, '');
			var text = value.Status
		}
		
			// pretty cattegory labels AFTER defining
		switch(category){

			case "Dimmer":
			var categoryClass = "fa fa-sliders"
			break;
			
			case "Rain":
			var categoryClass = "ion ion-umbrella"
			break;


			case "Blinds":
			var categoryClass = "fa fa-unsorted"
			break;
			
			case "P1Smartmeter":
			var categoryClass = "fa fa-tasks"
			break;
			
			case "Wind":
			var categoryClass = "fa fa-compass"
			break;
			
			case "Thermostat":
			var categoryClass = "fa fa-tachometer"
			break;

			
			case "Contact":
			var categoryClass = "ion ion-toggle"
			break;
			
			case "TempHumidity":
			var categoryClass = "ion ion-thermometer"
			break;
			
			case "SmokeDetector":
			var categoryClass = "glyphicon glyphicon-fire"
			break;
			
			case "OnOff":
			var categoryClass = "fa fa-power-off"
			break;
			
			case "Security":
			var categoryClass = "fa fa-shield"
			break;
			
			case "DuskSensor":
			var categoryClass = "fa fa-square"
			break;
			
			case "General":
			var categoryClass = "ion ion-ios7-pulse-strong"
			break;
			
			case "Usage":
			var categoryClass = "ion ion-outlet"
			break;
			
			case "Energy":
			var categoryClass = "ion ion-outlet"
			break;
			
			case "YouLessMeter":
			var categoryClass = "fa fa-home"
			break;
			
			case "TempHumidityBaro":
			var categoryClass = "icon-sun"
			break;
			
			case "Temp":
			var categoryClass = "ion ion-thermometer"
			break;
			
			case "MotionSensor":
			var categoryClass = "fa fa-refresh"
			break;
			
			case "Lux":
			var categoryClass = "fa fa-bullseye"
			break;
			
			default:
			var categoryClass = "fa fa-question"
			break;			
			
		}	

			// create the headings for each devicetype
			if(!$("#" + category ).length) {
				
				$("<div></div>")
				.attr("id", category)
				.appendTo("#Dashboard-col-"+col)
				.addClass("list-group")
				
				$("<a></a>")
				.attr("id", category+"-text")
				.appendTo("#" + category)
				.addClass("list-group-item active")
								
				$("<span></span>")
				.attr("id", category+"-icon")
				.appendTo("#" + category + "-text")
				.addClass(categoryClass)
			
			// switch col
				col = col+1;
				if(col==5){col=1}
			
				
			}
			
			// create a row for each device
			if(!$("#" + value.idx).length){
				
				$("<a></a>")
					.attr("id", value.idx)
					.attr("href", "#")
					.addClass("list-group-item")
					.attr("data-toggle", "collapse")
					.attr("data-target", "#popout-"+value.idx)

					.appendTo("#"+category)
					
			$("<div></div>")
					.attr("id", "line-"+value.idx)
					.appendTo("#"+value.idx)
					.addClass("clearfix list-group-item-text")
			
			
				$("<span></span>")
					.attr("id", "name-"+value.idx)
					.appendTo("#line-"+value.idx)
					.addClass("small pull-left")
					.text(value.Name)
			
			// add data or status
				
				$("<span></span>")
					.attr("id", "text-" + value.idx)
					.appendTo("#line-"+value.idx)
					.addClass("small pull-right")
					.text(text)
				
				$("<span></span>")
					.attr("id", "icon-" + value.idx)
					.appendTo("#line-"+value.idx)
					.addClass("small pull-right")
				
					
			
			}
		
			// create 'popouts'
			if(!$("#popout-"+value.idx).length){
			
			$("<div></div>")
				.attr("id", "popout-"+value.idx)
				.appendTo("#"+value.idx)
				.attr("data-parent", "#"+value.idx)
				.addClass("spaced collapse well small")
			
			$("<p></p>")
				.attr("id", "LastUpdate-"+value.idx)
				.appendTo("#popout-"+value.idx)
				.text(value.LastUpdate)
				.addClass("list-group-item-text small")

			if(value.BatteryLevel < 100){

			$("<p></p>")
				.attr("id", "BatteryStatus-"+value.idx)
				.appendTo("#popout-"+value.idx)
				.text(value.BatteryLevel)
				.addClass("list-group-item-text small")
				
			}
					
					
													
			}
			
			// update text if not the same
			if ($("#text-"+value.idx).text() != text){
				
				$("#text-"+value.idx)
				.hide()
				.text(text)
				.fadeIn(1500)
				
			}
			
			if ($("#LastUpdate-"+value.idx).text() != value.LastUpdate){				
				$("#LastUpdate-"+value.idx)
				.hide()
				.text(value.LastUpdate)
				.fadeIn(1500)				
			}
			
			if ($("#BatteryStatus-"+value.idx).text() != value.BatteryStatus){				
				$("#BatteryStatus-"+value.idx)
				.hide()
				.text(value.BatteryStatus)
				.fadeIn(1500)
			}

			
			


		}

			
			
			
		})
}
*/
// !		
		
		}(jQuery, window, document));


$(document).ready(function() {
$('.collapse').collapse()
getDomoticzVariables()
createDomoticzTabs()
updateDomoticzSetup()

// stop refreshing tabs when not in focus! 
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
//alert(e.target.hash)
	// set and clear timers

	switch(e.target.hash){
		case "#tab-Dashboard":
		updateDomoticzDashboard()
		break;
		
		case "#Variables-setup-tab-content":
		refreshVariablesTable()
		break;
		
		case "#Devices-setup-tab-content":
		refreshDevicesTable()
		break;

		default:
		break;
	}


	switch(e.relatedTarget.hash){
		
		case "#tab-Dashboard":
		clearTimeout(timerDashboard)
		break;
		
		default:
		break;

	}
})
	//$('#Dashboard a[href="#tab-Dashboard"]').tab('show')
	$('select').selectpicker();
});
