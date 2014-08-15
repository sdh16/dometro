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
	
//update Dashboard
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
				var virtualDeviceTypeClass = "icon-link-2"
				break;
			
				case "TempHumidity":
				var virtualDeviceTypeClass = "icon-thermometer-2"
				break;
			
				case "SmokeDetector":
				var virtualDeviceTypeClass = "icon-fire"
				break;
			
				case "OnOff":
				var virtualDeviceTypeClass = "icon-switch"
				break;
			
				case "Security":
				var virtualDeviceTypeClass = "icon-shield"
				break;
			
				case "DuskSensor":
				var virtualDeviceTypeClass = "icon-cloud-5"
				break;
			
				case "General":
				var virtualDeviceTypeClass = "icon-info"
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
				var virtualDeviceTypeClass = "icon-none"
				break;			
			}
			//Here create a panorama for each virtual device type
			//and add all the virtual devices of that type to it
			// create a tile group for each virtual device type
			if(!$("#" + virtualDeviceType +"-tile-group").length) {

				$("<div></div>")
				.attr("id", virtualDeviceType +"-tile-group")
				.appendTo("#dashboard")
				.addClass("tile-group six")

				$("<div></div>")
				.attr("id", "tile-group-title")
				.appendTo("#" +virtualDeviceType +"-tile-group")
				.addClass("tile-group-title")
				.text(virtualDeviceType)
			}


			// create a tile for each virtual device
			if(!$("#" + virtualDeviceName +"-tile").length) {

				// Create the tile for the virtual deivce
				$("<a></a>")
				.attr("id", virtualDeviceName +"-tile")
				.appendTo("#" +virtualDeviceType +"-tile-group")
				.addClass("tile double bg-lightBlue live")
				.attr("data-role","live-tile")
				.attr("data-effect","slideUp")
				.attr("data-click","transform")
				
			}
			
			// add the virtual device name to the tile content			
			//if(!$("#" +virtualDeviceName +"-tile-name").length){
			//	$("<div></div>")
			//	.attr("id", virtualDeviceName +"-tile-name")
			//	.appendTo("#" + virtualDeviceName +"-tile")
			//	.addClass("text-right padding10 ntp")
			
			//	$("<p></p>")
			//	.attr("id", virtualDeviceName +"-tile-name-text")
			//	.appendTo("#" + virtualDeviceName +"-tile-name")
			//	.addClass("fg-white")
				
			//	$("<small></small>")
			//	.text(virtualDeviceName)
			//	.appendTo("#" + virtualDeviceName +"-tile-name-text")
					
			//}
		
		
			if(!$("#" +virtualDeviceName +"-tile-brand").length){
				$("<div></div>")
				.attr("id", virtualDeviceName +"-tile-brand")
				.appendTo("#" + virtualDeviceName +"-tile")
				.addClass("brand")

				$("<div></div>")
				.attr("id", virtualDeviceName +"-tile-brand-label")
				.appendTo("#" + virtualDeviceName +"-tile-brand")
				.addClass("label")

				//$("<h3></h3>")
				$("<div></div>")
				.attr("id", virtualDeviceName +"-tile-brand-label-heading")
				.appendTo("#" + virtualDeviceName +"-tile-brand-label")
				.addClass("no-margin fg-white")
				.text(deviceName)

				//$("<span></span>")
				//.attr("id", virtualDeviceName +"-tile-brand-label-heading-data")
				//.appendTo("#" + virtualDeviceName +"-tile-brand-label-heading")
				//.addClass(virtualDeviceTypeClass)
				//.text(virtualDeviceName)

				$("<div></div>")
				.attr("id", virtualDeviceName +"-tile-brand-badge")
				.appendTo("#" + virtualDeviceName +"-tile-brand")
				.addClass("badge")

				$("<span></span>")
				.attr("id", virtualDeviceName +"-tile-brand-badge-data")
				.appendTo("#" + virtualDeviceName +"-tile-brand-badge")
				.text(deviceidx.length-1)
			}
			

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
					var deviceType = "../images/dimmer48-on.png" //"icon-settings"
					break;
			
					case "Rain":
					var deviceType = "../images/rain48.png" //"icon-umbrella"
					break;

					case "Wind":
					var deviceType = "../images/wind48.png" //"icon-compass-2"
					break;
			
					case "Contact":
					var deviceType = "../images/contact48.png" //""icon-enter"
					break;
			
					case "Temp + Humidity":
					var deviceType = "icon-thermometer"
					break;
			
					case "SmokeDetector":
					var deviceType = "../images/smoke48on.png" //"icon-fire"
					break;
				
					case "Lighting 2":
					if (value.SwitchType == "On/Off")
						var deviceType = "../images/Light48_On.png"//"icon-lamp"
					else if (value.SwitchType == "Contact")
						var deviceType = "../images/contact48.png"
					else if (value.SwitchType == "Motion Sensor")
						var deviceType = "icon-eye"
					else if (value.SwitchType == "Smoke Detector")
						var deviceType = "../images/smoke48on.png" //"icon-fire"
					else if (value.SwitchType == "Dimmer")
						var deviceType = "../images/dimmer48-on.png"
					else
						var deviceType = "icon-question"
					break;
			
					case "Security":
					var deviceType = "../images/security48.png" //"icon-shield"
					break;
		
					case "DuskSensor":
					var deviceType = "icon-sun-5"
					break;
			
					case "General":
					if (value.SubType == "Solar Radiation")
						var deviceType = "../images/radiation48.png" //"icon-warning"
					else
						var deviceType = "../images/Percentage48.png" //"icon-stats"
					break;
			
					case "Usage":
					var deviceType = "../images/current48.png" //"icon-power"
					break;

					case "Energy":
					var deviceType = "../images/current48.png" //"icon-power-2"
					break;
			
					case "Temp + Humidity + Baro":
					var deviceType = "../images/gauge48.png" //"icon-sun"
					break;
			
					case "Temp":
					var deviceType = "../images/temp48.png" //"icon-thermometer"
					break;
			
					case "MotionSensor":
					var deviceType = "../images/motion48-on.png" //"icon-enter"
					break;
			
					case "Lux":
					var deviceType = "../images/lux48.png" //"icon-adjust"
					break;
			
					case "Weather":
					var deviceType = "icon-weather"
					break;
	
					default:
					var deviceType = "icon-none"
					break;			
			
				}	

				// add a tile content block each real device in the virtual device tile
				if(!$("#" +value.idx +"-tile-content").length){
					$("<div></div>")
					.attr("id", value.idx +"-tile-content")
					.appendTo("#" + virtualDeviceName +"-tile")
					.addClass("tile-content email")
				}
				
				// add the icon and value
				if(!$("#" +value.idx +"-tile-content-email-image").length){
					$("<div></div>")
						.attr("id", value.idx +"-tile-content-email-image")
						.appendTo("#" + value.idx +"-tile-content")
						.addClass("email-image")
						//.addClass(deviceType)
					$("<img></img>")
						.appendTo("#" + value.idx +"-tile-content-email-image")
						.attr("src", deviceType)

				}			
				if(!$("#" +value.idx +"-tile-content-email-data").length){
					// add data or status
					$("<div></div>")
						.attr("id", value.idx +"-tile-content-email-data")
						.appendTo("#" + value.idx +"-tile-content")
						.addClass("email-data")
					// add blank title to pad and avoid conflict with time name
					//$("<span></span>")
					//	.attr("id", value.idx +"-tile-content-email-data-title")
					//	.appendTo("#" + value.idx + "-tile-content-email-data" )
					//	.addClass("email-data-title")
					//	.text("-")
					$("<span></span>")
						.attr("id", value.idx +"-tile-content-email-data-status")
						.appendTo("#" + value.idx + "-tile-content-email-data" )
						.addClass("email-data-subtitle")
						.text(text)
					$("<span></span>")
						.attr("id", value.idx +"-tile-content-email-data-lastupdate")
						.appendTo("#" + value.idx + "-tile-content-email-data" )
						.addClass("email-data-text")
						.text(value.LastUpdate)
				}
		
				// update text if not the same
				if ($("#" +value.idx +"-tile-content-email-data-status").text() != text){
					//alert($(value.idx +"-column-text-data").text())
					$("#" +value.idx +"-tile-content-email-data-status")
					.hide()
					.text(text)
					.fadeIn(1500)
				
				}
			
				if ($("#" + value.idx +"-tile-content-email-data-lastupdate").text() != value.LastUpdate){				
					$("#" +value.idx +"-tile-content-email-data-lastupdate")
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
getDomoticzVariables()
updateDomoticzDashboard()
});
