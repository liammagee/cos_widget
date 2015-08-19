
/* Handles interaction with the circle circles. */

var circle, canvas, numCircles = 5;
jQuery(document).ready(function() {
    /* Get the canvas */
   canvas = jQuery("#circleCanvas")[0];
   var ctx = canvas.getContext('2d');

    /* Setup random data */

    /* Create the Assessment */
    circle = new CoS.circleFactory(ctx, {
        width: 600,
        height: 600,
        numCircles: numCircles,
        drawText: true,
        axisLength: 1.2,
        axisWidth: 2,
        lineWidth: 1,
        radiusProportion: 0.75,
        font: "bold 20px sans-serif",
        rotation: 0
    });
    circle.resetValues();
   circle.drawCompleteCircle();
   /* Event handling */
   addHandler();
});

var addHandler = function() {
    canvas.addEventListener('click', function(e){
        var point = determinePoint(e);
        if ( jQuery('#showDialog').length > 0 && jQuery('#showDialog')[ 0 ].checked )
            circle.findSegment(point.x, point.y, drawSegment);
        else
            circle.findSegment(point.x, point.y, drawSegment);
    });
    canvas.addEventListener('mousemove', function(e){
        var point = determinePoint(e);
        circle.findSegment(point.x, point.y, showSubdomain);
    });
    jQuery( '#btnReset' ).click( reset );
    jQuery( '#btnRandomise' ).click( randomise );
}
var determinePoint = function(e) {
    e = jQuery.event.fix(e || window.event);
    return {x: e.offsetX, y: e.offsetY};
}
var drawSegment = function drawSegment(domainId, domainName, subdomainId, subdomainName, oldValue, newValue) {
   /* saveAssessment(extent); */
   circle.updateCircleSegment(domainId, subdomainId, newValue);
}
var showSubdomain = function(domainId, domainName, subdomainId, subdomainName, oldValue, newValue) {
    jQuery("#tooltip").html(domainName + ": " + subdomainName);
}
var reset = function() {
    circle.resetValues( false );
}
var randomise = function() {
    circle.resetValues( true );
}
