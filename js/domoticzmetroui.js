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
    refreshTabs() 
    updateScenes()
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
        tileColor = "bg-green"
      }          
      else if ((currentPower > 50) && (currentPower <= 500)) {
        tileColor = "bg-lime"
      }          
      else if ((currentPower > 500) && (currentPower <= 1000)) {
        tileColor = "bg-orange"
      }          
      else if ((currentPower > 1000) && (currentPower <= 1500)) {
        tileColor = "bg-darkOrange"
      }          
      else if ((currentPower > 1500) && (currentPower <= 2000)) {
        tileColor = "bg-darkRed"
      }
      else if (currentPower > 2000) {
        tileColor = "bg-violet"
      }        
    }
    else if (deviceType == "Energy"){
      var energyToday = parseFloat(counterToday.split(' ')[0])
      if (energyToday <= 0.5) {
        tileColor = "bg-green"
      }          
      else if ((energyToday > 0.5) && (energyToday <= 1.0)) {
        tileColor = "bg-lime"
      }          
      else if ((energyToday > 1.0) && (energyToday <= 1.5)) {
        tileColor = "bg-orange"
      }          
      else if ((energyToday > 1.5) && (energyToday <= 2.0)) {
        tileColor = "bg-darkOrange"
      }          
      else if ((energyToday > 2.0) && (energyToday <= 2.5)) {
        tileColor = "bg-darkRed"
      }
      else if (energyToday > 2.5) {
        tileColor = "bg-violet"
      }         
    }
    else if ((deviceType == "Temp") || (deviceType == "Temp + Humidity") || (deviceType == "Temp + Humidity + Baro")) {
      var currentTemp = parseFloat(currentValue.split(' ')[0])
      if (currentTemp <= 5) {
        tileColor = "bg-lightTeal"
      }
      else if ((currentTemp > 5) && (currentTemp <= 10)) {
        tileColor = "bg-lightBlue"
      }          
      else if ((currentTemp > 10) && (currentTemp <= 15)) {
        tileColor = "bg-lightGreen"
      }          
      else if ((currentTemp > 15) && (currentTemp <= 20)) {
        tileColor = "bg-yellow"
      }          
      else if ((currentTemp > 20) && (currentTemp <= 25)) {
        tileColor = "bg-amber"
      }          
      else if ((currentTemp > 25) && (currentTemp <= 30)) {
        tileColor = "bg-orange"
      }          
      else if (currentTemp > 30) {
        tileColor = "bg-lightRed"
      }
      else {
        tileColor = "bg-lightBlue"
      }    
    }   
    else if (deviceType == "Lighting 2"){
      switch (switchType){
        case "On/Off":
          if (currentValue == "On")
            tileColor = "bg-lightRed"
          else
            tileColor = "bg-lightGreen"
        break;
        case "Contact":
          if (currentValue == "Open")
            tileColor = "bg-lightRed"
          else
            tileColor = "bg-lightGreen"
        break;
        case "Motion Sensor":
          if (currentValue == "On")
            tileColor = "bg-lightRed"
          else
            tileColor = "bg-lightGreen"
        break;
        case "Smoke Detector":
          if (currentValue == "On")
            tileColor = "bg-lightRed"
          else
            tileColor = "bg-lightGreen"
          break;
        case "Dimmer":
          if (currentValue == "Off")
            tileColor = "bg-lightGreen"
          else
            tileColor = "bg-lightRed"
        break;
        default:
            tileColor = "bg-lightBlue"
        break;    
      }
    }
    else {
      tileColor = "bg-lightBlue"
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
  

  // create some tabs & influence order then merge them
  createDomoticzTabs = function(){
    var myTabs ={}
    var domoTabs = $.getActiveTabs()
    // second call, buggy json :(
    domoTabs = $.getActiveTabs()
    myTabs.Setup = 1
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
              var tabclass = "icon-cog"
            break;
            case "Links":
              var tabclass = "icon-link"
            break;
            case "Dashboard":
              var tabclass = "icon-dashboard"
            break;
            case "Rooms":
              var tabclass = "icon-home"
            break;
            case "Magic":
              var tabclass = "icon-heart"
            break;
            case "Lights":
              var tabclass = "icon-switch"
            break;
            case "Scenes":
              var tabclass = "icon-list"
            break;
            case "Temp":
              var tabclass = "icon-thermometer"
            break;
            case "Utility":
              var tabclass = "icon-lightning"
            break;
            case "Weather":
              var tabclass = "icon-weather"
            break;
            case "Custom":
              var tabclass = "icon-star"
            break;
            default:
              var tabclass = "icon-none"
            break;
          }
          $("<li></li>")
            .attr("id",tabid)
            .appendTo("#tabs")
          $("<a></a>")
            .attr("id", tabid +"-icon")
            .attr("href", "#tab-"+tabtext)
            .attr("title", tabtext)
            .attr("data-toggle", "tab")
            .appendTo("#" +tabid)
            .addClass(tabclass)
          $("<span></span>")        
            .appendTo("#" +tabid +"-icon")
            .text(" " +tabtext)
          $("<div></div>")
            .attr("id", "tab-"+tabtext)
            .appendTo("#tab-control-frames")
            .addClass("frame")
        }
      }
    })
  }
  // update Setup
  updateDomoticzSetup = function(){
    getDomoticzVariables();
    
    var SetupTabs = {}
    SetupTabs.Main = 0
    SetupTabs.Variables = 1
    SetupTabs.Devices = 1
    SetupTabs.Links = 0
    SetupTabs.Magic = 0
  
    
    $("<div></div>")
      .attr("id","setup-tabs")
      .attr("data-role","tab-control")
      .addClass("tab-control")
      .appendTo("#tab-Setup")
    
    $("<ul></ul>")
      .attr("id","setup-tabs-tab")
      .addClass("tabs no-spaces")
      .appendTo("#setup-tabs")
  
    $("<div></div>")
      .attr("id","setup-tabs-frames")
      .addClass("frames")
      .appendTo("#setup-tabs")
  
    $.map(SetupTabs,function(value,index){
      if (value == "1"){
      
    $("<li></li>")
      .attr("id", index)
      .appendTo("#setup-tabs-tab")
      
    $("<a></a>")
      .appendTo("#" +index)
      .attr("href","#" +index +"-setup-tab")
      .attr("data-toggle", "tab")
      .text(index)
      
    $("<div></div>")
      .attr("id", index +"-setup-tab")
      .addClass("frame")
      .appendTo("#setup-tabs-frames")
      }
    })
      
/*  
    // uservars
    $("<button></button>")
      .attr("id","Variables-refresh-button")
      .appendTo("#Variables-setup-tab")
      .text("Refresh")
      .addClass("bg-darkRed fg-white")
      .click(function(){refreshVariablesTable()})
  
    $("<table></table>")
      .attr("id", "Variables-setup-table-1")
      .appendTo("#Variables-setup-tab")
      .addClass("table striped hovered dataTable")
    
    $("<thead><thead")
      .attr("id","Variables-setup-thead-1")
      .appendTo("#Variables-setup-table-1")
      .addClass("text-left")
    $("<tr><tr")
      .attr("id","Variables-setup-thead-1-row")
      .appendTo("#Variables-setup-thead-1")
    
    $("<th></th>")
      .appendTo("#Variables-setup-thead-1-row")
      .text("idx")
    $("<th></th>")
      .appendTo("#Variables-setup-thead-1-row")
      .text("Variable name")
    $("<th></th>")
      .appendTo("#Variables-setup-thead-1-row")
      .text("Variable type")
    $("<th></th>")
      .appendTo("#Variables-setup-thead-1-row")
      .text("Current value")
    $("<th></th>")
      .appendTo("#Variables-setup-thead-1-row")
      .text("Last update")
    
  
  
    refreshVariablesTable = function(){
      var userVariables = $.getUservariables()
      
      $("#Variables-setup-table-1 > tbody").remove()  
  
      $("<tbody></tbody")
        .attr("id","Variables-setup-tbody-1")
        .appendTo("#Variables-setup-table-1")
        $('#Variables-setup-table-1').dataTable({
          "bProcessing": true,
          "bDestroy": true,
          "bOrder": [[1, "desc"]],
          "aaData": userVariables.result,
          "aoColumns": [
             { "mData": "idx" },
             { "mData": "Name" },
             { "mData": "Type" },
             { "mData": "Value" },
             { "mData": "LastUpdate" }
           ]
        });
    }
*/  
    // device list
    $("<button></button>")
      .attr("id","Devices-refresh-button")
      .appendTo("#Devices-setup-tab")
      .text("Refresh")
      .addClass("bg-darkRed fg-white")
      .click(function(){refreshDevicesTable()})
  
    $("<table></table>")
      .attr("id", "Devices-setup-table-1")
      .appendTo("#Devices-setup-tab")
      .addClass("table striped hovered dataTable")
    
    $("<thead><thead")
      .attr("id","Devices-setup-thead-1")
      .appendTo("#Devices-setup-table-1")
      .addClass("text-left")
    $("<tr><tr")
      .attr("id","Devices-setup-thead-1-row")
      .appendTo("#Devices-setup-thead-1")
    
    $("<th></th>")
      .appendTo("#Devices-setup-thead-1-row")
      .text("VD Name")
    $("<th></th>")
      .appendTo("#Devices-setup-thead-1-row")
      .text("VD Type")
    $("<th></th>")
      .appendTo("#Devices-setup-thead-1-row")
      .text("idx")
    $("<th></th>")
      .appendTo("#Devices-setup-thead-1-row")
      .text("Hardware")
    $("<th></th>")
      .appendTo("#Devices-setup-thead-1-row")
      .text("ID")
    $("<th></th>")
      .appendTo("#Devices-setup-thead-1-row")
      .text("Name")
    $("<th></th>")
      .appendTo("#Devices-setup-thead-1-row")
      .text("Type")
    $("<th></th>")
      .appendTo("#Devices-setup-thead-1-row")
      .text("SubType")
    $("<th></th>")
      .appendTo("#Devices-setup-thead-1-row")
      .text("Data")
    //$("<th></th>")
    //  .appendTo("#Devices-setup-thead-1-row")
    //  .text("Signal")
    //$("<th></th>")
    //  .appendTo("#Devices-setup-thead-1-row")
    //  .text("Battery")
    $("<th></th>")
      .appendTo("#Devices-setup-thead-1-row")
      .text("Last Seen")
  
    refreshDevicesTable = function(){
      //var devices = $.getUseddevices()
      devices = combinedDeviceList
      
      $("#Devices-setup-table-1 > tbody").remove()  
  
      $("<tbody></tbody")
        .attr("id","Devices-setup-tbody-1")
        .appendTo("#Devices-setup-table-1")
        $('#Devices-setup-table-1').dataTable({
          "bProcessing": true,
          "bDestroy": true,
          "bSort": true,
          "bOrder": [[0, "asc"]],
          "aaData": devices,
          "aoColumns": [
            { "mData": "VirtualDeivceName" },
            { "mData": "VirtualDeivceType" },
            { "mData": "idx" },
            { "mData": "HardwareName" },
            { "mData": "ID" },
            { "mData": "Name" },
            { "mData": "Type" },
            { "mData": "SubType" },
            { "mData": "Data" },
            //{ "mData": "SignalLevel" },
            //{ "mData": "BatteryLevel" },
            { "mData": "LastUpdate" }
          ]
        });
    }
  
  
    // Magic
    var widgets = {}
    var widget = {}
    var row = []
    
    
    // create widget
  
    $("<div></div>")
      .attr("id", "Magic-setup-grid")
      .appendTo("#Magic-setup-tab")
      .addClass("grid fluid")
    $("<div></div>")
      .attr("id", "Magic-setup-grid-row")
      .appendTo("#Magic-setup-grid")
      .addClass("row")
    
    //Add spans to the rows  
    $("<div></div>")
      .attr("id", "Magic-setup-grid-row-span-1")
      .appendTo("#Magic-setup-grid-row")
      .addClass("span4")
  
    $("<div></div>")
      .attr("id", "Magic-setup-grid-row-span-panel-1")
      .appendTo("#Magic-setup-grid-row-span-1")
      .addClass("panel")
      
    $("<div></div>")
      .appendTo("#Magic-setup-grid-row-span-panel-1")
      .addClass("panel-header bg-lightBlue fg-white")
      .text("Create Widget")
    
    $("<div></div>")
      .attr("id","Magic-setup-name-row")
      .appendTo("#Magic-setup-grid-row-span-panel-1")
      .addClass("panel-content")
    
    $("<div></div>")
      .attr("id","Magic-setup-name-row-input-control")
      .appendTo("#Magic-setup-grid-row-span-panel-1")
      .addClass("input-control text")
    $("<input></input>")
      .attr("id","Magic-setup-widget-name")
      .appendTo("#Magic-setup-name-row-input-control")
      .attr("type","text")
      .attr("value","")
      .attr("placeholder", "Virtual Deivce Name")
              
    $( "#Magic-setup-widget-name").change(function() {
  
      $("#Magic-setup-widget-title-text")
        .text($("#Magic-setup-widget-name").val())
    });
  
    $("<div></div>")
      .attr("id","Magic-setup-row-row")
      .appendTo("#Magic-setup-grid-row-span-panel-1")
      .addClass("panel-content")
    
    $("<div></div>")
      .attr("id","Magic-setup-row-row-input-control")
      .appendTo("#Magic-setup-grid-row-span-panel-1")
      .addClass("input-control text")
    
    $("<input></input>")
      .attr("id","Magic-row-name")
      .appendTo("#Magic-setup-row-row-input-control")
      .attr("type","text")
      .attr("value","")
      .attr("placeholder", "Virtual Device Type")
      
    $("<div></div>")
      .attr("id","Magic-setup-select1-row")
      .appendTo("#Magic-setup-grid-row-span-panel-1")
      .addClass("panel-content")
    $("<div></div>")
      .attr("id","Magic-setup-select1-row-input-control")
      .appendTo("#Magic-setup-grid-row-span-panel-1")
      .addClass("input-control select")
  
    $("<select></select>")
      .attr("id","Magic-core-device-select")
      .appendTo("#Magic-setup-select1-row-input-control")
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
  
    $("<div></div>")
      .attr("id","Magic-setup-select2-row")
      .appendTo("#Magic-setup-grid-row-span-panel-1")
      .addClass("panel-content")
    $("<div></div>")
      .attr("id","Magic-setup-select2-row-input-control")
      .appendTo("#Magic-setup-grid-row-span-panel-1")
      .addClass("input-control select")
  
    $("<select></select>")
      .attr("id","Magic-data-device-select")
      .appendTo("#Magic-setup-select2-row-input-control")
  
    $("<div></div>")
      .attr("id","Magic-setup-button1-row")
      .appendTo("#Magic-setup-grid-row-span-panel-1")
      .addClass("panel-content")
      
    $("<button></button>")
      .attr("id","Magic-core-device-adddata")
      .appendTo("#Magic-setup-button1-row")
      .addClass("bg-darkBlue fg-white")
      .text("Add")
  
    $( "#Magic-core-device-adddata" ).click(function() {
      
      $("<div></div>")
        .addClass("panel-content")
        .text($("#Magic-row-name").val()+" "+$("#Magic-data-device-select").find(":selected").text())
        .appendTo("#Magic-setup-widget-body")
  
      row.push({
        name: $("#Magic-row-name").val(),
        idx : $("#Magic-core-device-select").val(),
        value : $("#Magic-data-device-select").val()
      })
    });        
  
    $("<div></div>")
      .attr("id", "Magic-setup-grid-row-span-2")
      //.appendTo("#Magic-setup-widget-grid-row")
      .appendTo("#Magic-setup-grid-row")
      .addClass("span4")
  
    $("<div></div>")
      .attr("id", "Magic-setup-grid-row-span-panel-2")
      .appendTo("#Magic-setup-grid-row-span-2")
      .addClass("panel")
    
    $("<div></div>")
      .attr("id","Magic-setup-widget-title-text")
      .addClass("panel-header bg-lightBlue fg-white")
      .appendTo("#Magic-setup-grid-row-span-panel-2")
      .text("Widget Name")
    
    $("<div></div>")
      .attr("id","Magic-setup-widget-body")
      .appendTo("#Magic-setup-grid-row-span-panel-2")
    
    $("<div></div>")
      .attr("id","Magic-setup-button3-row")
      .appendTo("#Magic-setup-grid-row-span-panel-2")
      .addClass("panel-content")
  
    $("<button></button>")
      .attr("id","Magic-save-widget")
      .appendTo("#Magic-setup-button3-row")
      .addClass("bg-darkBlue fg-white")
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
          
          //$.updateUservariable(value.idx, value.Name, value.Type, newWidgets)
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
      .attr("id", "Magic-setup-grid-row-span-3")
      //.appendTo("#Magic-setup-widget-grid-row")
      .appendTo("#Magic-setup-grid-row")
      .addClass("span4")
  
    $("<div></div>")
      .attr("id", "Magic-setup-grid-row-span-panel-3")
      .appendTo("#Magic-setup-grid-row-span-3")
      .addClass("panel")
  
    $("<div></div>")
      .attr("id", "Magic-setup-widget-list-3")
      .appendTo("#Magic-setup-grid-row-span-panel-3")
      .addClass("panel-header bg-lightBlue fg-white")
      .text("Widgets")
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
      
        if(!$("#" +"scenes-tile-area").length) {
          $("<div></div>")
            .attr("id", "scenes-tile-area")
            .appendTo("#tab-Scenes")
            .addClass("tile-area tile-area-dark")
          $("<h2></h2>")
            .appendTo("#scenes-tile-area")
            .addClass("tile-area-title fg-white")
            //.text("scenes")
        }
        if(!$("#" +"scenes-" +sceneType +"-tile-group").length) {
          $("<div></div>")
            .attr("id", "scenes-" +sceneType +"-tile-group")
            .appendTo("#scenes-tile-area")
            .addClass("tile-group")
          $("<div></div>")
            .attr("id", "scenes-tile-group-title")
            .appendTo("#" +"scenes-" +sceneType +"-tile-group")
            .addClass("tile-group-title")
            .text(sceneType)
        }
        // create a tile for each virtual device
        if(!$("#" +"scenes-" +value.idx +"-tile").length) {
          // Create the tile for the virtual deivce
          $("<a></a>")
            .attr("id", "scenes-" +value.idx +"-tile")
            .appendTo("#" +"scenes-" +sceneType +"-tile-group")
            .addClass("tile double bg-lightBlue live")
            .attr("data-role","live-tile")
            .attr("data-effect","slideUpDown")
            .data("deviceIdx", value.idx)
            .data("deviceStatus", text)
            //.attr("data-click","transform")
            //.attr("draggable","true")
            .attr("onclick", "switchScenes(this)")
        }
        if(!$("#" +"scenes-" +value.idx +"-tile-brand").length){
          $("<div></div>")
            .attr("id", "scenes-" +value.idx +"-tile-brand")
            .appendTo("#" +"scenes-" +value.idx +"-tile")
            .addClass("brand")
          $("<div></div>")
            .attr("id", "scenes-" +value.idx +"-tile-brand-label")
            .appendTo("#" +"scenes-" +value.idx +"-tile-brand")
            .addClass("label")
          $("<div></div>")
            .attr("id", "scenes-" +value.idx +"-tile-brand-label-heading")
            .appendTo("#" +"scenes-" +value.idx +"-tile-brand-label")
            .addClass("no-margin fg-white")
            .text(value.Name)
          $("<div></div>")
            .attr("id", "scenes-" +value.idx +"-tile-brand-badge")
            .appendTo("#" +"scenes-" +value.idx +"-tile-brand")
            .addClass("badge")
          $("<span></span>")
            .attr("id", "scenes-" +value.idx +"-tile-brand-badge-data")
            .appendTo("#" +"scenes-" +value.idx +"-tile-brand-badge")
            .text(value.idx)
        }

        // add a tile content block each real device in the virtual device tile
        if(!$("#" +"scenes-" +value.idx +"-tile-content").length){
          $("<div></div>")
          .attr("id", "scenes-" +value.idx +"-tile-content")
          .appendTo("#" +"scenes-" +value.idx +"-tile")
          .addClass("tile-content email")
          .attr("style", "display: block;")
        }
    
        // add the icon and value
        if(!$("#" +"scenes-" +value.idx +"-tile-content-email-image").length){
          $("<div></div>")
            .attr("id", "scenes-" +value.idx +"-tile-content-email-image")
            .appendTo("#" +"scenes-" +value.idx +"-tile-content")
            .addClass("email-image")
          $("<img></img>")
            .attr("id", "scenes-" +value.idx +"-tile-content-email-image-data")
            .appendTo("#" +"scenes-" +value.idx +"-tile-content-email-image")
            .attr("src", deviceImage)
        }      
        if(!$("#" +"scenes-" +value.idx +"-tile-content-email-data").length){
          // add data or status
          $("<div></div>")
            .attr("id", "scenes-" +value.idx +"-tile-content-email-data")
            .appendTo("#" +"scenes-" +value.idx +"-tile-content")
            .addClass("email-data")
          $("<span></span>")
            .attr("id", "scenes-" +value.idx +"-tile-content-email-data-title")
            .appendTo("#" +"scenes-" +value.idx +"-tile-content-email-data" )
            .addClass("email-data-title")
            .text(text)
          //$("<span></span>")
          //  .attr("id", "scenes-" +value.idx +"-tile-content-email-data-subtitle")
          //  .appendTo("#" +"scenes-" +value.idx +"-tile-content-email-data" )
          //  .addClass("email-data-subtitle fg-darkCobalt")
          //  .text(value.Name)
          $("<span></span>")
            .attr("id", "scenes-" +value.idx +"-tile-content-email-data-text")
            .appendTo("#" +"scenes-" +value.idx +"-tile-content-email-data" )
            .addClass("email-data-text fg-gray")
            .text(value.LastUpdate)
        }    
      // update text if not the same
      if ($("#" +"scenes-" +value.idx +"-tile-content-email-data-title").text() != text){
        $("#" +"scenes-" +value.idx +"-tile-content-email-data-title")
          .hide()
          .text(text)
          .fadeIn(1500)
      }
      if ($("#" +"scenes-" +value.idx +"-tile-content-email-image-data").attr('src') != deviceImage){
        $("#" +"scenes-" +value.idx +"-tile-content-email-image-data")
          .hide()
          .attr("src", deviceImage)
          .fadeIn(1500)
      }
      if ($("#" +"scenes-" +value.idx +"-tile-content-email-data-text").text() != value.LastUpdate){        
        $("#" +"scenes-" +value.idx +"-tile-content-email-data-text")
          .hide()
          .text(value.LastUpdate)
          .fadeIn(1500)        
      }
      // Update the tile color
      //$("#" +"scenes-" +value.idx +"-tile")
      //  .removeClass($("#" +"scenes-" +value.idx +"-tile").attr('class'))
      //  .addClass("tile double live " +tileColor)
        
      
            
      }
    })
  }
  
  
  //Create Lights Tab
  updateLights = function(){

    //var device = $.getUseddevices()
    device = combinedDeviceList
    device.forEach(function(value, key){
      if(value.Type == "Lighting 2"){
        var switchType = value.SwitchType.replace(/[_\s]/g, '').replace(/[^a-z0-9-\s]/gi, '');
        var text = value.Status
        var idx = value.idx
        var deviceImage = getDeviceImage(value.Type, value.SubType, value.SwitchType, text)
      
        if(!$("#" +"lights-tile-area").length) {
          $("<div></div>")
            .attr("id", "lights-tile-area")
            .appendTo("#tab-Lights")
            .addClass("tile-area tile-area-dark")
          $("<h2></h2>")
            .appendTo("#lights-tile-area")
            .addClass("tile-area-title fg-white")
            //.text("Lights")
        }
        if(!$("#" +"lights-" +switchType +"-tile-group").length) {
          $("<div></div>")
            .attr("id", "lights-" +switchType +"-tile-group")
            .appendTo("#lights-tile-area")
            .addClass("tile-group")
          $("<div></div>")
            .attr("id", "lights-tile-group-title")
            .appendTo("#" +"lights-" +switchType +"-tile-group")
            .addClass("tile-group-title")
            .text(switchType)
        }
        // create a tile for each virtual device
        if(!$("#" +"lights-" +value.idx +"-tile").length) {
          // Create the tile for the virtual deivce
          $("<a></a>")
            .attr("id", "lights-" +value.idx +"-tile")
            .appendTo("#" +"lights-" +switchType +"-tile-group")
            .addClass("tile double bg-lightBlue live")
            .attr("data-role","live-tile")
            .attr("data-effect","slideUpDown")
            .data("deviceIdx", value.idx)
            .data("deviceStatus", text)
            .data("deviceSetLevel", value.LevelInt)
            //.attr("data-click","transform")
            //.attr("draggable","true")
            .attr("onclick", "switchLights(this)")
        }
        if(!$("#" +"lights-" +value.idx +"-tile-brand").length){
          $("<div></div>")
            .attr("id", "lights-" +value.idx +"-tile-brand")
            .appendTo("#" +"lights-" +value.idx +"-tile")
            .addClass("brand")
          $("<div></div>")
            .attr("id", "lights-" +value.idx +"-tile-brand-label")
            .appendTo("#" +"lights-" +value.idx +"-tile-brand")
            .addClass("label")
          $("<div></div>")
            .attr("id", "lights-" +value.idx +"-tile-brand-label-heading")
            .appendTo("#" +"lights-" +value.idx +"-tile-brand-label")
            .addClass("no-margin fg-white")
            .text(value.Name)
          $("<div></div>")
            .attr("id", "lights-" +value.idx +"-tile-brand-badge")
            .appendTo("#" +"lights-" +value.idx +"-tile-brand")
            .addClass("badge")
          $("<span></span>")
            .attr("id", "lights-" +value.idx +"-tile-brand-badge-data")
            .appendTo("#" +"lights-" +value.idx +"-tile-brand-badge")
            .text(value.idx)
        }

        // add a tile content block each real device in the virtual device tile
        if(!$("#" +"lights-" +value.idx +"-tile-content").length){
          $("<div></div>")
          .attr("id", "lights-" +value.idx +"-tile-content")
          .appendTo("#" +"lights-" +value.idx +"-tile")
          .addClass("tile-content email")
          .attr("style", "display: block;")
        }
    
        // add the icon and value
        if(!$("#" +"lights-" +value.idx +"-tile-content-email-image").length){
          $("<div></div>")
            .attr("id", "lights-" +value.idx +"-tile-content-email-image")
            .appendTo("#" +"lights-" +value.idx +"-tile-content")
            .addClass("email-image")
          $("<img></img>")
            .attr("id", "lights-" +value.idx +"-tile-content-email-image-data")
            .appendTo("#" +"lights-" +value.idx +"-tile-content-email-image")
            .attr("src", deviceImage)
        }      
        if(!$("#" +"lights-" +value.idx +"-tile-content-email-data").length){
          // add data or status
          $("<div></div>")
            .attr("id", "lights-" +value.idx +"-tile-content-email-data")
            .appendTo("#" +"lights-" +value.idx +"-tile-content")
            .addClass("email-data")
          $("<span></span>")
            .attr("id", "lights-" +value.idx +"-tile-content-email-data-title")
            .appendTo("#" +"lights-" +value.idx +"-tile-content-email-data" )
            .addClass("email-data-title")
            .text(text)
          //$("<span></span>")
          //  .attr("id", "lights-" +value.idx +"-tile-content-email-data-subtitle")
          //  .appendTo("#" +"lights-" +value.idx +"-tile-content-email-data" )
          //  .addClass("email-data-subtitle fg-darkCobalt")
          //  .text(value.Name)
          $("<span></span>")
            .attr("id", "lights-" +value.idx +"-tile-content-email-data-text")
            .appendTo("#" +"lights-" +value.idx +"-tile-content-email-data" )
            .addClass("email-data-text fg-gray")
            .text(value.LastUpdate)
        }        
      }
    })
  }
  
  //Create Utility Tab
  updateUtility = function(){
    //timerUpdateUtility = setTimeout(updateUtility, 5000)

    //var device = $.getUseddevices()
    device = combinedDeviceList
    
    device.forEach(function(value, key){
      if((value.Type == "Usage") || (value.Type == "Energy") || 
         (value.SubType == "Gas")||(value.SubType == "RFXMeter counter") || 
         (value.Type == "Current")||(value.Type == "Current/Energy") || 
         (value.Type == "Fan") || (value.SubType == "Percentage") ||
         (value.Type == "Air Quality") || (value.SubType == "Soil Moisture") ||
         (value.SubType == "Leaf Wetness") || (value.Type == "Lux") ||
         (value.SubType == "Voltage")||(value.SubType == "A/D")||(value.SubType == "Pressure") ||
         (value.Type == "Weight") || ((value.Type == "Thermostat")&&(value.SubType=="SetPoint"))) {
        var deviceType = value.Type.replace(/[_\s]/g, '').replace(/[^a-z0-9-\s]/gi, '');
        var text = value.Data
        var deviceImage = getDeviceImage(value.Type, value.SubType, value.SwitchType, text)
        var counterToday = value.CounterToday
        if (typeof(counterToday)  === "undefined"){
          counterToday = "0.0 kWh"
        }
        if(!$("#" +"utility-tile-area").length) {
          $("<div></div>")
            .attr("id", "utility-tile-area")
            .appendTo("#tab-Utility")
            .addClass("tile-area tile-area-dark")
          $("<h2></h2>")
            .appendTo("#utility-tile-area")
            .addClass("tile-area-title fg-white")
            //.text("utility")
        }
        if(!$("#" +"utility-" +deviceType +"-tile-group").length) {
          $("<div></div>")
            .attr("id", "utility-" +deviceType +"-tile-group")
            .appendTo("#utility-tile-area")
            .addClass("tile-group")
          $("<div></div>")
            .attr("id", "utility-tile-group-title")
            .appendTo("#" +"utility-" +deviceType +"-tile-group")
            .addClass("tile-group-title")
            .text(deviceType)
        }
        // create a tile for each virtual device
        if(!$("#" +"utility-" +value.idx +"-tile").length) {
          // Create the tile for the virtual deivce
          $("<a></a>")
            .attr("id", "utility-" +value.idx +"-tile")
            .appendTo("#" +"utility-" +deviceType +"-tile-group")
            .addClass("tile double bg-lightBlue live")
            .attr("data-role","live-tile")
            .attr("data-effect","slideUpDown")
            .attr("data-click","transform")
        }
        if(!$("#" +"utility-" +value.idx +"-tile-brand").length){
          $("<div></div>")
            .attr("id", "utility-" +value.idx +"-tile-brand")
            .appendTo("#" +"utility-" +value.idx +"-tile")
            .addClass("brand")
          $("<div></div>")
            .attr("id", "utility-" +value.idx +"-tile-brand-label")
            .appendTo("#" +"utility-" +value.idx +"-tile-brand")
            .addClass("label")
          $("<div></div>")
            .attr("id", "utility-" +value.idx +"-tile-brand-label-heading")
            .appendTo("#" +"utility-" +value.idx +"-tile-brand-label")
            .addClass("no-margin fg-white")
            .text(value.Name)
          $("<div></div>")
            .attr("id", "utility-" +value.idx +"-tile-brand-badge")
            .appendTo("#" +"utility-" +value.idx +"-tile-brand")
            .addClass("badge")
          $("<span></span>")
            .attr("id", "utility-" +value.idx +"-tile-brand-badge-data")
            .appendTo("#" +"utility-" +value.idx +"-tile-brand-badge")
            .text(value.idx)
        }

        // add a tile content block each real device in the virtual device tile
        if(!$("#" +"utility-" +value.idx +"-tile-content").length){
          $("<div></div>")
          .attr("id", "utility-" +value.idx +"-tile-content")
          .appendTo("#" +"utility-" +value.idx +"-tile")
          .addClass("tile-content email")
          .attr("style", "display: block;")
        }
    
        // add the icon and value
        if(!$("#" +"utility-" +value.idx +"-tile-content-email-image").length){
          $("<div></div>")
            .attr("id", "utility-" +value.idx +"-tile-content-email-image")
            .appendTo("#" +"utility-" +value.idx +"-tile-content")
            .addClass("email-image")
          $("<img></img>")
            .attr("id", "utility-" +value.idx +"-tile-content-email-image-data")
            .appendTo("#" +"utility-" +value.idx +"-tile-content-email-image")
            .attr("src", deviceImage)
        }      
        if(!$("#" +"utility-" +value.idx +"-tile-content-email-data").length){
          // add data or status
          $("<div></div>")
            .attr("id", "utility-" +value.idx +"-tile-content-email-data")
            .appendTo("#" +"utility-" +value.idx +"-tile-content")
            .addClass("email-data")
          $("<span></span>")
            .attr("id", "utility-" +value.idx +"-tile-content-email-data-title")
            .appendTo("#" +"utility-" +value.idx +"-tile-content-email-data" )
            .addClass("email-data-title")
            .text(text)
          if(value.Type == "Energy"){
            $("<span></span>")
              .attr("id", "utility-" +value.idx +"-tile-content-email-data-subtitle")
              .appendTo("#" +"utility-" +value.idx +"-tile-content-email-data" )
              .addClass("email-data-subtitle fg-darkCobalt")
              .text("Today: " +counterToday)
            }
          $("<span></span>")
            .attr("id", "utility-" +value.idx +"-tile-content-email-data-text")
            .appendTo("#" +"utility-" +value.idx +"-tile-content-email-data" )
            .addClass("email-data-text fg-gray")
            .text(value.LastUpdate)
        }
                
      }
    })
  }
  //Create Temp Tab
  updateTemp = function(){
    //timerUpdateTemp = setTimeout(updateTemp, 5000)

    //var device = $.getUseddevices()
    device = combinedDeviceList
    
    device.forEach(function(value, key){
      if((value.Type == "Temp") || (value.Type == "Temp + Humidity") || (value.Type == "Temp + Humidity + Baro")){
        var deviceType = value.Type.replace(/[_\s]/g, '').replace(/[^a-z0-9-\s]/gi, '');
        var text = value.Data
        var deviceImage = getDeviceImage(value.Type, value.SubType, value.SwitchType, text)
   
        if(!$("#" +"temp-tile-area").length) {
          $("<div></div>")
            .attr("id", "temp-tile-area")
            .appendTo("#tab-Temp")
            .addClass("tile-area tile-area-dark")
          $("<h2></h2>")
            .appendTo("#temp-tile-area")
            .addClass("tile-area-title fg-white")
            //.text("temp")
        }
        if(!$("#" +"temp-" +deviceType +"-tile-group").length) {
          $("<div></div>")
            .attr("id", "temp-" +deviceType +"-tile-group")
            .appendTo("#temp-tile-area")
            .addClass("tile-group")
          $("<div></div>")
            .attr("id", "temp-tile-group-title")
            .appendTo("#" +"temp-" +deviceType +"-tile-group")
            .addClass("tile-group-title")
            .text(deviceType)
        }
        // create a tile for each virtual device
        if(!$("#" +"temp-" +value.idx +"-tile").length) {
          // Create the tile for the virtual deivce
          $("<a></a>")
            .attr("id", "temp-" +value.idx +"-tile")
            .appendTo("#" +"temp-" +deviceType +"-tile-group")
            .addClass("tile double bg-lightBlue live")
            .attr("data-role","live-tile")
            .attr("data-effect","slideUpDown")
            .attr("data-click","transform")
        }
        if(!$("#" +"temp-" +value.idx +"-tile-brand").length){
          $("<div></div>")
            .attr("id", "temp-" +value.idx +"-tile-brand")
            .appendTo("#" +"temp-" +value.idx +"-tile")
            .addClass("brand")
          $("<div></div>")
            .attr("id", "temp-" +value.idx +"-tile-brand-label")
            .appendTo("#" +"temp-" +value.idx +"-tile-brand")
            .addClass("label")
          $("<div></div>")
            .attr("id", "temp-" +value.idx +"-tile-brand-label-heading")
            .appendTo("#" +"temp-" +value.idx +"-tile-brand-label")
            .addClass("no-margin fg-white")
            .text(value.Name)
          $("<div></div>")
            .attr("id", "temp-" +value.idx +"-tile-brand-badge")
            .appendTo("#" +"temp-" +value.idx +"-tile-brand")
            .addClass("badge")
          $("<span></span>")
            .attr("id", "temp-" +value.idx +"-tile-brand-badge-data")
            .appendTo("#" +"temp-" +value.idx +"-tile-brand-badge")
            .text(value.idx)
        }

        // add a tile content block each real device in the virtual device tile
        if(!$("#" +"temp-" +value.idx +"-tile-content").length){
          $("<div></div>")
          .attr("id", "temp-" +value.idx +"-tile-content")
          .appendTo("#" +"temp-" +value.idx +"-tile")
          .addClass("tile-content email")
          .attr("style", "display: block;")
        }
    
        // add the icon and value
        if(!$("#" +"temp-" +value.idx +"-tile-content-email-image").length){
          $("<div></div>")
            .attr("id", "temp-" +value.idx +"-tile-content-email-image")
            .appendTo("#" +"temp-" +value.idx +"-tile-content")
            .addClass("email-image")
          $("<img></img>")
            .attr("id", "temp-" +value.idx +"-tile-content-email-image-data")
            .appendTo("#" +"temp-" +value.idx +"-tile-content-email-image")
            .attr("src", deviceImage)
        }      
        if(!$("#" +"temp-" +value.idx +"-tile-content-email-data").length){
          // add data or status
          $("<div></div>")
            .attr("id", "temp-" +value.idx +"-tile-content-email-data")
            .appendTo("#" +"temp-" +value.idx +"-tile-content")
            .addClass("email-data")
          $("<span></span>")
            .attr("id", "temp-" +value.idx +"-tile-content-email-data-title")
            .appendTo("#" +"temp-" +value.idx +"-tile-content-email-data" )
            .addClass("email-data-title")
            .text(text)
          //$("<span></span>")
          //  .attr("id", "temp-" +value.idx +"-tile-content-email-data-subtitle")
          //  .appendTo("#" +"temp-" +value.idx +"-tile-content-email-data" )
          //  .addClass("email-data-subtitle fg-darkCobalt")
          //  .text(value.Name)
          $("<span></span>")
            .attr("id", "temp-" +value.idx +"-tile-content-email-data-text")
            .appendTo("#" +"temp-" +value.idx +"-tile-content-email-data" )
            .addClass("email-data-text fg-gray")
            .text(value.LastUpdate)
        }


      }
    })
  }
  
  //Create Weather Tab
  updateWeather = function(){
    //timerUpdateWeather = setTimeout(updateWeather, 5000)

    //var device = $.getUseddevices()
    device = combinedDeviceList
    
    device.forEach(function(value, key){
      if((value.HardwareName == "Forecast IO") || (value.HardwareName == "Weather Underground")){
        var deviceType = value.HardwareName.replace(/[_\s]/g, '').replace(/[^a-z0-9-\s]/gi, '');
        var text = value.Data
        var deviceImage = getDeviceImage(value.Type, value.SubType, value.SwitchType, text)
  
        if(!$("#" +"weather-tile-area").length) {
          $("<div></div>")
            .attr("id", "weather-tile-area")
            .appendTo("#tab-Weather")
            .addClass("tile-area tile-area-dark")
          $("<h2></h2>")
            .appendTo("#weather-tile-area")
            .addClass("tile-area-title fg-white")
            //.text("weather")
        }
        if(!$("#" +"weather-" +deviceType +"-tile-group").length) {
          $("<div></div>")
            .attr("id", "weather-" +deviceType +"-tile-group")
            .appendTo("#weather-tile-area")
            .addClass("tile-group")
          $("<div></div>")
            .attr("id", "weather-tile-group-title")
            .appendTo("#" +"weather-" +deviceType +"-tile-group")
            .addClass("tile-group-title")
            .text(deviceType)
        }
        // create a tile for each virtual device
        if(!$("#" +"weather-" +value.idx +"-tile").length) {
          // Create the tile for the virtual deivce
          $("<a></a>")
            .attr("id", "weather-" +value.idx +"-tile")
            .appendTo("#" +"weather-" +deviceType +"-tile-group")
            .addClass("tile double bg-lightBlue live")
            .attr("data-role","live-tile")
            .attr("data-effect","slideUpDown")
            .attr("data-click","transform")
        }
        if(!$("#" +"weather-" +value.idx +"-tile-brand").length){
          $("<div></div>")
            .attr("id", "weather-" +value.idx +"-tile-brand")
            .appendTo("#" +"weather-" +value.idx +"-tile")
            .addClass("brand")
          $("<div></div>")
            .attr("id", "weather-" +value.idx +"-tile-brand-label")
            .appendTo("#" +"weather-" +value.idx +"-tile-brand")
            .addClass("label")
          $("<div></div>")
            .attr("id", "weather-" +value.idx +"-tile-brand-label-heading")
            .appendTo("#" +"weather-" +value.idx +"-tile-brand-label")
            .addClass("no-margin fg-white")
            .text(value.Name)
          $("<div></div>")
            .attr("id", "weather-" +value.idx +"-tile-brand-badge")
            .appendTo("#" +"weather-" +value.idx +"-tile-brand")
            .addClass("badge")
          $("<span></span>")
            .attr("id", "weather-" +value.idx +"-tile-brand-badge-data")
            .appendTo("#" +"weather-" +value.idx +"-tile-brand-badge")
            .text(value.idx)
        }

        // add a tile content block each real device in the virtual device tile
        if(!$("#" +"weather-" +value.idx +"-tile-content").length){
          $("<div></div>")
          .attr("id", "weather-" +value.idx +"-tile-content")
          .appendTo("#" +"weather-" +value.idx +"-tile")
          .addClass("tile-content email")
          .attr("style", "display: block;")
        }
    
        // add the icon and value
        if(!$("#" +"weather-" +value.idx +"-tile-content-email-image").length){
          $("<div></div>")
            .attr("id", "weather-" +value.idx +"-tile-content-email-image")
            .appendTo("#" +"weather-" +value.idx +"-tile-content")
            .addClass("email-image")
          $("<img></img>")
            .attr("id", "weather-" +value.idx +"-tile-content-email-image-data")
            .appendTo("#" +"weather-" +value.idx +"-tile-content-email-image")
            .attr("src", deviceImage)
        }      
        if(!$("#" +"weather-" +value.idx +"-tile-content-email-data").length){
          // add data or status
          $("<div></div>")
            .attr("id", "weather-" +value.idx +"-tile-content-email-data")
            .appendTo("#" +"weather-" +value.idx +"-tile-content")
            .addClass("email-data")
          $("<span></span>")
            .attr("id", "weather-" +value.idx +"-tile-content-email-data-title")
            .appendTo("#" +"weather-" +value.idx +"-tile-content-email-data" )
            .addClass("email-data-title")
            .text(text)
          //$("<span></span>")
          //  .attr("id", "weather-" +value.idx +"-tile-content-email-data-subtitle")
          //  .appendTo("#" +"weather-" +value.idx +"-tile-content-email-data" )
          //  .addClass("email-data-subtitle fg-darkCobalt")
          //  .text(value.Name)
          $("<span></span>")
            .attr("id", "weather-" +value.idx +"-tile-content-email-data-text")
            .appendTo("#" +"weather-" +value.idx +"-tile-content-email-data" )
            .addClass("email-data-text fg-gray")
            .text(value.LastUpdate)
        }

      }
    })
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
      
        if(!$("#" +tabName +"-tile-area").length) {
          $("<div></div>")
            .attr("id", tabName +"-tile-area")
            .appendTo("#tab-" +tabName)
            .addClass("tile-area tile-area-dark")
          $("<h1></h1>")
            .appendTo("#" +tabName +"-tile-area")
            .addClass("tile-area-title fg-white")
            //.text(tabName)
        }
        if(!$("#" +tabName +"-" +tileGroupName +"-tile-group").length) {
          $("<div></div>")
            .attr("id", tabName +"-" +tileGroupName +"-tile-group")
            .appendTo("#" +tabName +"-tile-area")
            .addClass("tile-group")
          $("<div></div>")
            .attr("id", tabName +"-tile-group-title")
            .appendTo("#" +tabName +"-" +tileGroupName +"-tile-group")
            .addClass("tile-group-title")
            .text(tileGroupName)
        }
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
          //.text("Dashboard")
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
  
  /* Get the rows which are currently selected */
  fnGetSelected =function( oTableLocal )
  {
    return oTableLocal.$('tr.selected');
  }
  
  ShowNotify = function(txt, timeout, iserror)
  {
	  $("#notification").html('<strong>' + txt + '</strong>');
	
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
	  bootbox.confirm("Are you sure you want to remove this variable?", function(result) {
	  if (result==true) {
		  $.ajax({
			  url: "/json.htm?type=command&param=deleteuservariable&idx=" + idx,
			  async: false, 
			  dataType: 'json',
			  success: function(data) {
				  RefreshUserVariablesTable();
          var oTable = $('#Variables-setup-tab #activetable').dataTable();
          oTable.fnClearTable();
          $.virtualDeviceString = []
			    $('#uservariablesedittable #uservariablename').val("");
			    $('#uservariablesedittable #uservariablevalue').val("");
			    $('#uservariablesedittable #uservariabletype').val("0");
			    $('#uservariablesedittable #uservariablevdtype').val("");
			    $.userVariableIdx = 0;				  
			  }
		  });
	  }
	  });
  }
	

  AddUpdateVariable = function(type)
  {
	  var idx = $.userVariableIdx;
	  if ($('#uservariablesedittable #uservariablename').val() == ""){
      bootbox.alert('Virtual device name can not be empty!')
      return;
	  }
	  if ($('#uservariablesedittable #uservariablevdtype').val() == ""){
      bootbox.alert("Virtual device type can not be empty")
      return;
    }	
	  if ($('#uservariablesedittable #uservariablevalue').val() == ""){
      bootbox.alert("No devices have been included in the virtual device")
      return;
    }
          
    var uservariablename = "vd_" +($('#uservariablesedittable #uservariablename').val());
	  var uservariabletype = 2 //$('#uservariablesedittable #uservariabletype option:selected').val();
	  var uservariablevalue = $('#uservariablesedittable #uservariablevdtype').val() +"," +($('#uservariablesedittable #uservariablevalue').val());
	  if((type=="a") && (jQuery.inArray(uservariablename,$.varNames) != -1)){
		  alert('Virtual Device name already exists!', 2500, true);
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
						  bootbox.alert('Virtual device saved');
						  RefreshUserVariablesTable();
						  $('#uservariablesedittable #uservariablename').val("");
						  $('#uservariablesedittable #uservariablevalue').val("");
						  $('#uservariablesedittable #uservariabletype').val("0");
						  $('#uservariablesedittable #uservariablevdtype').val("");
              var oTable = $('#settings #activetable').dataTable();
              oTable.fnClearTable();
						  
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
	  $("#Variables-setup-tab #comboactivedevice").empty();
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
					  $("#Variables-setup-tab #comboactivedevice").append(option);
				  });
			  }
		  }
	  });
  }	
	
  RefreshActiveDevicesTable = function(idx)
  {
    $('#modal').show();

    $('#Variables-setup-tab #activedevicedelete').toggleClass("disabled")

    var oTable = $('#Variables-setup-tab #activetable').dataTable();
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
	  $("#Variables-setup-tab #activetable tbody").off();
	  $("#Variables-setup-tab #activetable tbody").on( 'click', 'tr', function () {
		  if ( $(this).hasClass('selected') ) {
			  $(this).removeClass('selected');
			  $('#activetable-actions #activedevicedelete').addClass("disabled");
		  }
		  else {
			  var oTable = $('#Variables-setup-tab #activetable').dataTable();
			  oTable.$('tr.selected').removeClass('selected');
			  $(this).addClass('selected');
			  $('#activetable-actions #activedevicedelete').removeClass("disabled");
			
			  var anSelected = fnGetSelected( oTable );
			  if ( anSelected.length !== 0 ) {
				  var data = oTable.fnGetData( anSelected[0] );
				  var idx= data["DT_RowId"];
				  //alert(idx)
				  $("#activetable-actions #activedevicedelete").attr("onClick", "DeleteActiveDevice(" + idx + ")");
			  }
		  }
	  }); 

    $('#modal').hide();
  }
  
  AddActiveDevice = function()
  {
    var ActiveDeviceIdx=$("#Variables-setup-tab #comboactivedevice option:selected").val();
    $.virtualDeviceString.push(parseInt(ActiveDeviceIdx))
	  RefreshActiveDevicesTable();
 	  RefreshUserVariables();
  }

  DeleteActiveDevice = function(idx)
  {
	  bootbox.confirm("Are you sure to delete this Active Device?", function(result) {
	    if (result==true) {
        var index = $.virtualDeviceString.indexOf(idx.toString())
        $.virtualDeviceString.splice(index,1)
	      RefreshActiveDevicesTable();
	      RefreshUserVariables();
	    }
	  })
  }	
	
  RefreshUserVariablesTable = function()
  {
    $('#modal').show();
    $('#uservariablesedittable-actions #uservariableupdate').addClass("disabled");
    $('#uservariablesedittable-actions #uservariabledelete').addClass("disabled");

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
            if(item.Name.match(/vd_/)){
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
				        "1": item.Value,
				        //"1": typeWording,
				        //"2": item.Value,
				        //"3": item.LastUpdate
			        });
		        }
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
  
    //var oTable = $('#settings #Variables-table').dataTable();
    
	  /* Add a click handler to the rows - this could be used as a callback */
	  $("#Variables-setup-tab #Variables-table tbody").off();
	  $("#Variables-setup-tab #Variables-table tbody").on( 'click', 'tr', function () {
		  if ( $(this).hasClass('selected') ) {
			  $(this).removeClass('selected');
        $('#uservariablesedittable-actions #uservariableupdate').addClass("disabled")
        $('#uservariablesedittable-actions #uservariabledelete').addClass("disabled")
        var oTable = $('#settings #activetable').dataTable();
        oTable.fnClearTable();
        $.virtualDeviceString = []
			  $('#uservariablesedittable #uservariablename').val("");
			  $('#uservariablesedittable #uservariablevalue').val("");
			  $('#uservariablesedittable #uservariabletype').val("0");
			  $('#uservariablesedittable #uservariablevdtype').val("");
			  $.userVariableIdx = 0;
    
		  }
		  else {
			  var oTable = $('#Variables-setup-tab #Variables-table').dataTable();
			  oTable.$('tr.selected').removeClass('selected');
			  $(this).addClass('selected');
        $('#uservariablesedittable-actions #uservariableupdate').removeClass("disabled")
        $('#uservariablesedittable-actions #uservariabledelete').removeClass("disabled")
			
			  var anSelected = fnGetSelected( oTable );
			  if ( anSelected.length !== 0 ) {
            var data = oTable.fnGetData( anSelected[0] );
            var idx= data["DT_RowId"];
            $.devIdx=idx;
            $.userVariableIdx=idx;	
            $("#uservariablesedittable-actions #uservariableupdate").attr("onClick", "AddUpdateVariable('u')");
            $("#uservariablesedittable-actions #uservariabledelete").attr("onClick", "DeleteVariable(" + idx + ")");
            $("#uservariablesedittable #uservariablename").val(data["0"].split('_')[1]);
            //$("#uservariablesedittable #uservariabletype").val(data["DT_ItemType"]);
            //$("#uservariablesedittable #uservariablevalue").val(data["2"]);
            $("#uservariablesedittable #uservariablevdtype").val(data["1"].split(",")[0]);
            $.virtualDeviceString = data["1"].split(",");
            $.virtualDeviceString.splice(0,1);
            var deviceIdx = ""
            for(i = 0; i < $.virtualDeviceString.length; i++){
              deviceIdx = deviceIdx + $.virtualDeviceString[i] +"," 
            }
            deviceIdx = deviceIdx.substr(0, deviceIdx.length -1)
            $("#uservariablesedittable #uservariablevalue").val(deviceIdx)
            RefreshActiveDevicesTable();
          }
		  }
	  }); 
    RefreshUserVariablesTable()    
  }
  


  ShowSettingsPage = function()
  {
    $("<div></div>")
      .attr("id", "row1")
      .appendTo("#Variables-setup-tab")
      .addClass("row")
    $("<div></div>")
      .attr("id", "col1")
      .appendTo("#row1")
      .addClass("col-md-6")
    $("<h2></h2>")
      .attr("id", "Edit-variables")
      .appendTo("#col1")
      .text("Virtual Devices:")
    $("<table></table>")
      .attr("id", "Variables-table")
      .appendTo("#col1")
      .addClass("table table-bordered table-hover table-condensed dataTable")
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
    //$("<th></th")
    //  .appendTo("#Variables-table-thead-row")
    //  .text("Variable type")
    //  .attr("width", "150")
    //  .attr("align", "left")
    $("<th></th")
      .appendTo("#Variables-table-thead-row")
      .text("Current value")
      .attr("width", "240")
      .attr("align", "left")
    //$("<th></th")
    //  .appendTo("#Variables-table-thead-row")
    //  .text("Last update")
    //  .attr("width", "200")
    //  .attr("align", "left")
    $("<tbody></tbody")
      .attr("id","Variables-table-tbody")
      .appendTo("#Variables-table")    
      
      
    $("<div></div>")
      .attr("id", "col2")
      .appendTo("#row1")
      .addClass("col-md-6")
      
    $("<h2></h2>")
      .attr("id", "Edit-variables")
      .appendTo("#col2")
      .text("Edit Virtual Device:")
    
    $("<table></table>")
      .attr("id", "uservariablesedittable")
      .appendTo("#col2")
      .addClass("table table-bordered")
      
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

    $("<table></table>")
      .attr("id", "uservariablesedittable-actions")
      .appendTo("#col2")
      .addClass("table")
    $("<tr><tr")
      .attr("id","uservariableactions")
      .appendTo("#uservariablesedittable-actions")  
      //.appendTo("#uservariablesedittable")    
    $("<td><td")
      .attr("id","uservariableactionstd")
      .appendTo("#uservariableactions")
      .attr("colspan", "2")
    $("<button></button>")
      .appendTo("#uservariableactionstd")
      .attr("onclick","AddUpdateVariable('a');")
      .attr("type", "button")
      .addClass("btn btn-primary")
      .text("Add")
    $("<button></button>")
      .attr("id","uservariableupdate")
      .appendTo("#uservariableactionstd")
      .attr("type", "button")
      .addClass("btn btn-primary")
      .text("Update")
    $("<button></button>")
      .attr("id","uservariabledelete")
      .appendTo("#uservariableactionstd")
      .attr("type", "button")
      .addClass("btn btn-primary")
      .text("Delete")
    //$("<tr></tr>")
    //  .appendTo("#uservariablesedittable-actions")  
    
    $("<h2></h2>")
      .attr("id", "Devices-list")
      .appendTo("#col2")
      .text("Included Devices:")
    $("<table></table>")
      .attr("id", "activetable")
      .appendTo("#col2")
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
      .appendTo("#col2")
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
      .addClass("btn btn-primary")
      .text("Delete")        


      
    $("<h2></h2>")
    .attr("id", "Device-list")
    .appendTo("#col2")
    .text("Add New Device:")
    $("<table></table>")
      .attr("id", "activeparamstable")
      .appendTo("#col2")
      .addClass("table")
    $("<tr><tr")
      .attr("id","activeparamstablerow")
      .appendTo("#activeparamstable")      
    $("<td><td")
      .attr("id","activeparamstablerowtd")
      .appendTo("#activeparamstablerow")
      .attr("align", "left")
      //.attr("style", "width:200px")
    $("<label><label>")
      .appendTo("#activeparamstablerowtd")
      .attr("align", "left")
      .attr("width", "240")
      .text("Device:")
    $("<select><select")
      .attr("id","comboactivedevice")
      .appendTo("#activeparamstablerowtd")
      //.attr("style", "width:500px")
      .addClass("combobox ui-corner-all")
    $("<button></button>")
      .appendTo("#activeparamstablerowtd")
      .attr("onclick","AddActiveDevice();")
      .attr("type", "button")
      .addClass("btn btn-primary")
      .text("Add")
    //$("<tr></tr>")
    //  .appendTo("#activeparamstable")  


      
  }          
  
}(jQuery, window, document));

$(document).ready(function() {
  //getDomoticzVariables()
  createDomoticzTabs()
  updateDomoticzSetup()
  updateDevices()

  updateDashboard()
  updateDomoticzTabs()
  
  $.userVariableIdx=0;
  $.varNames = [];
  $.virtualDeviceString = [];
  ShowSettingsPage();
  RefreshDevicesComboArray()  
  ShowUserVariables();
  

  //updateLights()

  //updateUtility()
  
  //updateTemp()

  //updateWeather()
  
  //updateScenes()

  $('a[data-toggle="tab"]').on("click", function(event) {
    //alert("I am here")

    var targetTab = event.currentTarget.hash
    //deviceGroup = targetTab.split('-')[1]
    //alert(deviceGroup)
    switch(targetTab){
      case "#tab-Dashboard":
        updateDashboard()
        //$.StartScreen()
      break;
      case "#tab-Lights":
        //updateLights()
        //$.StartScreen()
      break;
      case "#tab-Utility":
        //updateUtility()
        //$.StartScreen()
      break;
      case "#tab-Temp":
        //updateTemp()
        //$.StartScreen()
      break;
      case "#tab-Weather":
        //updateWeather()
        //$.StartScreen()
      break;
      case "#tab-Scenes":
        updateScenes()
        //$.StartScreen()
      break;
      default:
       break;
    }  
  });
});
