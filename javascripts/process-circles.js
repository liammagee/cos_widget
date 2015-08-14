
/* Handles interaction with the circle circles. */

var circle, canvas, numCircles = 2;
jQuery(document).ready(function() {
    /* Get the canvas */
   canvas = jQuery("#circleCanvas")[0];
   var ctx = canvas.getContext('2d');
     /* Setup random data */
    var values = [];
    for (var i = 0; i < 4; i++) {
        var domainValues = new Array();
        for (var j = 0; j < 7; j++) {
            var extent = Math.ceil(Math.random() * numCircles);
            domainValues.push(extent);
        }
        values.push(domainValues);
    }
   /* Create the Circle */
     circle = new CoS.Process(ctx, {
            useSameArea: false,
            width: 200,
            height: 200,
            values:  [],
            numCircles: numCircles,
            drawText: true,
            axisLength: 1.2,
            lineWidth: 1.5,
            radiusProportion: 0.95,
            textRadiusProportion: 0.75,
            font: "bold 12px sans-serif",
            rotation: 0
     });
   circle.drawCompleteCircle();
   /* Event handling */
   addHandler();
});
function addHandler() {
    canvas.addEventListener('click', function(e){
        var point = determinePoint(e);
        circle.findSegment(point.x, point.y, showName);
    });
    canvas.addEventListener('mousemove', function(e){
        var point = determinePoint(e);
        circle.findSegment(point.x, point.y, showName);
    });
}
var determinePoint = function(e) {
        e = jQuery.event.fix(e || window.event);
    return {x: e.offsetX, y: e.offsetY};
}

var determinePoint = function(e) {
        e = jQuery.event.fix(e || window.event);
    return {x: e.offsetX, y: e.offsetY};
}
var showName = function showSubdomain(name) {
    jQuery("#tooltip").html(name);
}

