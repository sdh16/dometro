dometro
=======

Metro UI style dashboard for Domoticz (http://www.domoticz.com) and only works with Domoticz beta versions supporting User Variable functionality.

Uses MetroJS to create live tiles (http://www.drewgreenwell.com/projects/metrojs)

Virtual Devices
===============
Virtual devices are defined using User Variable functionality of Domoticz.

The syntax for creating virtual device is as follows:

Variable Name: vd_Virtual Device Name (vd_Fridge, vd_Washing Machine)

Variable Type: String

Variable Value: virtual deceive type, idx,idx,idx,… 
Examples: OnOff,23,29,45 Motion Sensor,10,11,12,13 Dimmer,75,76,77 Weather,5,6,7,8 

The idx are taken from the device list of domoticz and usually should correspond to the endpoints of the actual physical device.

As an example, from my Aeon MSES, I can combine the Binary Switch idx, Power idx and Energy idx into a single virtual device. You can create any combination of idx into a virtual device (like all temperature sensors into one virtual device).

All the virtual devices are rendered under 'Dashboard' tile-group and animate data from the included devices.

All Scenses and groups are rendered under 'Scenes and Groups' tile-group.

All the devices in domoticz (used ones) are then rendered under tile-groups derived using Domoticz DeviceType.

The tiles get colored based on the on/off, power, temperature or energy values.

Clicking on Sences, Groups or On/Off devic tile with toggle the state fo the scene, group or light (the tile is refreshed after a bit of delay for now).

NOTE: Not all Domoticz devices may get grouped correctly. This is due to the limitation that I could only test with my device list. I am ready to enhance the grouping and tile coloring based on inputs from other users.

Disclaimer
==========
This is work in progress and may not work 100%, so try at own risk.
