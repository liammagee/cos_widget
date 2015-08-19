
/* Handles interaction with the circle circles. */

var circle, canvas, numCircles = 9;
jQuery(document).ready(function() {
    /* Get the canvas */
   canvas = jQuery("#circleCanvas")[0];
   var ctx = canvas.getContext('2d');
     /* Setup random data */
    var values = new Array();
    for (var i = 0; i < 4; i++) {
        var domainValues = new Array();
        for (var j = 0; j < 4; j++) {
            var extent = Math.ceil(Math.random() * numCircles);
            domainValues.push(extent);
        }
        values.push(domainValues);
    }
   /* Create the Assessment */
     circle = new CoS.Knowledge(ctx, {
        width: 600,
        height: 600,
        values:  values,
        numCircles: numCircles,
        drawText: true,
        axisLength: 1.2,
        lineWidth: 1,
        radiusProportion: 0.75,
        font: "bold 20px sans-serif",
        rotation: 0
     });
   circle.drawCompleteCircle();
   /* Event handling */
   addHandler();
});
function addHandler() {
    canvas.addEventListener('click', function(e){
        var point = determinePoint(e);
        circle.findSegment(point.x, point.y, showSubdomain);
    });
    canvas.addEventListener('mousemove', function(e){
        var point = determinePoint(e);
        circle.findSegment(point.x, point.y, showSubdomain);
    });
}
var determinePoint = function(e) {
        e = jQuery.event.fix(e || window.event);
    return {x: e.offsetX, y: e.offsetY};
}
var drawSegment = function drawSegment(domainId, domainName, subdomainId, subdomainName, oldValue, newValue) {
   /* saveAssessment(extent); */
   circle.updateCircleSegment(domainId, subdomainId, newValue);
}
var showSubdomain = function showSubdomain(domainId, domainName, subdomainId, subdomainName, oldValue, newValue) {
    jQuery("#tooltip").html(domainName + ": " + subdomainName);
}
function addHandler() {
    canvas.addEventListener('click', function(e){
        var point = determinePoint(e);
        circle.findSegment(point.x, point.y, showSubdomain);
    });
    canvas.addEventListener('mousemove', function(e){
        var point = determinePoint(e);
        circle.findSegment(point.x, point.y, showSubdomain);
    });
}
var determinePoint = function(e) {
        e = jQuery.event.fix(e || window.event);
    return {x: e.offsetX, y: e.offsetY};
}
var drawSegment = function drawSegment(domainId, domainName, subdomainId, subdomainName, oldValue, newValue) {
   /* saveAssessment(extent); */
   circle.updateCircleSegment(domainId, subdomainId, newValue);
}
var showSubdomain = function showSubdomain(domainId, domainName, subdomainId, subdomainName, oldValue, newValue) {
    jQuery("#tooltip").html(domainName + ": " + subdomainName);
}

