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
    return result;
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
    return result;
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
    //return combinedDeviceList 
    //refreshTabs() 
    //updateScenes()
  }
  
  
  refreshTabs = function(){
    // Refresh DOM objects showing data
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
      
      // update text if not the same
      if ($("#" +"Lights-" +value.idx +"-tile-content-email-data-title").text() != text){
        $("#" +"Lights-" +value.idx +"-tile-content-email-data-title")
          .hide()
          .text(text)
          .fadeIn(1500)
      }
      if ($("#" +"Lights-" +value.idx +"-tile-content-email-image-data").attr('src') != deviceImage){
        $("#" +"Lights-" +value.idx +"-tile-content-email-image-data")
          .hide()
          .attr("src", deviceImage)
          .fadeIn(1500)
      }
      if ($("#" +"Lights-" +value.idx +"-tile-content-email-data-text").text() != value.LastUpdate){        
        $("#" +"Lights-" +value.idx +"-tile-content-email-data-text")
          .hide()
          .text(value.LastUpdate)
          .fadeIn(1500)        
      }
      // Update the tile color
      $("#" +"Lights-" +value.idx +"-tile")
        .removeClass($("#" +"Lights-" +value.idx +"-tile").attr('class'))
        .addClass("tile double live " +deviceTileColor)
        
      // update text if not the same
      if ($("#" +"Utility-" +value.idx +"-tile-content-email-data-title").text() != text){
        $("#" +"Utility-" +value.idx +"-tile-content-email-data-title")
          .hide()
          .text(text)
          .fadeIn(1500)
      }
      // Update the image in case of status chage
      if ($("#" +"Utility-" +value.idx +"-tile-content-email-image-data").attr('src') != deviceImage){
        $("#" +"Utility-" +value.idx +"-tile-content-email-image-data")
          .hide()
          .attr("src", deviceImage)
          .fadeIn(1500)
      }
      // Update the today counter in case of chage
      if ($("#" +"Utility-" +value.idx +"-tile-content-email-data-subtitle").text() != "Today: " +counterToday){
        $("#" +"Utility-" +value.idx +"-tile-content-email-data-subtitle")
          .hide()
          .text("Today: " +counterToday)
          .fadeIn(1500)
      }
      if ($("#" +"Utility-" +value.idx +"-tile-content-email-data-text").text() != value.LastUpdate){        
        $("#" +"Utility-" +value.idx +"-tile-content-email-data-text")
          .hide()
          .text(value.LastUpdate)
          .fadeIn(1500)        
      }
      // Update the tile color
      $("#" +"Utility-" +value.idx +"-tile")
        .removeClass($("#" +"Utility-" +value.idx +"-tile").attr('class'))
        .addClass("tile double live " +deviceTileColor)
        
      // update text if not the same
      if ($("#" +"Temp-" +value.idx +"-tile-content-email-data-title").text() != text){
        $("#" +"Temp-" +value.idx +"-tile-content-email-data-title")
          .hide()
          .text(text)
          .fadeIn(1500)
      }
      // Update the image in case of status chage
      if ($("#" +"Temp-" +value.idx +"-tile-content-email-image-data").attr('src') != deviceImage){
        $("#" +"Temp-" +value.idx +"-tile-content-email-image-data")
          .hide()
          .attr("src", deviceImage)
          .fadeIn(1500)
      }
      if ($("#" +"Temp-" +value.idx +"-tile-content-email-data-text").text() != value.LastUpdate){        
        $("#" +"Temp-" +value.idx +"-tile-content-email-data-text")
          .hide()
          .text(value.LastUpdate)
          .fadeIn(1500)        
      }
      // Update the tile color
      $("#" +"Temp-" +value.idx +"-tile")
        .removeClass($("#" +"Temp-" +value.idx +"-tile").attr('class'))
        .addClass("tile double live " +deviceTileColor)
      
      // update text if not the same
      if ($("#" +"Weather-" +value.idx +"-tile-content-email-data-title").text() != text){
        $("#" +"Weather-" +value.idx +"-tile-content-email-data-title")
          .hide()
          .text(text)
          .fadeIn(1500)
      }
      // Update the image in case of status chage
      if ($("#" +"Weather-" +value.idx +"-tile-content-email-image-data").attr('src') != deviceImage){
        $("#" +"Weather-" +value.idx +"-tile-content-email-image-data")
          .hide()
          .attr("src", deviceImage)
          .fadeIn(1500)
      }
      if ($("#" +"Weather-" +value.idx +"-tile-content-email-data-text").text() != value.LastUpdate){        
        $("#" +"Weather-" +value.idx +"-tile-content-email-data-text")
          .hide()
          .text(value.LastUpdate)
          .fadeIn(1500)        
      }
      // Update the tile color
      $("#" +"Weather-" +value.idx +"-tile")
        .removeClass($("#" +"Weather-" +value.idx +"-tile").attr('class'))
        .addClass("tile double live " +deviceTileColor)

      // Dashboard
      // update text if not the same
      if ($("#" +value.idx +"-tile-content-email-data-title").text() != text){
        $("#" +value.idx +"-tile-content-email-data-title")
          .hide()
          .text(text)
          .fadeIn(1500)
        setTimeout(function(){
          $.Notify({style: {background: '#1ba1e2', color: 'white'}, caption: 'Update...', content: value.Name +" changed to " +text});
        }, 3000);
              
      }
      // Update the image in case of status chage
      if ($("#" +value.idx +"-tile-content-email-image-data").attr('src') != deviceImage){
        $("#" +value.idx +"-tile-content-email-image-data")
          .hide()
          .attr("src", deviceImage)
          .fadeIn(1500)
      }
      if ($("#" +value.idx +"-tile-content-email-data-text").text() != value.LastUpdate){        
        $("#" +value.idx +"-tile-content-email-data-text")
          .hide()
          .text(value.LastUpdate)
          .fadeIn(1500)        
      }
      //if ($("#BatteryStatus-"+value.idx).text() != value.BatteryStatus) {
      //  $("#BatteryStatus-"+value.idx)
      //  .hide()
      //  .text(value.BatteryStatus)
      //  .fadeIn(1500)
      //}
      // Update the tile color
      if ((value.Type == "Usage") || (value.Type == "Temp") || (value.Type == "Temp + Humidity")) {
        $("#" +virtualDeviceName +"-tile")
          .removeClass($("#" +virtualDeviceName +"-tile").attr('class'))
          .addClass("tile double live " +deviceTileColor)
      }
    })
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
        tileColor = "blue"
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
            tileColor = "blue"
        break;    
      }
    }
    else {
      tileColor = "blue"
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
      //case "Temp + Humidity":
      //  var deviceImage = "../images/temp48.png"
      //break;
      //case "Temp + Humidity + Baro":
      //  var deviceImage = "../images/gauge48.png"
      //break;
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
      
  updateDomoticzTabs = function(){
    var device = combinedDeviceList
    var tabName
    device.forEach(function(value, key){
    
      switch(value.Type){
        case "Lighting 2":
          tabName = "Lights"
          var tileGroupName = value.SwitchType.replace(/[_\s]/g, '').replace(/[^a-z0-9-\s]/gi, '')
        break;
        
        case "Temp":
        case "Temp + Humidity":
        case "Temp + Humidity + Baro":
          tabName = "Temp"
          var tileGroupName = value.Type.replace(/[_\s]/g, '').replace(/[^a-z0-9-\s]/gi, '')
        break;
        
        case "Usage":
        case "Energy":
        case "Current":
        case "Current/Energy":
        case "Fan":
        case "Air Quality":
        case "Lux":
        case "Weight":
        case "Thermostat":
          tabName = "Utility"
          var tileGroupName = value.Type.replace(/[_\s]/g, '').replace(/[^a-z0-9-\s]/gi, '')
          if (typeof(counterToday)  === "undefined"){
            counterToday = "0.0 kWh"
          }
        break;
        
        case "Rain":
        case "Wind":
          tabName = "Weather"
          var tileGroupName = value.Type.replace(/[_\s]/g, '').replace(/[^a-z0-9-\s]/gi, '')
        break;        
      }
      switch(value.SubType){
        case "Gas":
        case "RFXMeter counter":
        case "Percentage":
        case "Soil Moisture":
        case "Voltage":
        case "A/D":
        case "Pressure":
          tabName = "Utility"
          var tileGroupName = value.Type.replace(/[_\s]/g, '').replace(/[^a-z0-9-\s]/gi, '')
          var counterToday = value.CounterToday
          if (typeof(counterToday)  === "undefined"){
            counterToday = "0.0 kWh"
          }
        break;
        case "Solar Radiation":
          tabName = "Weather"
          var tileGroupName = value.Type.replace(/[_\s]/g, '').replace(/[^a-z0-9-\s]/gi, '')
        break;        
        
      }
      //switch(value.HardwareName){
      //  case "Forecast IO":
      //  case "Weather Underground":
      //    tabName = "Weather"
      //    var tileGroupName = value.HardwareName.replace(/[_\s]/g, '').replace(/[^a-z0-9-\s]/gi, '')
      //  break;
      //}

      //Read the data or status      
      switch(value.SwitchType){
        case undefined:
          var text = value.Data
        break;
        default:
          var text = value.Status
        break;
      }
      
      
      //Create The live Tiles
        var idx = value.idx
        var deviceImage = getDeviceImage(value.Type, value.SubType, value.SwitchType, text)
        var deviceTileColor = getDeviceTileColor(value.Type, value.SubType, value.SwitchType, text, counterToday)
      
        if(!$("#" +tabName +"-tile-group").length) {
          $("<section></section>")
            .attr("id", tabName +"-tile-group")
            .appendTo("#content-wrapper")
            .addClass("tile-group four-wide red")
          $("<h2></h2>")
            .appendTo("#" +tabName +"-tile-group")
            .text(tabName)
        }
        
        if(!$("#" +tabName +"-" +value.idx +"-tile-group-live-tile").length) {
          $("<div></div>")
            .attr("id", tabName +"-" +value.idx +"-tile-group-live-tile")
            .appendTo("#" +tabName +"-tile-group")
            .addClass("live-tile two-wide float-right metrojs-carousel")
            .attr("data-bounce", "true")
            .attr("data-bounce-dir", "edges")
            .attr("data-mode", "carousel")
            .attr("data-direction", "horizontal")
            .attr("data-slide-direction", "forward")
            .attr("data-pause-onhover", "true")
            .attr("data-swap", "image")
            .attr("data-stops", "100%")
            .attr("data-delay","3500")
          $("<div></div>")
            .attr("id", tabName +"-" +value.idx +"-tile-group-live-tile-title")
            .appendTo("#" +tabName +"-" +value.idx +"-tile-group-live-tile")
            .addClass("accent orange") // +tileColor)
          $("<span></span>")
          	.appendTo("#" +tabName +"-" +value.idx +"-tile-group-live-tile-title")
            .addClass("tile-title") // +tileColor)
            .text(value.Name)
          $("<p></p>")
          	.attr("id", tabName +"-" +value.idx +"-tile-group-live-tile-title-p")
          	.appendTo("#" +tabName +"-" +value.idx +"-tile-group-live-tile-title")
          $("<img></img>")
          	.attr("id", tabName +"-" +value.idx +"-tile-group-live-tile-title-p-img")
          	.appendTo("#" +tabName +"-" +value.idx +"-tile-group-live-tile-title-p")
          	.addClass("full")
          	.attr("src", deviceImage)
          	//.text(text)
          $("<span></span>")
          	.attr("id", tabName +"-" +value.idx +"-tile-group-live-tile-title-p-span")
          	.appendTo("#" +tabName +"-" +value.idx +"-tile-group-live-tile-title-p")
          	.addClass("clear-fix metroExtraLarge")
          	.text(text)
          //$("<strong></strong>")
          //	.appendTo("#" +tabName +"-" +value.idx +"-tile-group-live-tile-title-p-span")
          //	.addClass("clear-fix")
          //	.text(text)
          $("<span></span>")
          	.attr("id", tabName +"-" +value.idx +"-tile-group-live-tile-title-p")
          	.appendTo("#" +tabName +"-" +value.idx +"-tile-group-live-tile-title-p")
          	.addClass("clear-fix")
          	.text(value.LastUpdate)
          
        }
        /*
        // create a tile for each virtual device
        if(!$("#" +tabName +"-" +value.idx +"-tile").length) {
          // Create the tile for the virtual deivce
          $("<a></a>")
            .attr("id", tabName +"-" +value.idx +"-tile")
            .appendTo("#" +tabName +"-" +tileGroupName +"-tile-group")
            .addClass("tile double live " +deviceTileColor)
            .attr("data-role","live-tile")
            .attr("data-effect","slideUpDown")
            .data("deviceIdx", value.idx)
            .data("deviceStatus", text)
            .data("deviceSetLevel", value.LevelInt)
            //.attr("data-click","transform")
            //.attr("draggable","true")
            .attr("onclick", "switchLights(this)")
        }
        if(!$("#" +tabName +"-" +value.idx +"-tile-brand").length){
          $("<div></div>")
            .attr("id", tabName +"-" +value.idx +"-tile-brand")
            .appendTo("#" +tabName +"-" +value.idx +"-tile")
            .addClass("brand")
          $("<div></div>")
            .attr("id", tabName +"-" +value.idx +"-tile-brand-label")
            .appendTo("#" +tabName +"-" +value.idx +"-tile-brand")
            .addClass("label")
          $("<div></div>")
            .attr("id", tabName +"-" +value.idx +"-tile-brand-label-heading")
            .appendTo("#" +tabName +"-" +value.idx +"-tile-brand-label")
            .addClass("no-margin fg-white")
            .text(value.Name)
          $("<div></div>")
            .attr("id", tabName +"-" +value.idx +"-tile-brand-badge")
            .appendTo("#" +tabName +"-" +value.idx +"-tile-brand")
            .addClass("badge")
          $("<span></span>")
            .attr("id", tabName +"-" +value.idx +"-tile-brand-badge-data")
            .appendTo("#" +tabName +"-" +value.idx +"-tile-brand-badge")
            .text(value.idx)
        }

        // add a tile content block each real device in the virtual device tile
        if(!$("#" +tabName +"-" +value.idx +"-tile-content").length){
          $("<div></div>")
          .attr("id", tabName +"-" +value.idx +"-tile-content")
          .appendTo("#" +tabName +"-" +value.idx +"-tile")
          .addClass("tile-content email")
          .attr("style", "display: block;")
        }
    
        // add the icon and value
        if(!$("#" +tabName +"-" +value.idx +"-tile-content-email-image").length){
          $("<div></div>")
            .attr("id", tabName +"-" +value.idx +"-tile-content-email-image")
            .appendTo("#" +tabName +"-" +value.idx +"-tile-content")
            .addClass("email-image")
          $("<img></img>")
            .attr("id", tabName +"-" +value.idx +"-tile-content-email-image-data")
            .appendTo("#" +tabName +"-" +value.idx +"-tile-content-email-image")
            .attr("src", deviceImage)
        }      
        if(!$("#" +tabName +"-" +value.idx +"-tile-content-email-data").length){
          // add data or status
          $("<div></div>")
            .attr("id", tabName +"-" +value.idx +"-tile-content-email-data")
            .appendTo("#" +tabName +"-" +value.idx +"-tile-content")
            .addClass("email-data")
          $("<span></span>")
            .attr("id", tabName +"-" +value.idx +"-tile-content-email-data-title")
            .appendTo("#" +tabName +"-" +value.idx +"-tile-content-email-data" )
            .addClass("email-data-title")
            .text(text)
          if(value.Type == "Energy"){
            $("<span></span>")
              .attr("id", tabName +"-" +value.idx +"-tile-content-email-data-subtitle")
              .appendTo("#" +tabName +"-" +value.idx +"-tile-content-email-data" )
              .addClass("email-data-subtitle fg-darkCobalt")
              .text("Today: " +counterToday)
            }
          $("<span></span>")
            .attr("id", tabName +"-" +value.idx +"-tile-content-email-data-text")
            .appendTo("#" +tabName +"-" +value.idx +"-tile-content-email-data" )
            .addClass("email-data-text fg-gray")
            .text(value.LastUpdate)
        }        
        */
    })  
  }
  
  //Create Dashboard Tab
  updateDashboard = function(){
    //timerUpdateDashboard = setTimeout(updateDashboard, 5000)

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
      if(!$("#" +"tile-area").length) {
        $("<div></div>")
          .attr("id", "tile-area")
          .appendTo("#tab-Dashboard")
          .addClass("tile-area tile-area-dark")
        $("<h1></h1>")
          .attr("id", "tile-area-title")
          .appendTo("#tile-area")
          .addClass("tile-area-title fg-white")
        //  .text("Dashboard")
        //$(“<a></a>")
        //  .attr("id", "tile-area-title-href")
        //  .attr("href", "#tab-Lights")
        //  .appendTo("#tile-area-title")
        //$(“<i></i>")
        //  .attr("id", "tile-area-title-href-image")
        //  .appendTo("#tile-area-title-href")
        //  .addClass("icon-arrow-right-3 fg-white smaller")
        //$(“<i></i>")
        //  .attr("id", "tile-area-title-href-image")
        //  .appendTo("#tile-area-title-href")
        //  .addClass("on-left icon-arrow-left-3 fg-white smaller")

      }
      if(!$("#" +virtualDeviceType +"-tile-group").length) {
        $("<div></div>")
          .attr("id", virtualDeviceType +"-tile-group")
          //.appendTo("#dashboard")
          .appendTo("#tile-area")
          .addClass("tile-group")
        $("<div></div>")
          .attr("id", "tile-group-title")
          .appendTo("#" +virtualDeviceType +"-tile-group")
          .addClass("tile-group-title")
          .text(virtualDeviceType)
      }
      // create a tile for each virtual device
      if(!$("#" +virtualDeviceName +"-tile").length) {
        // Create the tile for the virtual deivce
        $("<a></a>")
          .attr("id", virtualDeviceName +"-tile")
          .appendTo("#" +virtualDeviceType +"-tile-group")
          .addClass("tile double live " +deviceTileColor)
          .attr("data-role","live-tile")
          .attr("data-effect","slideUpDown")
          .attr("data-click","transform")

      }
      if(!$("#" +virtualDeviceName +"-tile-brand").length){
        $("<div></div>")
          .attr("id", virtualDeviceName +"-tile-brand")
          .appendTo("#" +virtualDeviceName +"-tile")
          .addClass("brand")
        $("<div></div>")
          .attr("id", virtualDeviceName +"-tile-brand-label")
          .appendTo("#" +virtualDeviceName +"-tile-brand")
          .addClass("label")
        //$("<h3></h3>")
        $("<div></div>")
          .attr("id", virtualDeviceName +"-tile-brand-label-heading")
          .appendTo("#" +virtualDeviceName +"-tile-brand-label")
          .addClass("no-margin fg-white")
          .text(deviceName)
        //$("<span></span>")
          //.attr("id", virtualDeviceName +"-tile-brand-label-heading-data")
          //.appendTo("#" +virtualDeviceName +"-tile-brand-label-heading")
          //.addClass(virtualDeviceTypeClass)
          //.text(virtualDeviceName)
        $("<div></div>")
          .attr("id", virtualDeviceName +"-tile-brand-badge")
          .appendTo("#" +virtualDeviceName +"-tile-brand")
          .addClass("badge")
        $("<span></span>")
          .attr("id", virtualDeviceName +"-tile-brand-badge-data")
          .appendTo("#" +virtualDeviceName +"-tile-brand-badge")
          .text(value.VirtualDeiceIdx)
      }
      
      // add a tile content block each real device in the virtual device tile
      if(!$("#" +value.idx +"-tile-content").length){
        $("<div></div>")
          .attr("id", value.idx +"-tile-content")
          .appendTo("#" +virtualDeviceName +"-tile")
          .addClass("tile-content email")
      }
      
      // add the icon and value
      if(!$("#" +value.idx +"-tile-content-email-image").length){
        $("<div></div>")
          .attr("id", value.idx +"-tile-content-email-image")
          .appendTo("#" +value.idx +"-tile-content")
          .addClass("email-image")
          //.addClass(deviceImage)
        $("<img></img>")
          .attr("id", value.idx +"-tile-content-email-image-data")
          .appendTo("#" +value.idx +"-tile-content-email-image")
          .attr("src", deviceImage)
      }      
      if(!$("#" +value.idx +"-tile-content-email-data").length){
        // add data or status
        $("<div></div>")
          .attr("id", value.idx +"-tile-content-email-data")
          .appendTo("#" +value.idx +"-tile-content")
          .addClass("email-data")
        $("<span></span>")
          .attr("id", value.idx +"-tile-content-email-data-title")
          .appendTo("#" +value.idx +"-tile-content-email-data" )
          .addClass("email-data-title")
          .text(text)
        $("<span></span>")
          .attr("id", value.idx +"-tile-content-email-data-subtitle")
          .appendTo("#" +value.idx +"-tile-content-email-data" )
          .addClass("email-data-subtitle fg-darkCobalt")
          .text(value.Name)
        $("<span></span>")
          .attr("id", value.idx +"-tile-content-email-data-text")
          .appendTo("#" +value.idx +"-tile-content-email-data" )
          .addClass("email-data-text fg-gray")
          .text(value.LastUpdate)
      }

    })        
  }
}(jQuery, window, document));

$(document).ready(function() {
  updateDevices()
  //updateDashboard()
  updateDomoticzTabs()
});
