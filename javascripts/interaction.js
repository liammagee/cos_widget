
/* Handles interaction with the circle circles. */

var circle, canvas, numCircles = 9, circleType = "Profile";

var config = {
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
};

var setFactory = function() {
    if ( circleType === "Profile" ) {
        CoS.circleFactory = CoS.Profile;
    }
    else if ( circleType === "Process" ) {
        CoS.circleFactory = CoS.Process;
    }
    else if ( circleType === "Knowledge" ) {
        CoS.circleFactory = CoS.Knowledge;
    }
    else if ( circleType === "Engagement" ) {
        CoS.circleFactory = CoS.Engagement;
    }
}

var buildCircle = function() {
    /* Get the canvas */
   canvas = jQuery("#circleCanvas")[0];
   var ctx = canvas.getContext('2d');

    /* Create the Assessment */
    circle = new CoS.circleFactory(ctx, config );
    circle.resetValues();
    circle.drawCompleteCircle();

};

var addHandler = function(callbackClick, callbackMove) {
    if (callbackClick === null) {
      callbackClick = drawSegment;
    }
    if (callbackMove === null) {
      callbackMove = showSubdomain;
    }
    canvas.addEventListener('click', function(e){
        var point = determinePoint(e);
        if ( jQuery('#showDialog').length > 0 && jQuery('#showDialog')[ 0 ].checked )
            circle.findSegment(point.x, point.y, callbackClick);
        else
            circle.findSegment(point.x, point.y, callbackClick);
    });
    canvas.addEventListener('mousemove', function(e){
        var point = determinePoint(e);
        circle.findSegment(point.x, point.y, callbackMove);
    });
    jQuery( '#btnReset' ).click( reset );
    jQuery( '#btnRandomise' ).click( randomise );
    jQuery( '#circleType' ).change( updateCircleType );
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

var updateCircleType = function( obj ) {

    circleType = obj.target.selectedOptions[0].text;

    if (circleType === "Process") {
        numCircles = 2;
        config = {
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
        };
    }

    setFactory();

    buildCircle();
}
