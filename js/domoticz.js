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
    SetupTabs.Magic = 1
  
    
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
      .appendTo("#" + index)
      .attr("href","#" + index +"-setup-tab")
      .attr("data-toggle", "tab")
      .text(index)
      
    $("<div></div>")
      .attr("id", index + "-setup-tab")
      .addClass("frame")
      .appendTo("#setup-tabs-frames")
      }
    })
      
  
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
            $('#Variables-setup-table-1').dataTable( {
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
                } );
    }
  
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
        $('#Devices-setup-table-1').dataTable({
          "bProcessing": true,
          "bDestroy": true,
          "bSort": true,
          "bOrder": [[0, "asc"]],
          "aaData": devices.result,
          "aoColumns": [
             { "mData": "idx" },
             { "mData": "Name" },
             { "mData": "Type" },
             { "mData": "Data" },
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
  
  //Create a list of devices appended by VD Name and Type
  updateDevices = function(){
    var col = 1;
    var userVariables = $.getUservariables()
    userVariables.result.forEach(function(value, index){
      var deviceidx = value.Value.split(",")
      var virtualDeviceName = value.Name.split('_')[1];
      for(i = 1; i < deviceidx.length; i++) {
        var device = $.getDevice(deviceidx[i])
        device.forEach(function(value, key){
          //alert(value)
          //value.add("Virtual Deivce Name", virtualDeviceName)
          //value.add("Virtual Deivce Type", virtualDeviceName)
        })
      }    
    })
  }
  
  //Create Lights tab
  updateLights = function(){
    var device = $.getUseddevices()
    device.result.forEach(function(value, key){
      if(value.Type == "Lighting 2"){
        var switchType = value.SwitchType.replace(/[_\s]/g, '').replace(/[^a-z0-9-\s]/gi, '');
        var text = value.Status
        switch (value.SwitchType) {
          case "On/Off":
            if (value.Status == "On")
              var deviceType = "../images/Light48_On.png"
            else
              var deviceType = "../images/Light48_Off.png"
          break;
          case "Contact":
            if (value.Status == "Open")
              var deviceType = "../images/contact48_open.png"
            else
              var deviceType = "../images/contact48.png"
          break;
          case "Motion Sensor":
            if (value.Status == "On")
              var deviceType = "../images/motion48-on.png"
            else
              var deviceType = "../images/motion48-off.png"
          break;
          case "Smoke Detector":
            if (value.Status == "On")
              var deviceType = "../images/smoke48on.png"
            else
              var deviceType = "../images/smoke48off.png"
            break;
          case "Dimmer":
            if (value.Status == "On")
              var deviceType = "../images/dimmer48-on.png"
            else
              var deviceType = "../images/dimmer48-off.png"
          break;
          default:
            var deviceType = "icon-question"
          break;
        }
        
        if(!$("#" +"lights-tile-area").length) {
          $("<div></div>")
            .attr("id", "lights-tile-area")
            .appendTo("#tab-Lights")
            .addClass("tile-area tile-area-darkTeal")
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
            .attr("data-click","transform")
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
            .text(value.Status)
        }

        // add a tile content block each real device in the virtual device tile
        if(!$("#" +"lights-" +value.idx +"-tile-content").length){
          $("<div></div>")
          .attr("id", "lights-" +value.idx +"-tile-content")
          .appendTo("#" +"lights-" +value.idx +"-tile")
          .addClass("tile-content email")
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
            .attr("src", deviceType)
        }      
        if(!$("#" +"lights-" +value.idx +"-tile-content-email-data").length){
          // add data or status
          $("<div></div>")
            .attr("id", "lights-" +value.idx +"-tile-content-email-data")
            .appendTo("#" +"lights-" +value.idx +"-tile-content")
            .addClass("email-data")
          $("<span></span>")
            .attr("id", "lights-" +value.idx +"-tile-content-email-data-status")
            .appendTo("#" +"lights-" +value.idx + "-tile-content-email-data" )
            .addClass("email-data-title")
            .text(text)
          $("<span></span>")
            .attr("id", "lights-" +value.idx +"-tile-content-email-data-name")
            .appendTo("#" +"lights-" +value.idx + "-tile-content-email-data" )
            .addClass("email-data-subtitle fg-darkCobalt")
            .text(value.Name)
          $("<span></span>")
            .attr("id", "lights-" +value.idx +"-tile-content-email-data-lastupdate")
            .appendTo("#" +"lights-" +value.idx + "-tile-content-email-data" )
            .addClass("email-data-text fg-gray")
            .text(value.LastUpdate)
        }
        // update text if not the same
        if ($("#" +"lights-" +value.idx +"-tile-content-email-data-status").text() != text){
          $("#" +"lights-" +value.idx +"-tile-content-email-data-status")
            .hide()
            .text(text)
            .fadeIn(1500)
        }
        // Update the image in case of status chage
        if ($("#" +"lights-" +value.idx +"-tile-content-email-image-data").attr('src') != deviceType){
          $("#" +"lights-" +value.idx +"-tile-content-email-image-data")
            .hide()
            .attr("src", deviceType)
            .fadeIn(1500)
        }
        if ($("#" +"lights-" +value.idx +"-tile-content-email-data-lastupdate").text() != value.LastUpdate){        
          $("#" +"lights-" +value.idx +"-tile-content-email-data-lastupdate")
            .hide()
            .text(value.LastUpdate)
            .fadeIn(1500)        
        }
      }
    })
  }

  //update Dashboard
  updateDeviceData = function(){
    //deviceGroup = $("ul.tabs li a").find(".active");
    //alert(deviceGroup)
    timerDeviceUpdate = setTimeout(updateDeviceData, 5000)
    var deviceidx
    var deviceName
    var vdidx
    var domoticzUserVariables = $.getUservariables()
    domoticzUserVariables.result.forEach(function(value, index){
      if(value.Name.match(/vd_/)){
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
        if(!$("#" +"tile-area").length) {
          $("<div></div>")
            .attr("id", "tile-area")
            //.attr("href", "#Dashboard")
            .appendTo("#tab-Dashboard")
            //.appendTo("#tab-" +deviceGroup)
            .addClass("tile-area tile-area-darkTeal")
          $("<h2></h2>")
            .appendTo("#tile-area")
            .addClass("tile-area-title fg-white")
            //.text("Dashboard")
        }
        if(!$("#" + virtualDeviceType +"-tile-group").length) {
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
        if(!$("#" + virtualDeviceName +"-tile").length) {
          // Create the tile for the virtual deivce
          $("<a></a>")
            .attr("id", virtualDeviceName +"-tile")
            .appendTo("#" +virtualDeviceType +"-tile-group")
            .addClass("tile double bg-lightBlue live")
            .attr("data-role","live-tile")
            .attr("data-effect","slideUpDown")
            .attr("data-click","transform")
        }
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
              //case "Dimmer":
                //var deviceType = "../images/dimmer48-on.png"
              //break;
              case "Rain":
                var deviceType = "../images/rain48.png"
              break;
              case "Wind":
                var deviceType = "../images/wind48.png"
              break;
              //case "Contact":
                //var deviceType = "../images/contact48.png"
              //break;
              case "Temp":
                var deviceType = "../images/temp48.png"
              break;
              case "Temp + Humidity":
                var deviceType = "../images/temp48.png"
              break;
              case "Temp + Humidity + Baro":
                var deviceType = "../images/gauge48.png"
              break;
              //case "SmokeDetector":
                //var deviceType = "../images/smoke48on.png"
              //break;
              case "Lighting 2":
                switch (value.SwitchType) {
                  case "On/Off":
                    if (value.Status == "On")
                      var deviceType = "../images/Light48_On.png"
                    else
                      var deviceType = "../images/Light48_Off.png"
                  break;
                  case "Contact":
                    if (value.Status == "Open")
                      var deviceType = "../images/contact48_open.png"
                    else
                      var deviceType = "../images/contact48.png"
                  break;
                  case "Motion Sensor":
                    if (value.Status == "On")
                      var deviceType = "../images/motion48-on.png"
                    else
                      var deviceType = "../images/motion48-off.png"
                  break;
                  case "Smoke Detector":
                    if (value.Status == "On")
                      var deviceType = "../images/smoke48on.png"
                    else
                      var deviceType = "../images/smoke48off.png"
                  break;
                  case "Dimmer":
                    if (value.Status == "On")
                      var deviceType = "../images/dimmer48-on.png"
                    else
                      var deviceType = "../images/dimmer48-off.png"
                  break;
                  default:
                    var deviceType = "icon-question"
                  break;
                }
              break;
              case "Security":
                var deviceType = "../images/security48.png"
              break;
              //case "DuskSensor":
                //var deviceType = "icon-sun-5"
              //break;
              case "General":
                switch (value.SubType) {
                  case "Solar Radiation":
                    var deviceType = "../images/radiation48.png"
                  break;
                  case "Percentage":
                    var deviceType = "../images/Percentage48.png"
                  break;
                }
              break;
              case "Usage":
                var deviceType = "../images/current48.png"
              break;
              case "Energy":
                var deviceType = "../images/current48.png"
              break;
              //case "MotionSensor":
                //var deviceType = "../images/motion48-on.png"
              //break;
              case "Lux":
                var deviceType = "../images/lux48.png"
              break;
                    //case "Weather":
                //var deviceType = "icon-weather"
              //break;
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
                .attr("id", value.idx +"-tile-content-email-image-data")
                .appendTo("#" + value.idx +"-tile-content-email-image")
                .attr("src", deviceType)
            }      
            if(!$("#" +value.idx +"-tile-content-email-data").length){
              // add data or status
              $("<div></div>")
                .attr("id", value.idx +"-tile-content-email-data")
                .appendTo("#" + value.idx +"-tile-content")
                .addClass("email-data")
              $("<span></span>")
                .attr("id", value.idx +"-tile-content-email-data-status")
                .appendTo("#" + value.idx + "-tile-content-email-data" )
                .addClass("email-data-title")
                .text(text)
              $("<span></span>")
                .attr("id", value.idx +"-tile-content-email-data-status")
                .appendTo("#" + value.idx + "-tile-content-email-data" )
                .addClass("email-data-subtitle fg-darkCobalt")
                .text(value.Name)
              $("<span></span>")
                .attr("id", value.idx +"-tile-content-email-data-lastupdate")
                .appendTo("#" + value.idx + "-tile-content-email-data" )
                .addClass("email-data-text fg-gray")
                .text(value.LastUpdate)
            }
            // update text if not the same
            if ($("#" +value.idx +"-tile-content-email-data-status").text() != text){
              $("#" +value.idx +"-tile-content-email-data-status")
                .hide()
                .text(text)
                .fadeIn(1500)
            }
            // Update the image in case of status chage
            if ($("#" + value.idx +"-tile-content-email-image-data").attr('src') != deviceType){
              $("#" + value.idx +"-tile-content-email-image-data")
                .hide()
                .attr("src", deviceType)
                .fadeIn(1500)
            }
            if ($("#" + value.idx +"-tile-content-email-data-lastupdate").text() != value.LastUpdate){        
              $("#" +value.idx +"-tile-content-email-data-lastupdate")
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
            if (value.Type == "Usage") {
              var currentPower = parseFloat(value.Data.split(' ')[0])
              if (currentPower <= 50) {
                $("#" + virtualDeviceName +"-tile")
                  .removeClass($("#" + virtualDeviceName +"-tile").attr('class'))
                  .addClass("tile double bg-darkGreen live")
              }          
              if ((currentPower > 50) && (currentPower <= 500)) {
                $("#" + virtualDeviceName +"-tile")
                  .removeClass($("#" + virtualDeviceName +"-tile").attr('class'))
                  .addClass("tile double bg-green live")
              }          
              if ((currentPower > 500) && (currentPower <= 1000)) {
                $("#" + virtualDeviceName +"-tile")
                  .removeClass($("#" + virtualDeviceName +"-tile").attr('class'))
                  .addClass("tile double bg-orange live")
              }          
              if ((currentPower > 1000) && (currentPower <= 1500)) {
                $("#" + virtualDeviceName +"-tile")
                  .removeClass($("#" + virtualDeviceName +"-tile").attr('class'))
                  .addClass("tile double bg-darkOrange live")
              }          
              if ((currentPower > 1500) && (currentPower <= 2000)) {
                $("#" + virtualDeviceName +"-tile")
                  .removeClass($("#" + virtualDeviceName +"-tile").attr('class'))
                  .addClass("tile double bg-darkRed live")
              }
              if (currentPower > 2000) {
                $("#" + virtualDeviceName +"-tile")
                  .removeClass($("#" + virtualDeviceName +"-tile").attr('class'))
                  .addClass("tile double bg-darkViolet live")
              }          
            }
            if ((value.Type == "Temp") || (value.Type == "Temp + Humidity")) {
              var currentTemp = parseFloat(value.Data.split(' ')[0])
              if (currentTemp <= 5) {
                $("#" + virtualDeviceName +"-tile")
                  .removeClass($("#" + virtualDeviceName +"-tile").attr('class'))
                  .addClass("tile double bg-lightTeam live")
              }          
              if ((currentTemp > 5) && (currentTemp <= 15)) {
                $("#" + virtualDeviceName +"-tile")
                  .removeClass($("#" + virtualDeviceName +"-tile").attr('class'))
                  .addClass("tile double bg-lightBlue live")
              }          
              if ((currentTemp > 15) && (currentTemp <= 25)) {
                $("#" + virtualDeviceName +"-tile")
                  .removeClass($("#" + virtualDeviceName +"-tile").attr('class'))
                  .addClass("tile double bg-amber live")
              }          
              if ((currentTemp > 25) && (currentTemp <= 35)) {
                $("#" + virtualDeviceName +"-tile")
                  .removeClass($("#" + virtualDeviceName +"-tile").attr('class'))
                  .addClass("tile double bg-orange live")
              }          
              if (currentTemp > 35) {
                $("#" + virtualDeviceName +"-tile")
                  .removeClass($("#" + virtualDeviceName +"-tile").attr('class'))
                  .addClass("tile double bg-red live")
              }          
            }
          })
        }
      }
    })
  }
}(jQuery, window, document));

$(document).ready(function() {
  //getDomoticzVariables()
  createDomoticzTabs()
  updateDomoticzSetup()
  updateDevices()

  updateDeviceData()
  clearTimeout(timerDeviceUpdate)

  updateLights()

  $('a[data-toggle="tab"]').on("click", function(event) {
    //alert("I am here")
    var targetTab = event.currentTarget.hash
    //deviceGroup = targetTab.split('-')[1]
    //alert(deviceGroup)
    switch(targetTab){
      case "#tab-Dashboard":
        updateDeviceData()
      break;
      case "#tab-Lights":
        updateLights()
        clearTimeout(timerDeviceUpdate)
      break;
      default:
        clearTimeout(timerDeviceUpdate)
       break;
    }  
  });
});
