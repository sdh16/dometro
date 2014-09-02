$(document).ready(function () {   

    /*
        Projects tile and lower color strip flip-list
    */
    // reversed value for the color strip    
    var reversed = false;
    // there are 8 items in my color strip flip list, idx is 0 based
    var length = 7;    
    $(".live-tile.projects, .flip-list.color-strip").liveTile({
        backImages: projects_back,
        backIsRandom: false,
        triggerDelay: function (idx) {            
            // !reversed = 1 2 3.., reversed = 7 6 5..
            var delay = !reversed ? idx * 250 : (length - idx) * 250;
            if (idx == length)
                reversed = !reversed;
            return delay;
        }
    });
    // all the other tiles
    $(".live-tile, .flip-list").not(".exclude, .projects, .color-strip").liveTile({
        triggerDelay: function (idx) { return idx * 333; },
        backIsInGrid: true,
    	backIsBackgroundImage: true,
        frontImages: skills_small,
        backImages: skills_large,
        // by default, the html swap shares global properties with image swap
        // we can override the global properties here though
        htmlSwap: {
            frontIsRandom: false,
            backIsRandom: false
        }, 
        frontContent: [
            '<p>..and the custom tile size and theme generator</p>',
            '<p>Like some of the helpful layout features of tile-group and tile-strip</p>',            
            '<p>Hi! I\'m still adding things and stuff for the site and plugins</p>'
        ],
        backContent: [
            '<p>I still have lots of examples to create to demo all of the cool new features in Metro JS</p>',
            '<p>I\'ll be updating JS Fiddle Demos and adding new categories as much as I can</p>',
            '<p>Like the panorama control for Metro JS</p>'
        ]
    });
    /* 
        arrows and buttons for the metrojs carousel
    */
    $(".live-tile.theme").css({ cursor: 'pointer'}).click(function () {
        var data = $(".metrojs-carousel").data("LiveTile");
        data.slideDirection = "forward";
        $(".metrojs-carousel").liveTile("goto", 2);

    });
    $(".live-tile.info").css({ cursor: 'pointer' }).click(function () {
        var data = $(".metrojs-carousel").data("LiveTile");
        data.slideDirection = "backward";
        $(".metrojs-carousel").liveTile("goto", 1);
    });
    $(".live-tile.prev").css({ cursor: 'pointer' }).click(function () {
        $(".metrojs-carousel").liveTile("goto", { index: "prev", direction: 'horizontal' });

    });
    $(".live-tile.next").css({ cursor: 'pointer' }).click(function () {
        // calling goto by itself will get the direction from the slide or the tiledata
        $(".metrojs-carousel").liveTile("goto");
        // this call is equivalent
        // $(".metrojs-carousel").liveTile("goto", { index: "next", autoAniDirection: false });
    });
});
var skills_small = [
     { alt: 'AJAX', src: 'images/skills/ajax_small.jpg' }
    , { alt: 'Android', src: 'images/skills/android_small.jpg' }
    , { alt: 'ASP .Net', src: 'images/skills/aspnet_small.jpg' }
    , { alt: 'CSS 3', src: 'images/skills/css3_small.jpg' }
    , { alt: '.Net', src: 'images/skills/dotnet_small.jpg' }
    , { alt: 'HTML5', src: 'images/skills/HTML5_small.png' }
    , { alt: 'iOS', src: 'images/skills/ios_small.jpg' }
    , { alt: 'JavaScript', src: 'images/skills/javascript_small.png' }
    , { alt: 'jQuery', src: 'images/skills/jquery_small.jpg' }
    , { alt: 'JSON', src: 'images/skills/json_small.jpg' }
    , { alt: 'Kinect', src: 'images/skills/kinect_small.jpg' }
    , { alt: 'Less', src: 'images/skills/less_small.png' }
    , { alt: 'MCSD', src: 'images/skills/mcsd_small.jpg' }
    , { alt: 'MonoDevelop', src: 'images/skills/monodev_small.jpg' }
    , { alt: 'MVC', src: 'images/skills/mvc_small.jpg' }
    , { alt: 'Sharepoint', src: 'images/skills/sharepoint_small.jpg' }
    , { alt: 'Silverlight', src: 'images/skills/silverlight_small.jpg' }
    , { alt: 'Sitefinity Certified', src: 'images/skills/sitefinity-certified_small.png' }
    , { alt: 'Sitefinity', src: 'images/skills/sitefinity_small.jpg' }
    , { alt: 'Telerik', src: 'images/skills/telerik_small.jpg' }
    , { alt: 'Visual Studio', src: 'images/skills/vstudio_small.jpg' }
    , { alt: 'W3C', src: 'images/skills/w3c_small.jpg' }
    , { alt: 'Windows Mobile', src: 'images/skills/winmobile_small.jpg' }
    , { alt: 'Windows Phone', src: 'images/skills/winphone_small.jpg' }
    , { alt: 'XCode', src: 'images/skills/xcode_small.png' }
    , { alt: 'XML', src: 'images/skills/xml_small.jpg' }
    , { alt: 'XNA', src: 'images/skills/xna_small.jpg' }
    , { alt: 'Analytics IQ', src: 'images/skills/analytics-iq_small.png' }
    , { alt: 'Xamarin Certified', src: 'images/skills/xamarin-certified-mobile-developer_small.jpg' }
];
var skills_large = [
     { alt: 'AJAX', src: 'images/skills/ajax.jpg' }
    , { alt: 'Android', src: 'images/skills/android.jpg' }
    , { alt: 'ASP .Net', src: 'images/skills/aspnet.jpg' }
    , { alt: 'CSS 3', src: 'images/skills/back-the-attack.png' }
    , { alt: 'CSS 3', src: 'images/skills/css3.jpg' }
    , { alt: '.Net', src: 'images/skills/dotnet.jpg' }
    , { alt: 'HTML5', src: 'images/skills/HTML5.png' }
    , { alt: 'iOS', src: 'images/skills/ios.jpg' }
    , { alt: 'JavaScript', src: 'images/skills/javascript.png' }
    , { alt: 'jQuery', src: 'images/skills/jquery.jpg' }
    , { alt: 'JSON', src: 'images/skills/json.jpg' }
    , { alt: 'Kinect', src: 'images/skills/kinect.jpg' }
    , { alt: 'Less', src: 'images/skills/less.png' }
    , { alt: 'MCSD', src: 'images/skills/mcsd.jpg' }
    , { alt: 'MonoDevelop', src: 'images/skills/monodev.jpg' }
    , { alt: 'MVC', src: 'images/skills/mvc.jpg' }
    , { alt: 'Sharepoint', src: 'images/skills/sharepoint.jpg' }
    , { alt: 'Silverlight', src: 'images/skills/silverlight.jpg' }
    , { alt: 'Sitefinity Certified', src: 'images/skills/sitefinity-certified.png' }
    , { alt: 'Sitefinity', src: 'images/skills/sitefinity.jpg' }
    , { alt: 'Telerik', src: 'images/skills/telerik.jpg' }
    , { alt: 'Visual Studio', src: 'images/skills/vstudio.jpg' }
    , { alt: 'W3C', src: 'images/skills/w3c.jpg' }
    , { alt: 'Windows Mobile', src: 'images/skills/winmobile.jpg' }
    , { alt: 'Windows Phone', src: 'images/skills/winphone.jpg' }
    , { alt: 'XCode', src: 'images/skills/xcode.png' }
    , { alt: 'XML', src: 'images/skills/xml.jpg' }
    , { alt: 'XNA', src: 'images/skills/xna.jpg' }
    , { alt: 'Analytics IQ', src: 'images/skills/analytics-iq.png' }
    , { alt: 'Xamarin Certified', src: 'images/skills/xamarin-certified-mobile-developer.jpg' }
];

var projects_back = [
    { alt: "WordStreamer", src: "images/projects/wordstreamer.png" },
    { alt: "MetroJS", src: "images/projects/metro-js.png" },
    { alt: "Sitefinity controls", src: "images/projects/archived-projects.png" },
    { alt: "Archived Projects on SkyDrive", src: "images/projects/sitefinity-controls.png" },
    { alt: "LeapFrog Interactive Kinect", src: "images/projects/leapfrog-kinect.jpg" }
];

