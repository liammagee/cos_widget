
/* Handles interaction with the circle circles. */

var circle, canvas, numCircles = 9;
$(document).ready(function() {
    /* Get the canvas */
   canvas = $("#circleCanvas")[0];
   var ctx = canvas.getContext('2d');

    /* Setup random data */
    var randomise = false;
    var values = [];
    for (var i = 0; i < 4; i++) {
        var domainValues = new Array();
        for (var j = 0; j < 7; j++) {
            var extent = 0;
            if ( randomise ) {
                extent = Math.ceil(Math.random() * numCircles);
            }
            domainValues.push(extent);
        }
        values.push(domainValues);
    }
    /* Create the Assessment */
    circle = new CoS.circleFactory(ctx, {
        width: 600,
        height: 600,
        values:  values,
        numCircles: numCircles,
        drawText: true,
        axisLength: 1.2,
        axisWidth: 2,
        lineWidth: 1,
        radiusProportion: 0.75,
        font: "bold 20px sans-serif",
        rotation: 0
    });
   circle.drawCompleteCircle();
   /* Event handling */
   addHandler();
});

var addHandler = function() {
    canvas.addEventListener('click', function(e){
        var point = determinePoint(e);
        if ( $('#showDialog')[ 0 ].checked )
            circle.findSegment(point.x, point.y, drawSegment);
        else
            circle.findSegment(point.x, point.y, drawSegment);
    });
    canvas.addEventListener('mousemove', function(e){
        var point = determinePoint(e);
        circle.findSegment(point.x, point.y, showSubdomain);
    });
    $( '#btnReset' ).click( reset );
}
var determinePoint = function(e) {
    e = $.event.fix(e || window.event);
    return {x: e.offsetX, y: e.offsetY};
}
var drawSegment = function drawSegment(domainId, domainName, subdomainId, subdomainName, oldValue, newValue) {
   /* saveAssessment(extent); */
   circle.updateCircleSegment(domainId, subdomainId, newValue);
}
var showSubdomain = function showSubdomain(domainId, domainName, subdomainId, subdomainName, oldValue, newValue) {
    $("#tooltip").html(domainName + ": " + subdomainName);
}
var reset = function showSubdomain(domainId, domainName, subdomainId, subdomainName, oldValue, newValue) {
    circle
}
