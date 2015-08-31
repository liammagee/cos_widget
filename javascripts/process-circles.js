

jQuery(document).ready(function() {

   circleType = "Process";

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

   setFactory();

   buildCircle();

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
var showName = function(name) {
    jQuery("#tooltip").html(name);
}

