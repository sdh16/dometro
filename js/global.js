$(document).ready(function () {
/*
        Panorama - Im still tweaking this for android
*/
var $panos = $(".panorama"),
    stgs = {
        size: 'auto',
        padRight: 48,
        showScroll: window.showScroller || false,
        contentSel: ".content-wrapper",
        contentWidthSel: typeof (window.contentWidthSel) !== "undefined" ? window.contentWidthSel : ".content-wrapper>section,.content-wrapper>div,.content-wrapper>.tile-group"
    },
    metrojs = $.fn.metrojs;
    if (metrojs.capabilities === null)
        metrojs.checkCapabilities();
    if ($panos.length > 0){
        $panos.each(function (idx, ele) {
            var $pano = $(ele);
            var panoHeight = $pano.height();
            var panoWidth = $pano.width();
            if (!metrojs.capabilities.canTouch) {
                if (!stgs.showScroll)
                    $pano.css({ 'overflow-x': 'hidden' });
                setPanoWidth($pano, stgs);
                $pano.bind("mousewheel.metrojs", function (event, delta) {
                    if (event.ctrlKey)
                        return;
                    event.preventDefault();
                    var amount;
                    if (delta < 0) {
                        amount = 90;
                    } else {
                        amount = -90;
                    }
                    $pano.scrollLeft($pano.scrollLeft() + amount);
                });
            }else{
                setPanoWidth($pano, stgs);
            }
        });         
    }
    function setPanoWidth($pano, stgs) {
        if (stgs.size === 'auto') {
            var width = stgs.padRight;
            $pano.find(stgs.contentWidthSel).each(function () {
                width += $(this).outerWidth(true);
            });
            // debug
            // $(".site-title").append(width + '-');
            $pano.find(stgs.contentSel).css({ width: width + 'px' });
        } else if (stgs.size.length > 0) {
            // debug
            // $(".site-title").append(stgs.size + '+');
            $pano.find(stgs.contentSel).css({ width: stgs.size });
        }
    }
    var viewport = (function viewport() {
        var e = window,
            a = 'inner';
        if (!('innerWidth' in window)) {
            a = 'client';
            e = document.documentElement || document.body;
        }
        return { width: e[a + 'Width'], height: e[a + 'Height'] };
    })();
    $("img,.live-tile.bounce").on("dragstart", function (e) {
        e.preventDefault();
        return false;
    });
});
	


/* 
    Test code
*/
function appendButtons() {
    var btns = ["search", "home", "twitter", "calendar", "storm", "down", "camera", "camcorder", "qmark", "about", "share", "rain", "cancel", "close", "delete", "trash", "tag"
        , "addcontact", "save", "snow", "msg", "email", "clock", "edit", "circle", "moon", "calc", "gear", "plus", "dot", "restart", "return", "add", "phone", "film", "back"
        , "car", "forward", "selectmany", "stop", "contacts", "select", "sun", "dpad", "play"
    ];
    var $bar = $("<ul class='appbar-buttons'>");
    for (var i = 0; i < btns.length; i++) {
        var line = "<li><a class='" + btns[i] + "' title='" + btns[i] + "'><img src='/images/1pixel.gif' alt='btn' /></a></li>";
        line += "<li><a class='small " + btns[i] + "' title='" + btns[i] + "'><img src='/images/1pixel.gif' alt='btn' /></a></li>";
        $bar.append(line);
    }
    $("body").append($bar);
}
//appendButtons();
