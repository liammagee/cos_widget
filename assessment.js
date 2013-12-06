

var CoS = CoS || {};


CoS.Assessment = function(ctx, config) {

    // Configurable variables
    var height = config.height || 100;
    var width = config.width || 100;
    var useSameArea = config.useSameArea === false ? false : true;
    var drawText = config.drawText === false ? false : true;
    var radiusProportion = typeof(config.radiusProportion) !== 'undefined' ? config.radiusProportion : 0.9;
    var numCircles = config.numCircles || 9;
    var values = config.values || [];
    var rotation = typeof(config.rotation) !== 'undefined' ? config.rotation : 0;
    var domains = config.domains || [ 
        { name: 'Economics', subdomains: ["Wealth & Distribution", "Technology & Infrastructure", "Labour & Welfare", "Consumption & Use", "Accounting & Regulation", "Exchange & Transfer", "Production & Resourcing"] },

        { name: 'Ecology', subdomains: ["Materials & Energy", "Water & Air", "Flora & Fauna", "Habitat & Settlements", "Built Form & Transport", "Embodiment & Food", "Emission & Waste"] }, 

        { name: 'Culture', subdomains: ["Identity & Engagement", "Creativity & Recreation", "Memory & Projection", "Belief & Ideas", "Gender & Generations", "Enquiry & Learning", "Health & Wellbeing"] }, 
        
        { name: 'Politics', subdomains: ["Ethics & Accountability", "Dialogue & Reconciliation", "Security & Accord", "Representation & Negotiation", "Communication & Critique", "Law & Justice", "Organization & Governance"        ] }
        ];
    var ratings = config.ratings || [
        { label: "Critical", color: "#ED1C24" },
        { label: "Bad", color: "#F26522" },
        { label: "Highly Unsatisfactory", color: "#F7941E" },
        { label: "Satisfactory-", color: "#FFC20E" },
        { label: "Satisfactory", color: "#FFF200" },
        { label: "Satisfactory+", color: "#CBDB2A" },
        { label: "Highly Satisfactory", color: "#8DC63F" },
        { label: "Good", color: "#39B44A" },
        { label: "Vibrant", color: "#00A651" }
    ];
    /*
// Consider:
//     darker vibrant green
//     Change Satisfactory- to Unsatisfactory
//     Change Satisfactory to Neither Satisfactory nor Unsatisfactory
//     Change Satisfactory+ to Satisfactory
    var ratings = config.ratings || [
        { label: "Critical", color: "#ED1C24" },
        { label: "Bad", color: "#F26522" },
        { label: "Highly Unsatisfactory", color: "#F7941E" },
        { label: "Unsatisfactory", color: "#FFC20E" },
        { label: "Neither Unsatisfactory nor Satisfactory", color: "#FFF200" },
        { label: "Satisfactory", color: "#CBDB2A" },
        { label: "Highly Satisfactory", color: "#8DC63F" },
        { label: "Good", color: "#39B44A" },
        { label: "Vibrant", color: "#009631" }
    ];
    */

    // Computed variables
    var x = Math.floor(width / 2), y = Math.floor(y = height / 2);
    var radius = Math.floor(x * radiusProportion);
    var maxArea = Math.pow(radius, 2) * Math.PI;
    var axisLength = config.axisLength || 1;

    // Setup context
    ctx.lineWidth = config.lineWidth || 1;
    ctx.font = config.font || "18px sans-serif";
    ctx.translate(x, y);
    ctx.rotate(rotation * Math.PI/180);
    ctx.translate(-x, -y);


    this.refreshValues = function(vals) {
        values = vals;
        this.drawAssessmentCircle();
    }

    this.drawSegment = function(quadrant, sector, extent) {
        var colours = ratings.map(function(c) {return c.color;});
        var colour = colours[extent - 1];
        var quadFac = Math.PI;
        var dirFac = 1;

        var newRad = radius * extent / numCircles;
        if (useSameArea) {
            var newArea = maxArea * extent / numCircles;
            newRad = Math.pow(newArea / Math.PI, 1/2);
        }
        var startArcX = x + Math.sin(quadFac * sector  / 7) * dirFac * newRad;
        var startArcY = y + Math.cos(quadFac * sector  / 7) * dirFac * newRad;
        var endArcX = x + Math.sin(quadFac * (sector + 1) / 7) * dirFac * newRad;
        var endArcY = y + Math.cos(quadFac * (sector + 1)  / 7) * dirFac * newRad;
        var startAngle = Math.PI + Math.PI / 14 * (quadrant * 7 + sector);
        var endAngle = startAngle + Math.PI / 14;


        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, radius, startAngle, endAngle, false);
        ctx.closePath();
        ctx.fillStyle = '#fff';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, newRad, startAngle, endAngle, false);
        ctx.closePath();
        ctx.fillStyle = colour;
        ctx.fill();

    }

    this.drawSegmentLines = function() {
        ctx.beginPath();
        for (var i = 0; i < 4; i ++) {
            var quadFac = Math.PI;
            var dirFac = 1;
            switch(i) {
                case 0:
                    quadFac /= -2;
                    break;
                case 1:
                    quadFac /= -2;
                    dirFac = -1;
                    break;
                case 2:
                    quadFac /= 2;
                    dirFac = -1;
                    break;
                case 3:
                    quadFac /= 2;
                    break;
            }
            for (var j = 1; j < 7; j ++) {
                ctx.moveTo(x, y);
                ctx.lineTo(x + Math.sin(quadFac * j  / 7) * dirFac * radius, y + Math.cos(quadFac * j  / 7) * dirFac * radius);
            }
        }
        ctx.closePath();
        ctx.strokeStyle = "#000";
        ctx.stroke();
    }

    this.drawCircles = function() {
        for (var i = numCircles; i > 0; i -= 1) {
            var newRad = radius * i / numCircles;
            if (useSameArea) {
                var newArea = maxArea * i / numCircles;
                newRad = Math.pow(newArea / Math.PI, 1/2);
            }
            ctx.moveTo(x + newRad, y);
            ctx.arc(x, y, newRad, 0, Math.PI * 2, false);
        }
        ctx.closePath();
        ctx.strokeStyle = "#000";
        ctx.stroke();

    }

    this.drawAxes = function() {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y - radius * axisLength);
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + radius * axisLength);
        ctx.moveTo(x, y);
        ctx.lineTo(x - radius * axisLength, y);
        ctx.moveTo(x, y);
        ctx.lineTo(x + radius * axisLength, y);
        ctx.closePath();
        ctx.strokeStyle = "#000";
        ctx.stroke();
    }


    this.drawText = function() {
        var angle = 45;
        ctx.fillStyle = '#BCBEC0';
        for (var j = 0; j < domains.length; j++) {
            var domain = domains[j];
            var text = domain.name.toUpperCase();
            var len = text.length, s;
            var metrics = ctx.measureText(text);
            var w = metrics.width;
            var correction = (w / radius);
            var radiusCorrection = (correction * (Math.PI / 2)) / 2;
    
            ctx.save();
            ctx.translate(x, y);

            var correctedAngle = (j * Math.PI / 2) - ((Math.PI / 4)) - radiusCorrection;
            ctx.rotate(correctedAngle);
            for (i = 0; i < len; i++) {
                // i / len
              ctx.save();
              ctx.rotate((i / len) * correction * (Math.PI / 2));
              ctx.translate(0, -1 * radius * 1.05);
              s = text[i];
              ctx.fillText(s, 0, 0);
              ctx.restore();
            }
            ctx.restore();
        }
    }


    this.drawAssessmentCircle = function() {
        // Draw segments lines
        ctx.clearRect(0, 0, width, height);
        for (var i = 0; i < values.length; i++) {
            var domainValues = values[i];
            for (var j = 0; j < domainValues.length; j++) {
                this.drawSegment(i, j, domainValues[j]);
            }
        }

        // Draw 28 - 4 segment lines
        this.drawSegmentLines();
        this.drawCircles();
        this.drawAxes();
        if (drawText)
            this.drawText();
    }

    this.updateCircleSegment = function(domainId, subdomainId, extent) {
        values[domainId][subdomainId] = extent;
        this.drawAssessmentCircle();
        // this.drawSegment(domainId, subdomainId, extent);
        // this.drawSegmentLines();
        // this.drawCircles();
        // this.drawAxes();
    } 

    this.findSegment = function(eventX, eventY, callback) {
        var coordX = eventX - x;
        var coordY = eventY - y;
        var hypotenuse = Math.pow(Math.pow(coordX, 2) + Math.pow(coordY, 2), 0.5);
        if (hypotenuse < radius) {
            // Which quadrant?
            var quadrant = 0;
            if (coordX < 0 && coordY < 0) {
                quadrant = 0;
            }
            else if (coordY < 0) {
                quadrant = 1;
            }
            else if (coordX < 0) {
                quadrant = 3;
            }
            else  {
                quadrant = 2;
            }
            var angleInRadians = Math.atan(coordX / coordY);
            var angle = (angleInRadians * 2 / Math.PI) * 90;
            switch (quadrant) {
                case 0:
                    angle = 180 + (90 - angle);
                    break;
                case 1:
                    angle = 180 + (90 - angle);
                    break;
                case 2:
                    angle = (90 - angle);
                    break;
                case 3:
                    angle = (90 - angle);
                    break;
            }
            var currentDomain = domains[quadrant];
            var subdomainId = Math.floor((angle / 360) * (4 * 7)) % 7;
            var currentSubdomain = currentDomain.subdomains[subdomainId];
            oldValue = values[quadrant][subdomainId];
            var newValue = Math.floor((hypotenuse / radius) * numCircles) + 1;
            if (useSameArea) {
                var newArea = Math.pow(hypotenuse, 2) * Math.PI;
                newValue = Math.ceil(newArea / maxArea * numCircles);
            }
            callback(quadrant, currentDomain.name, subdomainId, currentSubdomain, oldValue, newValue);
        }
    }


    this.getRatingText = function(index) {
        return ratings[index].label;
    }

    this.getRatingColor = function(index) {
        return ratings[index].color;
    }
};

