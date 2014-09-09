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
      url: '/json.htm?type=devices&rid=' +idx,
      async: false,
      dataType: 'json',
      success: function (json) {
        device = json;
      }
    });
    return device.result;
  }

  // get all scenes
  $.getScenes = function(){
    var scenes = [];
    $.ajax({
      url: '/json.htm?type=scenes',
      async: false,
      dataType: 'json',
      success: function (json) {
        scenes = json;
      }
    });
    return scenes;
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
  /*   0 = Integer, e.g. -1, 1, 0, 2, 10  
  *    1 = Float, e.g. -1.1, 1.2, 3.1
  *    2 = String
  *    3 = Date in format DD/MM/YYYY
  *    4 = Time in 24 hr format HH:MM
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

  //  try to delete a variable, print results to console & return results as object
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

  //update light switch
  $.updateLightSwitch = function(idx, switchcmd, level){
    var result = [];
    $.ajax({
      url: '/json.htm?type=command&param=switchlight&idx='+idx+'&switchcmd='+switchcmd+'&level='+level,
      async: false,
      dataType: 'json',
      success: function (json) {
        result = json;
      }
    });
  }
  
  //update light switch
  $.updateScene = function(idx, switchcmd){
    var result = [];
    $.ajax({
      url: '/json.htm?type=command&param=switchscene&idx='+idx+'&switchcmd='+switchcmd,
      async: false,
      dataType: 'json',
      success: function (json) {
        result = json;
      }
    });
  }
  
  switchLights = function(obj){
  	var idx = $(obj).data("deviceIdx")
  	var switchcmd = (($(obj).data("deviceStatus") == "On") ? "Off" : "On")
  	$.updateLightSwitch(idx,switchcmd)
  	//store the new switch state in the object
  	$(obj).data("deviceStatus", switchcmd)
  }
  
  switchScenes = function(obj){
  	var idx = $(obj).data("deviceIdx")
  	var switchcmd = (($(obj).data("deviceStatus") == "On") ? "Off" : "On")
  	$.updateScene(idx,switchcmd)
  	//store the new switch state in the object
  	$(obj).data("deviceStatus", switchcmd)
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
  //need to have the names & the idx's around, want to minimize the for.Eache's, so this seems easy :P
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
  
  //Create a list of devices appended by VD Name and Type
  updateDevices = function(){
    timerUpdateDevices = setTimeout(updateDevices, 5000)
    combinedDeviceList= []
    var userVariables = $.getUservariables()
    userVariables.result.forEach(function(valueVirtualDevice, index){
      if(valueVirtualDevice.Name.match(/vd_/)){    
        var deviceidx = valueVirtualDevice.Value.split(",")
        var virtualDeviceName = valueVirtualDevice.Name.split('_')[1];
        var virtualDeviceType = deviceidx[0]
        var virtualDeviceIndex = valueVirtualDevice.idx
        var tempObj = {
          VirtualDeivceName: virtualDeviceName,
          VirtualDeivceType: virtualDeviceType,
          VirtualDeiceIdx: virtualDeviceIndex
        }
        for(i = 1; i < deviceidx.length; i++) {
          var device = $.getDevice(deviceidx[i])
          var object = $.extend({}, device[0], tempObj);
          combinedDeviceList.push(object)
        }
      }  
    })
    //updateScenes()
  }
  

  getDeviceTileColor = function(deviceType, deviceSubType, switchType, currentValue, currentCounterToday){
    var tileColor
    var counterToday = currentCounterToday
    if (deviceType == "Usage") {
      var currentPower = parseFloat(currentValue.split(' ')[0])
      if (currentPower <= 50) {
        tileColor = "green"
      }          
      else if ((currentPower > 50) && (currentPower <= 500)) {
        tileColor = "lime"
      }          
      else if ((currentPower > 500) && (currentPower <= 1000)) {
        tileColor = "yellow"
      }          
      else if ((currentPower > 1000) && (currentPower <= 1500)) {
        tileColor = "orange"
      }          
      else if ((currentPower > 1500) && (currentPower <= 2000)) {
        tileColor = "red"
      }
      else if (currentPower > 2000) {
        tileColor = "violet"
      }        
    }
    else if (deviceType == "Energy"){
      var energyToday = parseFloat(counterToday.split(' ')[0])
      if (energyToday <= 0.5) {
        tileColor = "green"
      }          
      else if ((energyToday > 0.5) && (energyToday <= 1.0)) {
        tileColor = "lime"
      }          
      else if ((energyToday > 1.0) && (energyToday <= 1.5)) {
        tileColor = "yellow"
      }          
      else if ((energyToday > 1.5) && (energyToday <= 2.0)) {
        tileColor = "orange"
      }          
      else if ((energyToday > 2.0) && (energyToday <= 2.5)) {
        tileColor = "red"
      }
      else if (energyToday > 2.5) {
        tileColor = "violet"
      }         
    }
    else if ((deviceType == "Temp") || (deviceType == "Temp + Humidity") || (deviceType == "Temp + Humidity + Baro")) {
      var currentTemp = parseFloat(currentValue.split(' ')[0])
      if (currentTemp <= 5) {
        tileColor = "teal"
      }
      else if ((currentTemp > 5) && (currentTemp <= 10)) {
        tileColor = "blue"
      }          
      else if ((currentTemp > 10) && (currentTemp <= 15)) {
        tileColor = "green"
      }          
      else if ((currentTemp > 15) && (currentTemp <= 20)) {
        tileColor = "yellow"
      }          
      else if ((currentTemp > 20) && (currentTemp <= 25)) {
        tileColor = "amber"
      }          
      else if ((currentTemp > 25) && (currentTemp <= 30)) {
        tileColor = "orange"
      }          
      else if (currentTemp > 30) {
        tileColor = "red"
      }
      else {
        //tileColor = "blue"
      }    
    }   
    else if (deviceType == "Lighting 2"){
      switch (switchType){
        case "On/Off":
          if (currentValue == "On")
            tileColor = "red"
          else
            tileColor = "green"
        break;
        case "Contact":
          if (currentValue == "Open")
            tileColor = "red"
          else
            tileColor = "green"
        break;
        case "Motion Sensor":
          if (currentValue == "On")
            tileColor = "red"
          else
            tileColor = "green"
        break;
        case "Smoke Detector":
          if (currentValue == "On")
            tileColor = "red"
          else
            tileColor = "green"
          break;
        case "Dimmer":
          if (currentValue == "Off")
            tileColor = "green"
          else
            tileColor = "red"
        break;
        default:
            //tileColor = "blue"
        break;    
      }
    }
    else if ((deviceType == "Scene") || (deviceType == "Group")){
      switch (deviceType){
        case "Scene":
          if (currentValue == "On")
            tileColor = "red"
          else
            tileColor = "green"
        break;
        case "Group":
          if (currentValue == "On")
            tileColor = "red"
          else
            tileColor = "green"
        break;
      }
    }
    else {
      //tileColor = "blue"
    }   
    return tileColor   
  }  
  
  
  getDeviceImage = function(deviceType, deviceSubType, switchType, currentValue){
    switch (deviceType){
      case "Usage":
        var deviceImage = "../images/current48.png"
      break;
      case "Energy":
        var deviceImage = "../images/current48.png"
      break;
      case "Temp":
      case "Temp + Humidity":
      case "Temp + Humidity + Baro":
        var currentTemp = parseFloat(currentValue.split(' ')[0])
        if (currentTemp <= 5) {
          var deviceImage = "../images/temp-0-5.png"
        }
        else if ((currentTemp > 5) && (currentTemp <= 10)) {
          var deviceImage = "../images/temp-5-10.png"
        }          
        else if ((currentTemp > 10) && (currentTemp <= 15)) {
          var deviceImage = "../images/temp-10-15.png"
        }          
        else if ((currentTemp > 15) && (currentTemp <= 20)) {
          var deviceImage = "../images/temp-15-20.png"
        }          
        else if ((currentTemp > 20) && (currentTemp <= 25)) {
          var deviceImage = "../images/temp-20-25.png"
        }          
        else if ((currentTemp > 25) && (currentTemp <= 30)) {
          var deviceImage = "../images/temp-25-30.png"
        }          
        else if (currentTemp > 30) {
          var deviceImage = "../images/temp-gt-30.png"
        }        
      break;
      case "Rain":
        var deviceImage = "../images/rain48.png"
      break;
      case "Wind":
        var deviceImage = "../images/wind48.png"
      break;
      case "Lux":
        var deviceImage = "../images/lux48.png"
      break;
      case "Security":
        var deviceImage = "../images/security48.png"
      break;
      case "Scene":
        if (currentValue == "On")
          var deviceImage = "../images/pushon48.png"
        else
          var deviceImage = "../images/pushoff48.png"
      break;
      case "Group":
        if (currentValue == "On")
          var deviceImage = "../images/pushon48.png"
        else
          var deviceImage = "../images/pushoff48.png"
      break;
      case "General":
        switch (deviceSubType) {
          case "Solar Radiation":
            var deviceImage = "../images/radiation48.png"
          break;
          case "Percentage":
            var deviceImage = "../images/Percentage48.png"
          break;
        }
      break;
      case "Lighting 2":
        switch (switchType){
          case "On/Off":
            if (currentValue == "On")
              var deviceImage = "../images/Light48_On.png"
            else
              var deviceImage = "../images/Light48_Off.png"
          break;
          case "Contact":
            if (currentValue == "Open")
              var deviceImage = "../images/contact48_open.png"
            else
              var deviceImage = "../images/contact48.png"
          break;
          case "Motion Sensor":
            if (currentValue == "On")
              var deviceImage = "../images/motion48-on.png"
            else
              var deviceImage = "../images/motion48-off.png"
          break;
          case "Smoke Detector":
            if (currentValue == "On")
              var deviceImage = "../images/smoke48on.png"
            else
              var deviceImage = "../images/smoke48off.png"
            break;
          case "Dimmer":
            if (currentValue == "Off")
              var deviceImage = "../images/dimmer48-off.png"
            else
              var deviceImage = "../images/dimmer48-on.png"
          break;
          default:
            var deviceImage = "../images/iphone-icon.png"
          break;    
        }
      break;
    }
    return deviceImage
  }
  
  getTileGrouping = function(deviceType, deviceSubType, switchType){
    var tileGroupNameText
    switch(deviceType){
      case "Lighting 2":
        tileGroupNameText = switchType
      break;
      case "Scene":
        tileGroupNameText = "Scenes"
      break;
      case "Group":
        tileGroupNameText = "Groups"
      break;
      case "Temp":
      case "Temp + Humidity":
      case "Temp + Humidity + Baro":
        tileGroupNameText = "Temperature Sensors"
      break;
      
      case "Usage":
      case "Current":
        tileGroupNameText = "Power Sensors"
      break;      

      case "Energy":
      case "Current/Energy":
        tileGroupNameText = "Energy Sensors"
      break;      
      case "Fan":
      case "Air Quality":
      case "Lux":
      case "Weight":
      case "Thermostat":
        tileGroupNameText = "Other Utility Sensors"
      break;
      
      case "Rain":
      case "Wind":
        tileGroupNameText = "Weather"
      break;        
    }
    switch(deviceSubType){
      case "Gas":
      case "RFXMeter counter":
      case "Percentage":
      case "Soil Moisture":
      case "Voltage":
      case "A/D":
      case "Pressure":
        tileGroupNameText = "Other Utility Sensors"
      break;
      case "Solar Radiation":
        tileGroupNameText = "Weather"
      break;        
      
    }
    return tileGroupNameText
  }

  //Create Scenes Tab
  updateScenes = function(){

    var scenes = $.getScenes()
    scenes.result.forEach(function(value, key){
    if((value.Type == "Scene") || (value.Type == "Group")){
      var text = value.Status
      var idx = value.idx
      var sceneType = value.Type
      var deviceImage = getDeviceImage(value.Type, value.SubType, value.SwitchType, text)
      var deviceTileColor = getDeviceTileColor(value.Type, value.SubType, value.SwitchType, text)
      var tileGroupNameText = "Scenes and Groups"
      var tileGroupName = tileGroupNameText.replace(/[_\s]/g, '').replace(/[^a-z0-9-\s]/gi, '')

      if(!$("#" +tileGroupName +"-tile-group").length) {
        $("<section></section>")
          .attr("id", tileGroupName +"-tile-group")
          .appendTo("#content-wrapper")
          .addClass("tile-group two-wide")
        $("<h2></h2>")
          .appendTo("#" +tileGroupName +"-tile-group")
          .text(tileGroupNameText)
      }
        
      if(!$("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile").length) {
        $("<div></div>")
          .attr("id", tileGroupName +"-" +value.idx +"-tile-group-live-tile")
          .appendTo("#" +tileGroupName +"-tile-group")
          .addClass("live-tile metrojs-carousel")
          .attr("data-bounce", "true")
          .attr("data-bounce-dir", "edges")
          .attr("data-mode", "carousel")
          .attr("data-direction", "horizontal")
          .attr("data-slide-direction", "forward")
          .attr("data-pause-onhover", "true")
          .data("deviceIdx", value.idx)
          .data("deviceStatus", text)
          //.data("deviceSetLevel", value.LevelInt)
          .attr("onclick", "switchScenes(this)")
        $("<span></span>")
          .appendTo("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile")
          .addClass("tile-title")
          .text(value.Type)
      }  
      if(!$("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content").length) {
        $("<div></div>")
          .attr("id", tileGroupName +"-" +value.idx +"-tile-group-live-tile-content")
          .appendTo("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile")
          .addClass("accent " +deviceTileColor)
        $("<p></p>")
        	.attr("id", tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p")
        	.appendTo("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content")
        $("<img></img>")
        	.attr("id", tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p-img")
        	.appendTo("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p")
        	.addClass("clear-fix")
        	.attr("src", deviceImage)
        $("<span></span>")
      	  .attr("id", tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p-span-dummy")
      	  .appendTo("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p")
      	  .addClass("clear-fix text-right")          	
        $("<span></span>")
        	.attr("id", tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p-span-status")
        	.appendTo("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p")
        	.addClass("clear-fix text-right metroLarge")
        	.text(text)
        $("<span></span>")
          .attr("id", tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p-span-devicename")
          .appendTo("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p")
          .addClass("clear-fix text-right")
          .text(value.Name)        	
        $("<span></span>")
        	.attr("id", tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p-span-lastupdate")
        	.appendTo("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p")
        	.addClass("clear-fix text-right metroSmaller")
        	.text(value.LastUpdate)
        
        }
      }
    })
  }
      
  updateDomoticzTabs = function(){
    var device = combinedDeviceList
    device.forEach(function(value, key){
    //Read the data or status      
    switch(value.SwitchType){
      case undefined:
        var text = value.Data
      break;
      default:
        var text = value.Status
      break;
    }
    var counterToday = value.CounterToday
    if (typeof(counterToday)  === "undefined"){
      counterToday = "0.0 kWh"
    }
    
    //Create The live Tiles
      var idx = value.idx
      var deviceImage = getDeviceImage(value.Type, value.SubType, value.SwitchType, text)
      var deviceTileColor = getDeviceTileColor(value.Type, value.SubType, value.SwitchType, text, counterToday)
      var tileGroupNameText = getTileGrouping(value.Type, value.SubType, value.SwitchType)
      var tileGroupName = tileGroupNameText.replace(/[_\s]/g, '').replace(/[^a-z0-9-\s]/gi, '')

      if(!$("#" +tileGroupName +"-tile-group").length) {
        $("<section></section>")
          .attr("id", tileGroupName +"-tile-group")
          .appendTo("#content-wrapper")
          .addClass("tile-group five-wide")
        $("<h2></h2>")
          .appendTo("#" +tileGroupName +"-tile-group")
          .text(tileGroupNameText)
      }
        
      if(!$("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile").length) {
        $("<div></div>")
          .attr("id", tileGroupName +"-" +value.idx +"-tile-group-live-tile")
          .appendTo("#" +tileGroupName +"-tile-group")
          .addClass("live-tile metrojs-carousel")
          .attr("data-bounce", "true")
          .attr("data-bounce-dir", "edges")
          .attr("data-mode", "carousel")
          .attr("data-direction", "horizontal")
          .attr("data-slide-direction", "forward")
          .attr("data-pause-onhover", "true")
          .data("deviceIdx", value.idx)
          .data("deviceStatus", text)
          .data("deviceSetLevel", value.LevelInt)
          .attr("onclick", "switchLights(this)")
        $("<span></span>")
          .appendTo("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile")
          .addClass("tile-title")
          .text(value.Name)
      }  
      if(!$("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content").length) {
        $("<div></div>")
          .attr("id", tileGroupName +"-" +value.idx +"-tile-group-live-tile-content")
          .appendTo("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile")
          .addClass("accent " +deviceTileColor)
        $("<p></p>")
        	.attr("id", tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p")
        	.appendTo("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content")
        $("<img></img>")
        	.attr("id", tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p-img")
        	.appendTo("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p")
        	.addClass("clear-fix")
        	.attr("src", deviceImage)
        $("<span></span>")
      	  .attr("id", tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p-span-dummy")
      	  .appendTo("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p")
      	  .addClass("clear-fix text-right")          	
        $("<span></span>")
        	.attr("id", tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p-span-status")
        	.appendTo("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p")
        	.addClass("clear-fix text-right metroLarge")
        	.text(text)
        if(value.Type == "Energy"){
          $("<span></span>")
          	.attr("id", tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p-span-countertoday")
          	.appendTo("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p")
          	.addClass("clear-fix text-right")
          	.text("Today: " +counterToday)
        }
        $("<span></span>")
        	.attr("id", tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p-span-lastupdate")
        	.appendTo("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p")
        	.addClass("clear-fix text-right metroSmaller")
        	.text(value.LastUpdate)
        
      }
    })  
  }
  
  //Create Dashboard Tab
  updateDashboard = function(){
    device = combinedDeviceList
    device.forEach(function(value, key){
      var vdidx = value.VirtualDeiceIdx
      var deviceName = value.VirtualDeivceName
      var virtualDeviceType = value.VirtualDeivceType.replace(/[_\s]/g, '').replace(/[^a-z0-9-\s]/gi, '');
      var virtualDeviceName = deviceName.replace(/[_\s]/g, '').replace(/[^a-z0-9-\s]/gi, '');
      //Use status for lighting devices and data for rest
      switch(value.SwitchType){
        case undefined:
          var text = value.Data
        break;
        default:
          var text = value.Status
        break;
      }
      var counterToday = value.CounterToday
      if (typeof(counterToday)  === "undefined"){
        counterToday = "0.0 kWh"
      }
      
      var deviceImage = getDeviceImage(value.Type, value.SubType, value.SwitchType, text)
      var deviceTileColor = getDeviceTileColor(value.Type, value.SubType, value.SwitchType, text, counterToday)
      var tileGroupNameText = "Dashboard"
      var tileGroupName = tileGroupNameText.replace(/[_\s]/g, '').replace(/[^a-z0-9-\s]/gi, '')
      
      if(!$("#" +tileGroupName +"-tile-group").length) {
        $("<section></section>")
          .attr("id", tileGroupName +"-tile-group")
          .appendTo("#content-wrapper")
          .addClass("tile-group ten-wide")
        $("<h2></h2>")
          .appendTo("#" +tileGroupName +"-tile-group")
          .text(tileGroupNameText)
      }
      
      if(!$("#" +tileGroupName +"-" +virtualDeviceName +"-tile-group-live-tile").length) {
        $("<div></div>")
          .attr("id", tileGroupName +"-" +virtualDeviceName +"-tile-group-live-tile")
          .appendTo("#" +tileGroupName +"-tile-group")
          .addClass("live-tile metrojs-carousel")
          .attr("data-bounce", "true")
          .attr("data-bounce-dir", "edges")
          .attr("data-mode", "carousel")
          //.attr("data-direction", "horizontal")
          .attr("data-slide-direction", "forward")
          .attr("data-pause-onhover", "true")
          //.attr("data-stack", "true")
          .attr("data-delay", "3000")
          .attr("data-speed","1500")
          //.attr("data-swap", "image")
          //.attr("data-stops", "100%")
          //.attr("data-delay","3500")
          //.data("deviceIdx", value.idx)
          //.data("deviceStatus", text)
          //.data("deviceSetLevel", value.LevelInt)
          //.attr("onclick", "switchLights(this)")
        $("<span></span>")
          .appendTo("#" +tileGroupName +"-" +virtualDeviceName +"-tile-group-live-tile")
          .addClass("tile-title")
          //.text(deviceName)
      }
      if(!$("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content").length) {
        $("<div></div>")
          .attr("id", tileGroupName +"-" +value.idx +"-tile-group-live-tile-content")
          .appendTo("#" +tileGroupName +"-" +virtualDeviceName +"-tile-group-live-tile")
          .addClass("accent " +deviceTileColor)
          //.attr("data-direction", "horizontal")
        $("<p></p>")
          .attr("id", tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p")
          .appendTo("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content")
        $("<img></img>")
          .attr("id", tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p-img")
          .appendTo("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p")
          .addClass("clear-fix")
          .attr("src", deviceImage)
        $("<span></span>")
          .attr("id", tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p-span-dummy")
          .appendTo("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p")
          .addClass("clear-fix text-right")
        $("<span></span>")
          .attr("id", tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p-span-status")
          .appendTo("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p")
          .addClass("clear-fix text-right metroLarge")
          .text(text)
        if(value.Type == "Energy"){
          $("<span></span>")
            .attr("id", tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p-span-countertoday")
            .appendTo("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p")
            .addClass("clear-fix text-right")
            .text("Today: " +counterToday)
        }
        $("<span></span>")
          .attr("id", tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p-span-devicename")
          .appendTo("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p")
          .addClass("clear-fix text-right")
          .text(value.Name)
        $("<span></span>")
          .attr("id", tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p-span-lastupdate")
          .appendTo("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p")
          .addClass("clear-fix text-right metroSmaller")
          .text(value.LastUpdate)
      }
    })
  }
    
  refreshTabs = function(){
    // Refresh DOM objects showing data
    timerRefreshTabs = setTimeout(refreshTabs, 5000)
    
    var device = combinedDeviceList
    device.forEach(function(value, key){
      var deviceName = value.VirtualDeivceName
      var virtualDeviceName = deviceName.replace(/[_\s]/g, '').replace(/[^a-z0-9-\s]/gi, '');
      var counterToday = value.CounterToday
      if (typeof(counterToday)  === "undefined"){
        counterToday = "0.0 kWh"
      }
    
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
      var deviceImage = getDeviceImage(value.Type, value.SubType, value.SwitchType, text)
      var deviceTileColor = getDeviceTileColor(value.Type, value.SubType, value.SwitchType, text, counterToday)
      var tileGroupNameText = getTileGrouping(value.Type, value.SubType, value.SwitchType)
      var tileGroupName = tileGroupNameText.replace(/[_\s]/g, '').replace(/[^a-z0-9-\s]/gi, '')
      
      // update text if not the same
      if ($("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p-span-status").text() != text){
        $("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p-span-status")
          .hide()
          .text(text)
          //.fadeIn(500)
          .show()
        //setTimeout(function(){
        //  $.Notify({style: {background: '#1ba1e2', color: 'white'}, caption: 'Update...', content: value.Name +" changed to " +text});
        //}, 3000);
              
      }
      // Update the image in case of status chage
      if ($("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p-img").attr('src') != deviceImage){
        $("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p-img")
          .hide()
          .attr("src", deviceImage)
          //.fadeIn(500)
          .show()
      }
      if ($("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p-span-lastupdate").text() != value.LastUpdate){        
        $("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p-span-lastupdate")
          .hide()
          .text(value.LastUpdate)
          //.fadeIn(500)        
          .show()
      }
      //if(value.Type == "Energy"){
        if ($("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p-span-countertoday").text() != "Today: " +counterToday){        
          $("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p-span-countertoday")
            .hide()
            .text("Today: " +counterToday)
            //.fadeIn(500)        
            .show()
        }
      //}
      //if ($("#BatteryStatus-"+value.idx).text() != value.BatteryStatus) {
      //  $("#BatteryStatus-"+value.idx)
      //  .hide()
      //  .text(value.BatteryStatus)
      //  //.fadeIn(500)
      //  .show()
      //}

      // Update the tile color
      $("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content").addClass(deviceTileColor);
      var dAccent = $("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content").data("accent");
      if (dAccent != deviceTileColor) {
        var cleanClass = $("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content").attr("class").replace(dAccent, "");
        cleanClass = cleanClass.replace(/(\s)+/, ' ');
        $("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content").attr("class", cleanClass);
        $("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content").data("accent", deviceTileColor);
      }        
      // Update Dashboard tile content
      var tileGroupNameText = "Dashboard"
      var tileGroupName = tileGroupNameText.replace(/[_\s]/g, '').replace(/[^a-z0-9-\s]/gi, '')
      // update text if not the same
      if ($("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p-span-status").text() != text){
        $("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p-span-status")
          .hide()
          .text(text)
          //.fadeIn(500)
          .show()
        //setTimeout(function(){
        //  $.Notify({style: {background: '#1ba1e2', color: 'white'}, caption: 'Update...', content: value.Name +" changed to " +text});
        //}, 3000);
              
      }
      // Update the image in case of status chage
      if ($("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p-img").attr('src') != deviceImage){
        $("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p-img")
          .hide()
          .attr("src", deviceImage)
          //.fadeIn(500)
          .show()
      }
      if ($("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p-span-lastupdate").text() != value.LastUpdate){        
        $("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p-span-lastupdate")
          .hide()
          .text(value.LastUpdate)
          //.fadeIn(500)        
          .show()
      }
      //if(value.Type == "Energy"){
        if ($("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p-span-countertoday").text() != "Today: " +counterToday){        
          $("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p-span-countertoday")
            .hide()
            .text("Today: " +counterToday)
            //.fadeIn(500)        
            .show()
        }
      //}
      //if ($("#BatteryStatus-"+value.idx).text() != value.BatteryStatus) {
      //  $("#BatteryStatus-"+value.idx)
      //  .hide()
      //  .text(value.BatteryStatus)
      //  //.fadeIn(500)
      //  .show()
      //}
      // Update the tile color
      $("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content").addClass(deviceTileColor);
      var dAccent = $("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content").data("accent");
      if (dAccent != deviceTileColor) {
        var cleanClass = $("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content").attr("class").replace(dAccent, "");
        cleanClass = cleanClass.replace(/(\s)+/, ' ');
        $("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content").attr("class", cleanClass);
        $("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content").data("accent", deviceTileColor);
      }
    })
    var scenes = $.getScenes()
    scenes.result.forEach(function(value, key){
      // Update Scenses and Groups tile content
      var text = value.Status
      var deviceImage = getDeviceImage(value.Type, value.SubType, value.SwitchType, text)
      var deviceTileColor = getDeviceTileColor(value.Type, value.SubType, value.SwitchType, text)
      var tileGroupNameText = "Scenes and Groups"
      var tileGroupName = tileGroupNameText.replace(/[_\s]/g, '').replace(/[^a-z0-9-\s]/gi, '')
      // update text if not the same
      if ($("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p-span-status").text() != text){
        $("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p-span-status")
          .hide()
          .text(text)
          //.fadeIn(500)
          .show()
        //setTimeout(function(){
        //  $.Notify({style: {background: '#1ba1e2', color: 'white'}, caption: 'Update...', content: value.Name +" changed to " +text});
        //}, 3000);
              
      }
      // Update the image in case of status chage
      if ($("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p-img").attr('src') != deviceImage){
        $("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p-img")
          .hide()
          .attr("src", deviceImage)
          //.fadeIn(500)
          .show()
      }
      if ($("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p-span-lastupdate").text() != value.LastUpdate){        
        $("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content-p-span-lastupdate")
          .hide()
          .text(value.LastUpdate)
          //.fadeIn(500)        
          .show()
      }
      // Update the tile color
      $("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content").addClass(deviceTileColor);
      var dAccent = $("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content").data("accent");
      if (dAccent != deviceTileColor) {
        var cleanClass = $("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content").attr("class").replace(dAccent, "");
        cleanClass = cleanClass.replace(/(\s)+/, ' ');
        $("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content").attr("class", cleanClass);
        $("#" +tileGroupName +"-" +value.idx +"-tile-group-live-tile-content").data("accent", deviceTileColor);
      }      
    })
  }
}(jQuery, window, document));

$(document).ready(function() {
  updateDevices()
  updateDashboard()
  updateScenes()
  updateDomoticzTabs()
  refreshTabs()
});
