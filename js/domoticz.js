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
		    if (typeof device.WindScale != 'undefined') {
			    $.myglobals.windscale=parseFloat(device.WindScale);
		    }
		    if (typeof device.WindSign != 'undefined') {
			    $.myglobals.windsign=device.WindSign;
		    }
		    if (typeof device.TempScale != 'undefined') {
			    $.myglobals.tempscale=parseFloat(device.TempScale);
		    }
		    if (typeof device.TempSign != 'undefined') {
			    $.myglobals.tempsign=device.TempSign;
		    }
        
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


  // get chart data
  $.getchartData = function(idx, sensorType, range){
    var chartdata = [];
    $.ajax({
      url: '/json.htm?type=graph&sensor=' +sensorType +'&idx=' +idx +'&range=' +range,
      async: false,
      dataType: 'json',
      success: function (json) {
        chartdata = json;
      }
    });
    return chartdata;
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
    ShowNotify(('Switching') + ' ' + (switchcmd));
    $.ajax({
      url: '/json.htm?type=command&param=switchlight&idx='+idx+'&switchcmd='+switchcmd+'&level='+level,
      async: false,
      dataType: 'json',
      success: function(data) {
        if (data.status=="ERROR") {
          HideNotify();
          bootbox.alert(('Problem sending switch command'));
        }
        //wait 1 second
        setTimeout(function() {
        HideNotify();
        refreshfunction();
        }, 1000);
      },
      error: function(){
        HideNotify();
        alert(('Problem sending switch command'));
      } 
    });
  }
  
  //update light switch
  $.updateScene = function(idx, switchcmd){
    ShowNotify(('Switching') + ' ' + (switchcmd));    
    $.ajax({
      url: '/json.htm?type=command&param=switchscene&idx='+idx+'&switchcmd='+switchcmd,
      async: false,
      dataType: 'json',
      success: function(data) {
        if (data.status=="ERROR") {
          HideNotify();
          bootbox.alert(('Problem sending switch command'));
        }
        //wait 1 second
        setTimeout(function() {
        HideNotify();
        refreshfunction();
        }, 1000);
      },
      error: function(){
        HideNotify();
        alert(('Problem sending switch command'));
      } 
    });
  }
  
  tileClickHandler = function(obj){
    var idx = $(obj).data("deviceIdx")
    var type = $(obj).data("deviceType")
    var name = $(obj).data("deviceName")
    var switchTypeVal = $(obj).data("deviceSwitchTypeVal")
    switch (type){
      case "Lighting 2":
        var switchcmd = (($(obj).data("deviceStatus") == "On") ? "Off" : "On")
        $.updateLightSwitch(idx,switchcmd)
        //store the new switch state in the object
        $(obj).data("deviceStatus", switchcmd)
      break;
      case "Energy":
        //alert("Energy")
        ShowCounterLogSpline("#container",idx,name,switchTypeVal)
        $('#chartPopup').modal('show')
      break;
      case "Usage":
        //alert("Usage")
        ShowUsageLog("#container",idx,name)
        $('#chartPopup').modal('show')
      break;
      case "Temp":
      case "Temp + Humidity":
      case "Temp + Humidity + Baro":
        ShowTempLog("#container",idx,name)
        $('#chartPopup').modal('show')
      break;
    }
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
    devices = $.getUseddevices()
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
          //var device = $.getDevice(deviceidx[i])
          var device = $.grep(devices.result, function(obj) {
            return obj.idx === deviceidx[i];
          });
          if (device !== undefined && device != ""){
            var object = $.extend({}, device[0], tempObj);
            combinedDeviceList.push(object)
          }
          else {
            //alert("Not found " +deviceidx[i])
          }
          
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
    //var device = combinedDeviceList
    var device = devices.result
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
          .data("deviceType", value.Type)
          .data("deviceName", value.Name)
          .data("deviceSwitchTypeVal", value.SwitchTypeVal)
          .attr("onclick", "tileClickHandler(this)")
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
          .data("virtualDeviceIdx", vdidx)
          
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
    
    var device = devices.result
    device.forEach(function(value, key){
      //var deviceName = value.VirtualDeivceName
      //var virtualDeviceName = deviceName.replace(/[_\s]/g, '').replace(/[^a-z0-9-\s]/gi, '');
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
    })       
    // Update Dashboard tile content
    var virtualdevice = combinedDeviceList
    virtualdevice.forEach(function(value, key){
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
  
  ShowNotify = function(txt, timeout, iserror)
  {
    //$("#notification").html('<strong>' + txt + '</strong>');
    $("#notificationtext").text(txt)
    if (typeof iserror != 'undefined') {
      $("#notificationtext").css("color","red");
    } else {
      $("#notificationtext").css("color","#204060");
    }
    //$("#notification").center();
    //$("#notification").attr("align", "center")
    //$("#notification").fadeIn("slow");
    $('#notification').modal('show')

    if (typeof timeout != 'undefined') {
      setTimeout(function() {
        HideNotify();
      }, timeout);
    }
  }

  HideNotify = function()
  {
    //$("#notification").hide();
    $('#notification').modal('hide')
  }
  
  
  GetUTCFromString = function(s)
  {
      return Date.UTC(
        parseInt(s.substring(0, 4), 10),
        parseInt(s.substring(5, 7), 10) - 1,
        parseInt(s.substring(8, 10), 10),
        parseInt(s.substring(11, 13), 10),
        parseInt(s.substring(14, 16), 10),
        0
      );
  }

  GetUTCFromStringSec = function(s)
  {
      return Date.UTC(
        parseInt(s.substring(0, 4), 10),
        parseInt(s.substring(5, 7), 10) - 1,
        parseInt(s.substring(8, 10), 10),
        parseInt(s.substring(11, 13), 10),
        parseInt(s.substring(14, 16), 10),
        parseInt(s.substring(17, 19), 10)
      );
  }

  GetDateFromString = function(s)
  {
      return Date.UTC(
        parseInt(s.substring(0, 4), 10),
        parseInt(s.substring(5, 7), 10) - 1,
        parseInt(s.substring(8, 10), 10));
  }

  GetPrevDateFromString = function(s)
  {
      return Date.UTC(
        parseInt(s.substring(0, 4), 10)+1,
        parseInt(s.substring(5, 7), 10) - 1,
        parseInt(s.substring(8, 10), 10));
  }  
  
  Get5MinuteHistoryDaysGraphTitle = function()
  {
    if ($.FiveMinuteHistoryDays==1) {
      return "Last" + " 24 " + "Hours";
    }
    else if  ($.FiveMinuteHistoryDays==2) {
      return "Last" + " 48 " + "Hours";
    }
    return "Last" + " " + $.FiveMinuteHistoryDays + " " + "Days";
  }
  
  CheckForUpdate = function(showdialog) {
  $.ajax({
     url: "/json.htm?type=command&param=checkforupdate&forced=" + showdialog,
     async: false, 
     dataType: 'json',
     success: function(data) {
      var urights=data.statuscode;
      var bDisplayLogout=false;
      $.FiveMinuteHistoryDays=data["5MinuteHistoryDays"];
      $.AllowWidgetOrdering=data["AllowWidgetOrdering"];
      if (urights!=3) {
        bDisplayLogout=true;
      }
      else {
        bDisplayLogout=false;
        urights=2;
      }
      window.my_config =
      {
        userrights : urights
      };
                 }
          })
  }
  
  chartPointClickNew = function(event, isShort, retChart) {
    if (event.shiftKey!=true) {
      return;
    }
    if (window.my_config.userrights!=2) {
          HideNotify();
      ShowNotify(('You do not have permission to do that!'), 2500, true);
      return;
    }
    var dateString;
    if (isShort==false) {
      dateString=Highcharts.dateFormat('%Y-%m-%d', event.point.x);
    }
    else {
      dateString=Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', event.point.x);
    }
    var bValid = false;
    bValid=(confirm(("Are you sure to remove this value at") + " ?:\n\nDate: " + dateString + " \nValue: " + event.point.y)==true);
    if (bValid == false) {
      return;
    }
    $.ajax({
       url: "/json.htm?type=command&param=deletedatapoint&idx=" + $.devIdx + "&date=" + dateString,
       async: false, 
       dataType: 'json',
       success: function(data) {
        if (data.status == "OK") {
          retChart($.content,$.devIdx,$.devName);
        }
        else {
          ShowNotify(('Problem deleting data point!'), 2500, true);
        }
       },
       error: function(){
        ShowNotify(('Problem deleting data point!'), 2500, true);
       }     
    });   
  } 
  
  chartPointClickNewEx = function(event, isShort, retChart) {
    if (event.shiftKey!=true) {
      return;
    }
    if (window.my_config.userrights!=2) {
          HideNotify();
      ShowNotify(('You do not have permission to do that!'), 2500, true);
      return;
    }
    var dateString;
    if (isShort==false) {
      dateString=Highcharts.dateFormat('%Y-%m-%d', event.point.x);
    }
    else {
      dateString=Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', event.point.x);
    }
    var bValid = false;
    bValid=(confirm(("Are you sure to remove this value at") + " ?:\n\nDate: " + dateString + " \nValue: " + event.point.y)==true);
    if (bValid == false) {
      return;
    }
    $.ajax({
       url: "/json.htm?type=command&param=deletedatapoint&idx=" + $.devIdx + "&date=" + dateString,
       async: false, 
       dataType: 'json',
       success: function(data) {
        if (data.status == "OK") {
          retChart($.content,$.devIdx,$.devName,$.devSwitchType);
        }
        else {
          ShowNotify(('Problem deleting data point!'), 2500, true);
        }
       },
       error: function(){
        ShowNotify(('Problem deleting data point!'), 2500, true);
       }     
    });   
  }   
  
  AddDataToUtilityChart = function(data,chart,switchtype)
  {
      var datatableUsage1 = [];
      var datatableUsage2 = [];
      var datatableReturn1 = [];
      var datatableReturn2 = [];
      var datatableTotalUsage = [];
      var datatableTotalReturn = [];

      var datatableUsage1Prev = [];
      var datatableUsage2Prev = [];
      var datatableReturn1Prev = [];
      var datatableReturn2Prev = [];
      var datatableTotalUsagePrev = [];
      var datatableTotalReturnPrev = [];

    var bHaveDelivered=(typeof data.delivered!= 'undefined');

    var bHavePrev=(typeof data.resultprev!= 'undefined');
    if (bHavePrev)
    {
      $.each(data.resultprev, function(i,item)
      {
        var cdate=GetPrevDateFromString(item.d);
        datatableUsage1Prev.push( [cdate, parseFloat(item.v) ] );
        if (typeof item.v2!= 'undefined') {
          datatableUsage2Prev.push( [cdate, parseFloat(item.v2) ] );
        }
        if (bHaveDelivered) {
          datatableReturn1Prev.push( [cdate, parseFloat(item.r1) ] );
          if (typeof item.r2!= 'undefined') {
            datatableReturn2Prev.push( [cdate, parseFloat(item.r2) ] );
          }
        }
        if (datatableUsage2Prev.length>0) {
          datatableTotalUsagePrev.push( [cdate, parseFloat(item.v)+parseFloat(item.v2) ] );
        }
        else {
          datatableTotalUsagePrev.push( [cdate, parseFloat(item.v) ] );
        }
        if (datatableUsage2Prev.length>0) {
          datatableTotalReturnPrev.push( [cdate, parseFloat(item.r1)+parseFloat(item.r2) ] );
        }
        else {
          if (typeof item.r1!= 'undefined') {
            datatableTotalReturnPrev.push( [cdate, parseFloat(item.r1) ] );
          }
        }
      });
    }
  
      $.each(data.result, function(i,item)
      {
        if (chart == $.DayChart) {
          var cdate=GetUTCFromString(item.d);
          datatableUsage1.push( [cdate, parseFloat(item.v) ] );
          if (typeof item.v2!= 'undefined') {
            datatableUsage2.push( [cdate, parseFloat(item.v2) ] );
          }
          if (bHaveDelivered) {
            datatableReturn1.push( [cdate, parseFloat(item.r1) ] );
            if (typeof item.r2!= 'undefined') {
              datatableReturn2.push( [cdate, parseFloat(item.r2) ] );
            }
          }
        }
        else {
          var cdate=GetDateFromString(item.d);
          datatableUsage1.push( [cdate, parseFloat(item.v) ] );
          if (typeof item.v2!= 'undefined') {
            datatableUsage2.push( [cdate, parseFloat(item.v2) ] );
          }
          if (bHaveDelivered) {
            datatableReturn1.push( [cdate, parseFloat(item.r1) ] );
            if (typeof item.r2!= 'undefined') {
              datatableReturn2.push( [cdate, parseFloat(item.r2) ] );
            }
          }
          if (datatableUsage2.length>0) {
            datatableTotalUsage.push( [cdate, parseFloat(item.v)+parseFloat(item.v2) ] );
          }
          else {
            datatableTotalUsage.push( [cdate, parseFloat(item.v) ] );
          }
          if (datatableUsage2.length>0) {
            datatableTotalReturn.push( [cdate, parseFloat(item.r1)+parseFloat(item.r2) ] );
          }
          else {
            if (typeof item.r1!= 'undefined') {
              datatableTotalReturn.push( [cdate, parseFloat(item.r1) ] );
            }
          }
        }
      });

      var series;
      if (switchtype==0)
      {
      if ((chart == $.DayChart)||(chart == $.WeekChart)) {
        var totDecimals=3;
        if (chart == $.DayChart) {
          totDecimals=0;
        }
        if (datatableUsage1.length>0) {
          if (datatableUsage2.length>0) {
            chart.highcharts().addSeries({
              id: 'usage1',
              name: 'Usage_1',
              tooltip: {
                valueSuffix: ' Watt',
                valueDecimals: totDecimals
              },
              color: 'rgba(60,130,252,0.8)',
              stack: 'susage',
              yAxis: 0
            });
          }
          else {
            chart.highcharts().addSeries({
              id: 'usage1',
              name: 'Usage',
              tooltip: {
                valueSuffix: ' Watt',
                valueDecimals: totDecimals
              },
              color: 'rgba(3,190,252,0.8)',
              stack: 'susage',
              yAxis: 0
            });
          }
          series = chart.highcharts().get('usage1');
          series.setData(datatableUsage1);
        }
        if (datatableUsage2.length>0) {
          chart.highcharts().addSeries({
            id: 'usage2',
            name: 'Usage_2',
            tooltip: {
              valueSuffix: ' Watt',
              valueDecimals: totDecimals
            },
            color: 'rgba(3,190,252,0.8)',
            stack: 'susage',
            yAxis: 0
          });
          series = chart.highcharts().get('usage2');
          series.setData(datatableUsage2);
        }
        if (bHaveDelivered) {
          if (datatableReturn1.length>0) {
            chart.highcharts().addSeries({
              id: 'return1',
              name: 'Return_1',
              tooltip: {
                valueSuffix: ' Watt',
                valueDecimals: totDecimals
              },
              color: 'rgba(30,242,110,0.8)',
              stack: 'sreturn',
              yAxis: 0
            });
            series = chart.highcharts().get('return1');
            series.setData(datatableReturn1);
          }
          if (datatableReturn2.length>0) {
            chart.highcharts().addSeries({
              id: 'return2',
              name: 'Return_2',
              tooltip: {
                valueSuffix: ' Watt',
                valueDecimals: totDecimals
              },        
              color: 'rgba(3,252,190,0.8)',
              stack: 'sreturn',
              yAxis: 0
            });
            series = chart.highcharts().get('return2');
            series.setData(datatableReturn2);
          }
        }
      }
      else {
        //month/year, show total for now
        if (datatableTotalUsage.length>0) {
          chart.highcharts().addSeries({
            id: 'usage',
            name: 'Total_Usage',
            zIndex: 1,
            tooltip: {
              valueSuffix: ' kWh',
              valueDecimals: 3
            },
            color: 'rgba(3,190,252,0.8)',
            yAxis: 0
          });
          series = chart.highcharts().get('usage');
          series.setData(datatableTotalUsage);
        }
        if (bHaveDelivered) {
          if (datatableTotalReturn.length>0) {
            chart.highcharts().addSeries({
              id: 'return',
              name: 'Total_Return',
              zIndex: 1,
              tooltip: {
                valueSuffix: ' kWh',
                valueDecimals: 3
              },
              color: 'rgba(3,252,190,0.8)',
              yAxis: 0
            });
            series = chart.highcharts().get('return');
            series.setData(datatableTotalReturn);
          }
        }
        if (datatableTotalUsagePrev.length>0) {
          chart.highcharts().addSeries({
            id: 'usageprev',
            name: 'Past_Usage',
            tooltip: {
              valueSuffix: ' kWh',
              valueDecimals: 3
            },
            color: 'rgba(190,3,252,0.8)',
            yAxis: 0
          });
          series = chart.highcharts().get('usageprev');
          series.setData(datatableTotalUsagePrev);
          series.setVisible(false);
        }
        if (bHaveDelivered) {
          if (datatableTotalReturnPrev.length>0) {
            chart.highcharts().addSeries({
              id: 'returnprev',
              name: 'Past_Return',
              tooltip: {
                valueSuffix: ' kWh',
                valueDecimals: 3
              },
              color: 'rgba(252,190,3,0.8)',
              yAxis: 0
            });
            series = chart.highcharts().get('returnprev');
            series.setData(datatableTotalReturnPrev);
            series.setVisible(false);
          }
        }
      }

      if (chart == $.DayChart) {
        chart.highcharts().yAxis[0].axisTitle.attr({
          text: ('Energy') + ' Watt'
        });      
      }
      else {
        chart.highcharts().yAxis[0].axisTitle.attr({
          text: ('Energy') + ' kWh'
        });      
      }
      chart.highcharts().yAxis[0].redraw();
      }
      else if (switchtype==1)
      {
      //gas
      chart.highcharts().addSeries({
            id: 'gas',
            name: 'Gas',
        zIndex: 1,
        tooltip: {
          valueSuffix: ' m3',
          valueDecimals: 3
        },
            color: 'rgba(3,190,252,0.8)',
            yAxis: 0
          });
      if ((chart == $.MonthChart)||(chart == $.YearChart)) {
        if (datatableUsage1Prev.length>0) {
          chart.highcharts().addSeries({
            id: 'gasprev',
            name: 'Past_Gas',
            tooltip: {
              valueSuffix: ' m3',
              valueDecimals: 3
            },
            color: 'rgba(190,3,252,0.8)',
            yAxis: 0
          });
          series = chart.highcharts().get('gasprev');
          series.setData(datatableUsage1Prev);
          series.setVisible(false);
        }
      }
      series = chart.highcharts().get('gas');
      series.setData(datatableUsage1);
      chart.highcharts().yAxis[0].axisTitle.attr({
        text: 'Gas m3'
      });      
      }
      else if (switchtype==2)
      {
      //water
      chart.highcharts().addSeries({
            id: 'water',
            name: 'Water',
        tooltip: {
          valueSuffix: ' m3',
          valueDecimals: 3
        },
            color: 'rgba(3,190,252,0.8)',
            yAxis: 0
          });
      chart.highcharts().yAxis[0].axisTitle.attr({
        text: 'Water m3'
      });      
      series = chart.highcharts().get('water');
      series.setData(datatableUsage1);
      }
      else if (switchtype==3)
      {
      //counter
      chart.highcharts().addSeries({
            id: 'counter',
            name: 'Counter',
            color: 'rgba(3,190,252,0.8)',
            yAxis: 0
          });
      chart.highcharts().yAxis[0].axisTitle.attr({
        text: 'Count'
      });      
      series = chart.highcharts().get('counter');
      series.setData(datatableUsage1);
      }
  }

  ShowCounterLogSpline = function(contentdiv,id,name,switchtype)
  {
    //clearInterval($.myglobals.refreshTimer);
    //$('#modal').show();
    
    $.content=contentdiv;
    //$.backfunction=backfunction;
    $.devIdx=id;
    $.devName=name;
    if (typeof switchtype != 'undefined') {
    $.devSwitchType=switchtype;
    }
    else {
    switchtype=$.devSwitchType;
    }
    $('#modaltitle').text(name)

    if ((switchtype==0)||(switchtype==1)||(switchtype==2)) {
    $.costsT1=0.2389;
    $.costsT2=0.2389;
    $.costsGas=0.6218;
    $.costsWater=1.6473;

    $.ajax({
       url: "/json.htm?type=command&param=getcosts&idx="+$.devIdx,
       async: false, 
       dataType: 'json',
       success: function(data) {
        $.costsT1=parseFloat(data.CostEnergy)/10000;
        $.costsT2=parseFloat(data.CostEnergyT2)/10000;
        $.costsGas=parseFloat(data.CostGas)/10000;
        $.costsWater=parseFloat(data.CostWater)/10000;
       }
    });

    $.costsR1=$.costsT1;
    $.costsR2=$.costsT2;

    $.monthNames = [ "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December" ];
      
    var d = new Date();
    var actMonth = d.getMonth()+1;
    var actYear = d.getYear()+1900;
    //$($.content).html(GetBackbuttonHTMLTableWithRight(backfunction,'ShowP1YearReportGas('+actYear+')','Report')+htmlcontent);
    }
    else {
    //$($.content).html(GetBackbuttonHTMLTable(backfunction)+htmlcontent);
    }
    //$($.content).i18n();
    
    $.DayChart = $($.content + ' #daygraph');
    $.DayChart.highcharts({
        chart: {
            type: 'spline',
            width: 850,
            height: 250,
            marginRight: 10,
            zoomType: 'x',
            events: {
                load: function() {
                    
                  $.getJSON("/json.htm?type=graph&sensor=counter&method=1&idx="+id+"&range=day",
                  function(data) {
            AddDataToUtilityChart(data,$.DayChart,switchtype);
                  });
                }
            }
          },
         credits: {
            enabled: true,
            href: "http://www.domoticz.com",
            text: "Domoticz.com"
          },
          title: {
              text: 'Usage' + ' ' + Get5MinuteHistoryDaysGraphTitle()
          },
          xAxis: {
              type: 'datetime',
              labels: {
                formatter: function() {
                  return Highcharts.dateFormat("%H:%M", this.value);
                }
              }
          },
          yAxis: {
              title: {
                  text: 'Energy' + ' (Watt)'
              },
              min: 0
          },
      tooltip: {
        crosshairs: true,
        shared: true
      },
          plotOptions: {
        series: {
          point: {
            events: {
              click: function(event) {
                chartPointClickNew(event,true,ShowCounterLogSpline);
              }
            }
          }
        },
        spline: {
                  lineWidth: 3,
                  states: {
                      hover: {
                          lineWidth: 3
                      }
                  },
                  marker: {
                      enabled: false,
                      states: {
                          hover: {
                              enabled: true,
                              symbol: 'circle',
                              radius: 5,
                              lineWidth: 1
                          }
                      }
                  }
              }
          },
          legend: {
              enabled: false
          }
      });
    $.WeekChart = $($.content + ' #weekgraph');
    $.WeekChart.highcharts({
        chart: {
            type: 'column',
            width: 850,
            height: 300,
            marginRight: 10,
            events: {
                load: function() {
                    
                  $.getJSON("/json.htm?type=graph&sensor=counter&idx="+id+"&range=week",
                  function(data) {
            AddDataToUtilityChart(data,$.WeekChart,switchtype);
                  });
                }
            }
          },
         credits: {
            enabled: true,
            href: "http://www.domoticz.com",
            text: "Domoticz.com"
          },
          title: {
              text: 'Last Week'
          },
          xAxis: {
              type: 'datetime',
              dateTimeLabelFormats: {
                  day: '%a'
              },
              tickInterval: 24 * 3600 * 1000
          },
          yAxis: {
              min: 0,
              maxPadding: 0.2,
              endOnTick: false,
              title: {
                  text: 'Energy' + ' (kWh)'
              }
          },
          tooltip: {
              formatter: function() {
                      var unit = {
                                  'Usage': 'kWh',
                                  'Return': 'kWh',
                                  'Gas': 'm3',
                                  'Past_Gas': 'm3',
                                  'Water': 'm3'
                            }[this.series.name];
                      return (Highcharts.dateFormat('%A',this.x)) + ' ' + Highcharts.dateFormat('%Y-%m-%d', this.x) + '<br/>' + this.series.name + ': ' + this.y + ' ' + unit;
              }
          },
          plotOptions: {
              column: {
                  minPointLength: 4,
                  pointPadding: 0.1,
                  groupPadding: 0,
          dataLabels: {
                          enabled: true,
                          color: 'white'
                  }
              }
          },
          legend: {
              enabled: false
          }
      });

    $.MonthChart = $($.content + ' #monthgraph');
    $.MonthChart.highcharts({
        chart: {
            type: 'spline',
            width: 850,
            height: 300,
            marginRight: 10,
            zoomType: 'x',
            events: {
                load: function() {
                    
                  $.getJSON("/json.htm?type=graph&sensor=counter&idx="+id+"&range=month",
                  function(data) {
            AddDataToUtilityChart(data,$.MonthChart,switchtype);
                  });
                }
            }
          },
         credits: {
            enabled: true,
            href: "http://www.domoticz.com",
            text: "Domoticz.com"
          },
          title: {
              text: 'Last Month'
          },
          xAxis: {
              type: 'datetime'
          },
          yAxis: {
              title: {
                  text: 'Usage'
              },
              min: 0
          },
      tooltip: {
        crosshairs: true,
        shared: true
      },
          plotOptions: {
        series: {
          point: {
            events: {
              click: function(event) {
                chartPointClickNewEx(event,false,ShowCounterLogSpline);
              }
            }
          }
        },
        spline: {
                  lineWidth: 3,
                  states: {
                      hover: {
                          lineWidth: 3
                      }
                  },
                  marker: {
                      enabled: false,
                      states: {
                          hover: {
                              enabled: true,
                              symbol: 'circle',
                              radius: 5,
                              lineWidth: 1
                          }
                      }
                  }
              }
          },
          legend: {
              enabled: true
          }
      });

    $.YearChart = $($.content + ' #yeargraph');
    $.YearChart.highcharts({
        chart: {
            type: 'spline',
            width: 850,
            height: 300,
            marginRight: 10,
            zoomType: 'x',
            events: {
                load: function() {
                    
                  $.getJSON("/json.htm?type=graph&sensor=counter&idx="+id+"&range=year",
                  function(data) {
            AddDataToUtilityChart(data,$.YearChart,switchtype);
                  });
                }
            }
          },
         credits: {
            enabled: true,
            href: "http://www.domoticz.com",
            text: "Domoticz.com"
          },
          title: {
              text: 'Last Year'
          },
          xAxis: {
              type: 'datetime'
          },
          yAxis: {
              title: {
                  text: 'Usage'
              },
              min: 0
          },
      tooltip: {
        crosshairs: true,
        shared: true
      },
          plotOptions: {
        series: {
          point: {
            events: {
              click: function(event) {
                chartPointClickNewEx(event,false,ShowCounterLogSpline);
              }
            }
          }
        },
        spline: {
                  lineWidth: 3,
                  states: {
                      hover: {
                          lineWidth: 3
                      }
                  },
                  marker: {
                      enabled: false,
                      states: {
                          hover: {
                              enabled: true,
                              symbol: 'circle',
                              radius: 5,
                              lineWidth: 1
                          }
                      }
                  }
              }
          },
          legend: {
              enabled: true
          }
      });
  }

  ShowUsageLog = function(contentdiv,id,name)
  {
    //clearInterval($.myglobals.refreshTimer);
    //$('#modal').show();
    $.content=contentdiv;
    //$.backfunction=backfunction;
    $.devIdx=id;
    $.devName=name;
    $('#modaltitle').text(name)
    //$($.content).html(GetBackbuttonHTMLTable(backfunction)+htmlcontent);
    //$($.content).i18n();

    $.DayChart = $($.content + ' #daygraph');
    $.DayChart.highcharts({
        chart: {
            type: 'spline',
            width: 850,
            height: 250,
            zoomType: 'x',
            marginRight: 10,
            events: {
                load: function() {
                  $.getJSON("/json.htm?type=graph&sensor=counter&idx="+id+"&range=day",
                  function(data) {
                        var series = $.DayChart.highcharts().series[0];
                        var datatable = [];
                        
                        $.each(data.result, function(i,item)
                        {
                          datatable.push( [GetUTCFromString(item.d), parseFloat(item.u) ] );
                        });
                        series.setData(datatable);
                  });
                }
            }
          },
         credits: {
            enabled: true,
            href: "http://www.domoticz.com",
            text: "Domoticz.com"
          },
          title: {
              text: ('Usage') + ' '  + Get5MinuteHistoryDaysGraphTitle()
          },
          xAxis: {
              type: 'datetime'
          },
          yAxis: {
              title: {
                  text: ('Usage') + ' (Watt)'
              },
              min: 0
          },
        tooltip: {
          crosshairs: true,
          shared: true
        },
          plotOptions: {
              spline: {
                  lineWidth: 3,
                  states: {
                      hover: {
                          lineWidth: 3
                      }
                  },
                  marker: {
                      enabled: false,
                      states: {
                          hover: {
                              enabled: true,
                              symbol: 'circle',
                              radius: 5,
                              lineWidth: 1
                          }
                      }
                  }
              }
          },
          series: [{
              name: ('Usage'),
        tooltip: {
          valueSuffix: ' Watt',
          valueDecimals: 1
        },
        point: {
          events: {
            click: function(event) {
              chartPointClickNew(event,true,ShowUsageLog);
            }
          }
        }
          }]
          ,
          navigation: {
              menuItemStyle: {
                  fontSize: '10px'
              }
          }
      });

    $.MonthChart = $($.content + ' #monthgraph');
    $.MonthChart.highcharts({
        chart: {
            type: 'spline',
            width: 850,
            height: 300,
            zoomType: 'x',
            marginRight: 10,
            events: {
                load: function() {
                    
                  $.getJSON("/json.htm?type=graph&sensor=counter&idx="+id+"&range=month",
                  function(data) {
                        var datatable1 = [];
                        var datatable2 = [];
                        
                        $.each(data.result, function(i,item)
                        {
                          datatable1.push( [GetDateFromString(item.d), parseFloat(item.u_min) ] );
                          datatable2.push( [GetDateFromString(item.d), parseFloat(item.u_max) ] );
                        });
                        var series1 = $.MonthChart.highcharts().series[0];
                        var series2 = $.MonthChart.highcharts().series[1];
                        series1.setData(datatable1);
                        series2.setData(datatable2);
                  });
                }
            }
          },
         credits: {
            enabled: true,
            href: "http://www.domoticz.com",
            text: "Domoticz.com"
          },
          title: {
              text: ('Usage') + ' ' + ('Last Month')
          },
          xAxis: {
              type: 'datetime'
          },
          yAxis: {
              title: {
                  text: ('Usage') + ' (Watt)'
              },
              min: 0
          },
        tooltip: {
          crosshairs: true,
          shared: true
        },
          plotOptions: {
              spline: {
                  lineWidth: 3,
                  states: {
                      hover: {
                          lineWidth: 3
                      }
                  },
                  marker: {
                      enabled: false,
                      states: {
                          hover: {
                              enabled: true,
                              symbol: 'circle',
                              radius: 5,
                              lineWidth: 1
                          }
                      }
                  }
              }
          },
          series: [{
              name: 'Usage_min',
        tooltip: {
          valueSuffix: ' Watt',
          valueDecimals: 1
        },
        point: {
          events: {
            click: function(event) {
              chartPointClickNew(event,false,ShowUsageLog);
            }
          }
        }
      }, {
              name: 'Usage_max',
        tooltip: {
          valueSuffix: ' Watt',
          valueDecimals: 1
        },
        point: {
          events: {
            click: function(event) {
              chartPointClickNew(event,false,ShowUsageLog);
            }
          }
        }
          }]
          ,
          navigation: {
              menuItemStyle: {
                  fontSize: '10px'
              }
          }
      });

    $.YearChart = $($.content + ' #yeargraph');
    $.YearChart.highcharts({
        chart: {
            type: 'spline',
            width: 850,
            height: 300,
            zoomType: 'x',
            marginRight: 10,
            events: {
                load: function() {
                    
                  $.getJSON("/json.htm?type=graph&sensor=counter&idx="+id+"&range=year",
                  function(data) {
                        var datatable1 = [];
                        var datatable2 = [];
                        
                        $.each(data.result, function(i,item)
                        {
                          datatable1.push( [GetDateFromString(item.d), parseFloat(item.u_min) ] );
                          datatable2.push( [GetDateFromString(item.d), parseFloat(item.u_max) ] );
                        });
                        var series1 = $.YearChart.highcharts().series[0];
                        var series2 = $.YearChart.highcharts().series[1];
                        series1.setData(datatable1);
                        series2.setData(datatable2);
                  });
                }
            }
          },
         credits: {
            enabled: true,
            href: "http://www.domoticz.com",
            text: "Domoticz.com"
          },
          title: {
              text: ('Usage') + ' ' + ('Last Year')
          },
          xAxis: {
              type: 'datetime'
          },
          yAxis: {
              title: {
                  text: ('Usage') + ' (Watt)'
              },
              min: 0
          },
        tooltip: {
          crosshairs: true,
          shared: true
        },
          plotOptions: {
              spline: {
                  lineWidth: 3,
                  states: {
                      hover: {
                          lineWidth: 3
                      }
                  },
                  marker: {
                      enabled: false,
                      states: {
                          hover: {
                              enabled: true,
                              symbol: 'circle',
                              radius: 5,
                              lineWidth: 1
                          }
                      }
                  }
              }
          },
          series: [{
              name: 'Usage_min',
        tooltip: {
          valueSuffix: ' Watt',
          valueDecimals: 1
        },
        point: {
          events: {
            click: function(event) {
              chartPointClickNew(event,false,ShowUsageLog);
            }
          }
        }
      }, {
              name: 'Usage_max',
        tooltip: {
          valueSuffix: ' Watt',
          valueDecimals: 1
        },
        point: {
          events: {
            click: function(event) {
              chartPointClickNew(event,false,ShowUsageLog);
            }
          }
        }
          }]
          ,
          navigation: {
              menuItemStyle: {
                  fontSize: '10px'
              }
          }
      });
  }
  
  AddDataToTempChart = function(data,chart,isday)
  {
      var datatablete = [];
      var datatabletm = [];
      var datatableta = [];
      var datatabletrange = [];
      
      var datatablehu = [];
      var datatablech = [];
      var datatablecm = [];
      var datatabledp = [];
      var datatableba = [];

      var datatablete_prev = [];
      var datatabletm_prev = [];
      var datatableta_prev = [];
      var datatabletrange_prev = [];
      
      var datatablehu_prev = [];
      var datatablech_prev = [];
      var datatablecm_prev = [];
      var datatabledp_prev = [];
      var datatableba_prev = [];

    var bHavePrev=(typeof data.resultprev!= 'undefined');
    if (bHavePrev) {
      $.each(data.resultprev, function(i,item)
      {
        if (typeof item.te != 'undefined') {
          datatablete_prev.push( [GetPrevDateFromString(item.d), parseFloat(item.te) ] );
          datatabletm_prev.push( [GetPrevDateFromString(item.d), parseFloat(item.tm) ] );
          datatabletrange_prev.push( [GetPrevDateFromString(item.d), parseFloat(item.tm), parseFloat(item.te) ] );
          if (typeof item.ta != 'undefined') {
            datatableta_prev.push( [GetPrevDateFromString(item.d), parseFloat(item.ta) ] );
          }
        }
        if (typeof item.hu != 'undefined') {
          datatablehu_prev.push( [GetPrevDateFromString(item.d), parseFloat(item.hu) ] );
        }
        if (typeof item.ch != 'undefined') {
          datatablech_prev.push( [GetPrevDateFromString(item.d), parseFloat(item.ch) ] );
          datatablecm_prev.push( [GetPrevDateFromString(item.d), parseFloat(item.cm) ] );
        }
        if (typeof item.dp != 'undefined') {
          datatabledp_prev.push( [GetPrevDateFromString(item.d), parseFloat(item.dp) ] );
        }
        if (typeof item.ba != 'undefined') {
          datatableba_prev.push( [GetPrevDateFromString(item.d), parseFloat(item.ba) ] );
        }
      });
    }

      $.each(data.result, function(i,item)
      {
        if (isday==1) {
          if (typeof item.te != 'undefined') {
            datatablete.push( [GetUTCFromString(item.d), parseFloat(item.te) ] );
          }
          if (typeof item.hu != 'undefined') {
            datatablehu.push( [GetUTCFromString(item.d), parseFloat(item.hu) ] );
          }
          if (typeof item.ch != 'undefined') {
            datatablech.push( [GetUTCFromString(item.d), parseFloat(item.ch) ] );
          }
          if (typeof item.dp != 'undefined') {
            datatabledp.push( [GetUTCFromString(item.d), parseFloat(item.dp) ] );
          }
          if (typeof item.ba != 'undefined') {
            datatableba.push( [GetUTCFromString(item.d), parseFloat(item.ba) ] );
          }
        } else {
          if (typeof item.te != 'undefined') {
        datatablete.push( [GetDateFromString(item.d), parseFloat(item.te) ] );
        datatabletm.push( [GetDateFromString(item.d), parseFloat(item.tm) ] );
        datatabletrange.push( [GetDateFromString(item.d), parseFloat(item.tm), parseFloat(item.te) ] );
        if (typeof item.ta != 'undefined') {
          datatableta.push( [GetDateFromString(item.d), parseFloat(item.ta) ] );
        }
          }
          if (typeof item.hu != 'undefined') {
            datatablehu.push( [GetDateFromString(item.d), parseFloat(item.hu) ] );
          }
          if (typeof item.ch != 'undefined') {
            datatablech.push( [GetDateFromString(item.d), parseFloat(item.ch) ] );
            datatablecm.push( [GetDateFromString(item.d), parseFloat(item.cm) ] );
          }
          if (typeof item.dp != 'undefined') {
            datatabledp.push( [GetDateFromString(item.d), parseFloat(item.dp) ] );
          }
          if (typeof item.ba != 'undefined') {
            datatableba.push( [GetDateFromString(item.d), parseFloat(item.ba) ] );
          }
        }
      });
      var series;
      if (datatablehu.length!=0)
      {
        chart.addSeries(
          {
            id: 'humidity',
            name: ('Humidity'),
            color: 'limegreen',
            yAxis: 1,
        tooltip: {
          valueSuffix: ' %',
          valueDecimals: 0
        }          
          }
        );
        series = chart.get('humidity');
        series.setData(datatablehu);
      }

      if (datatablech.length!=0)
      {
        chart.addSeries(
          {
            id: 'chill',
            name: ('Chill'),
            color: 'red',
        zIndex: 1,
        tooltip: {
          valueSuffix: ' \u00B0' + $.myglobals.tempsign,
          valueDecimals: 1
        },
            yAxis: 0
          }
        );
        series = chart.get('chill');
        series.setData(datatablech);
        
        if (isday==0) {
        chart.addSeries(
        {
          id: 'chillmin',
          name: ('Chill') + '_min',
          color: 'rgba(255,127,39,0.8)',
          linkedTo: ':previous',
          zIndex: 1,
          tooltip: {
            valueSuffix: ' \u00B0' + $.myglobals.tempsign,
            valueDecimals: 1
          },
          yAxis: 0
        });
        series = chart.get('chillmin');
        series.setData(datatablecm);
        }
      }
      if (datatablete.length!=0)
      {
        //Add Temperature series

      if (isday==1) {
        chart.addSeries(
        {
          id: 'temperature',
          name: ('Temperature'),
          color: 'yellow',
          yAxis: 0,
          tooltip: {
            valueSuffix: ' \u00B0' + $.myglobals.tempsign,
            valueDecimals: 1
          }
        }
        );
        series = chart.get('temperature');
        series.setData(datatablete);
      }
      else {
        //Min/Max range
        if (datatableta.length!=0) {
          chart.addSeries(
            {
            id: 'temperature_avg',
            name: ('Temperature') + '_avg',
            color: 'yellow',
            fillOpacity: 0.7,
            yAxis: 0,
            zIndex: 2,
            tooltip: {
              valueSuffix: ' \u00B0' + $.myglobals.tempsign,
              valueDecimals: 1
            }          
            }
          );
          series = chart.get('temperature_avg');
          series.setData(datatableta);
        }
        if (datatabletrange.length!=0) {
          chart.addSeries(
            {
            id: 'temperature',
            name: ('Temperature') + '_range',
            color: 'rgba(3,190,252,1.0)',
            type: 'areasplinerange',
            linkedTo: ':previous',
            zIndex: 0,
            lineWidth: 0,
            fillOpacity: 0.5,
            yAxis: 0,
            tooltip: {
              valueSuffix: ' \u00B0' + $.myglobals.tempsign,
              valueDecimals: 1
            }          
            }
          );
          series = chart.get('temperature');
          series.setData(datatabletrange);
        }
        if (datatablete_prev.length!=0)
        {
          chart.addSeries(
          {
            id: 'prev_temperature',
            name: 'Prev_' + ('Temperature'),
            color: 'rgba(224,224,230,0.8)',
            zIndex: 3,
            yAxis: 0,
            tooltip: {
              valueSuffix: ' \u00B0' + $.myglobals.tempsign,
              valueDecimals: 1
            }
          });
          series = chart.get('prev_temperature');
          series.setData(datatablete_prev);
          series.setVisible(false);
        }    
      }
      }
   return;   
      if (datatabledp.length!=0)
      {
        chart.addSeries(
      {
        id: 'dewpoint',
        name: ('Dew Point'),
        color: 'blue',
        yAxis: 0,
        tooltip: {
          valueSuffix: ' \u00B0' + $.myglobals.tempsign,
          valueDecimals: 1
        }
          }
        );
        series = chart.get('dewpoint');
        series.setData(datatabledp);
      }
      if (datatableba.length!=0)
      {
        chart.addSeries(
          {
        id: 'baro',
        name: ('Barometer'),
        color: 'pink',
        yAxis: 2,
        tooltip: {
          valueSuffix: ' hPa',
          valueDecimals: 1
        }
          }
        );
        series = chart.get('baro');
        series.setData(datatableba);
      }
  }  
    
  ShowTempLog = function(contentdiv,id,name)
  {
    //clearInterval($.myglobals.refreshTimer);
    //$('#modal').show();
    $.content=contentdiv;
    //$.backfunction=backfunction;
    $.devIdx=id;
    $.devName=name;
      $('#modaltitle').text(name)

    //$($.content).html(GetBackbuttonHTMLTable(backfunction)+htmlcontent);
    //$($.content).i18n();

    var tempstr="Celsius";
    if ($.myglobals.tempsign=="F") {
    tempstr="Fahrenheit";
    }

    $.DayChart = $($.content + ' #daygraph');
    $.DayChart.highcharts({
        chart: {
            type: 'line',
            width: 850,
            height: 300,
            zoomType: 'x',
            alignTicks: false,
            events: {
                load: function() {
                  this.showLoading();
                  $.getJSON("/json.htm?type=graph&sensor=temp&idx="+id+"&range=day",
                  function(data) {
                        AddDataToTempChart(data,$.DayChart.highcharts(),1);
                  });
                  this.hideLoading();
                }
            }
        },
        loading: {
            hideDuration: 1000,
            showDuration: 1000
        },
        credits: {
          enabled: true,
          href: "http://www.domoticz.com",
          text: "Domoticz.com"
        },
        title: {
            text: ('Temperature') + ' ' + Get5MinuteHistoryDaysGraphTitle()
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: [{ //temp label
            labels:  {
                     formatter: function() {
                          return this.value +'\u00B0 ' + $.myglobals.tempsign;
                     },
                     style: {
                        color: '#CCCC00'
                     }
            },
            title: {
                text: 'degrees ' + tempstr,
                 style: {
                    color: '#CCCC00'
                 }
            }
        }, { //humidity label
            labels:  {
                     formatter: function() {
                          return this.value +'%';
                     },
                     style: {
                        color: 'limegreen'
                     }
            },
            title: {
                text: ('Humidity') +' %',
                 style: {
                    color: '#00CC00'
                 }
            },
            opposite: true
        }],
        tooltip: {
        crosshairs: true,
        shared: true
        },
        legend: {
            enabled: true
        },
        plotOptions: {
      series: {
        point: {
          events: {
            click: function(event) {
              chartPointClickNew(event,true,ShowTempLog);
            }
          }
        }
      },
       line: {
        lineWidth: 3,
        states: {
          hover: {
            lineWidth: 3
          }
        },
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: true,
              symbol: 'circle',
              radius: 5,
              lineWidth: 1
            }
          }
        }
      }
        }
    });

    $.MonthChart = $($.content + ' #monthgraph');
    $.MonthChart.highcharts({
        chart: {
            type: 'spline',
            width: 850,
            height: 300,
            zoomType: 'x',
            alignTicks: false,
            events: {
                load: function() {
                  this.showLoading();
                  $.getJSON("/json.htm?type=graph&sensor=temp&idx="+id+"&range=month",
                  function(data) {
                        AddDataToTempChart(data,$.MonthChart.highcharts(),0);
                  });
                  this.hideLoading();
                }
            }
        },
        loading: {
            hideDuration: 1000,
            showDuration: 1000
        },
        credits: {
          enabled: true,
          href: "http://www.domoticz.com",
          text: "Domoticz.com"
        },
        title: {
            text: ('Temperature') + ' ' + ('Last Month')
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: [{ //temp label
            labels:  {
          format: '{value}\u00B0 ' + $.myglobals.tempsign,
          style: {
            color: '#CCCC00'
          }
            },
            title: {
                text: 'degrees ' + tempstr,
                 style: {
                    color: '#CCCC00'
                 }
            }
        }, { //humidity label
            labels:  {
             format: '{value}%',
                     style: {
                        color: 'limegreen'
                     }
            },
            title: {
                text: ('Humidity')+' %',
                 style: {
                    color: '#00CC00'
                 }
            },
            opposite: true
        }],
        tooltip: {
        crosshairs: true,
        shared: true
        },
        legend: {
            enabled: true
        },
        plotOptions: {
          series: {
            point: {
              events: {
                click: function(event) {
                  chartPointClickNew(event,false,ShowTempLog);
                }
              }
            }
          },
          spline: {
                      lineWidth: 3,
                      states: {
                          hover: {
                              lineWidth: 3
                          }
                      },
                      marker: {
                          enabled: false,
                          states: {
                              hover: {
                                  enabled: true,
                                  symbol: 'circle',
                                  radius: 5,
                                  lineWidth: 1
                              }
                          }
                      }
                  }
        }
    });

    $.YearChart = $($.content + ' #yeargraph');
    $.YearChart.highcharts({
        chart: {
            type: 'spline',
            width: 850,
            height: 300,
            zoomType: 'x',
            alignTicks: false,
            events: {
                load: function() {
                  this.showLoading();
                  $.getJSON("/json.htm?type=graph&sensor=temp&idx="+id+"&range=year",
                  function(data) {
                        AddDataToTempChart(data,$.YearChart.highcharts(),0);
                  });
                  this.hideLoading();
                }
            }
        },
        loading: {
            hideDuration: 1000,
            showDuration: 1000
        },
        credits: {
          enabled: true,
          href: "http://www.domoticz.com",
          text: "Domoticz.com"
        },
        title: {
            text: ('Temperature') + ' ' + ('Last Year')
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: [{ //temp label
            labels:  {
          format: '{value}\u00B0 ' + $.myglobals.tempsign,
          style: {
            color: '#CCCC00'
          }
            },
            title: {
                text: 'degrees ' + tempstr,
                 style: {
                    color: '#CCCC00'
                 }
            }
        }, { //humidity label
            labels:  {
             format: '{value}%',
                     style: {
                        color: 'limegreen'
                     }
            },
            title: {
                text: ('Humidity')+' %',
                 style: {
                    color: '#00CC00'
                 }
            },
            opposite: true
        }],
        tooltip: {
        crosshairs: true,
        shared: true
        },
        legend: {
            enabled: true
        },
        plotOptions: {
          series: {
            point: {
              events: {
                click: function(event) {
                  chartPointClickNew(event,false,ShowTempLog);
                }
              }
            }
          },
          spline: {
                      lineWidth: 3,
                      states: {
                          hover: {
                              lineWidth: 3
                          }
                      },
                      marker: {
                          enabled: false,
                          states: {
                              hover: {
                                  enabled: true,
                                  symbol: 'circle',
                                  radius: 5,
                                  lineWidth: 1
                              }
                          }
                      }
                  }
        }
    });

    //$('#modal').hide();
    //cursordefault();
    return true;
  }  
}(jQuery, window, document));

$(document).ready(function() {

  $.myglobals = {
    actlayout : "",
    prevlayout : "",
    ismobile: false,
    ismobileint: false,
    windscale: 1.0,
    windsign: "m/s",
    tempscale: 1.0,
    tempsign: "C",
    historytype : 1,
    LastPlanSelected: 0,
    Latitude: "",
    Longitude: "",
    DashboardType: 0,
    dontcache: true
  };
  
  if( /Android|webOS|iPhone|iPad|iPod|ZuneWP7|BlackBerry/i.test(navigator.userAgent) ) {
    $.myglobals.ismobile=true;
    $.myglobals.ismobileint=true;
  }
  updateDevices()
  updateDashboard()
  updateScenes()
  updateDomoticzTabs()
  refreshTabs()
  CheckForUpdate(false)
});
