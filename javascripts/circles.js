

var CoS = CoS || {};


CoS.domainColour = '#55b496';

CoS.GenericCircle = function( ctx, config ) {

    // Configurable variables
    var height = config.height || 100;
    var width = config.width || 100;
    var useSameArea = config.useSameArea === false ? false : true;
    var drawText = config.drawText === false ? false : true;
    var radiusProportion = typeof(config.radiusProportion) !== 'undefined' ? config.radiusProportion : 0.9;
    var numCircles = config.numCircles || 9;
    this.numDomains = config.numDomains || 4;
    this.numSubdomains = config.numSubdomains || 7;

    this.values = config.values || [];
    var rotation = typeof(config.rotation) !== 'undefined' ? config.rotation : 0;

    this.domains = config.domains || [
        { name: 'Economics', subdomains: ["Wealth & Distribution", "Technology & Infrastructure", "Labour & Welfare", "Consumption & Use", "Accounting & Regulation", "Exchange & Transfer", "Production & Resourcing"] },

        { name: 'Ecology', subdomains: ["Materials & Energy", "Water & Air", "Flora & Fauna", "Habitat & Settlements", "Built Form & Transport", "Embodiment & Sustenance", "Emission & Waste"] },

        { name: 'Culture', subdomains: ["Identity & Engagement", "Creativity & Recreation", "Memory & Projection", "Belief & Ideas", "Gender & Generations", "Enquiry & Learning", "Wellbeing & Health"] },

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
    var axisWidth = config.axisWidth || 1;


    // Setup context
    ctx.lineWidth = config.lineWidth || 0.5;
    ctx.font = config.font || "18px sans-serif";
    ctx.translate(x, y);
    ctx.rotate(rotation * Math.PI/180);
    ctx.translate(-x, -y);


    this.resetValues = function( randomise ) {
        var domainValues = [];
        for ( var i = 0; i < this.numDomains; i++ ) {
            subdomainValues = [];
            for ( var j = 0; j < this.numSubdomains; j++ ) {
                var val = 0;
                if ( randomise )
                    val = Math.ceil(Math.random() * numCircles)
                subdomainValues.push( val );
            }
            domainValues.push(subdomainValues);
        }
        this.refreshValues(domainValues);
    };

    this.refreshValues = function(vals) {
        this.values = vals;
        this.drawCompleteCircle();
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
        var startArcX = x + Math.sin(quadFac * sector  / this.numSubdomains) * dirFac * newRad;
        var startArcY = y + Math.cos(quadFac * sector  / this.numSubdomains) * dirFac * newRad;
        var endArcX = x + Math.sin(quadFac * (sector + 1) / this.numSubdomains) * dirFac * newRad;
        var endArcY = y + Math.cos(quadFac * (sector + 1)  / this.numSubdomains) * dirFac * newRad;
        var startAngle = Math.PI + Math.PI / (this.numSubdomains * 2) * (quadrant * this.numSubdomains + sector);
        var endAngle = startAngle + Math.PI / (this.numSubdomains * 2);


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
        var moduloFactor = this.domains.length;
        for (var i = 0; i < this.numDomains; i ++) {
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
            for (var j = 1; j < this.numSubdomains; j ++) {
                ctx.moveTo(x, y);
                ctx.lineTo(x + Math.sin(quadFac * j  / this.numSubdomains) * dirFac * radius, y + Math.cos(quadFac * j  / this.numSubdomains) * dirFac * radius);
            }
        }
        ctx.closePath();
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = "#444";
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
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = "#444";
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
        var oldValue = ctx.lineWidth;
        ctx.lineWidth = axisWidth;
        ctx.strokeStyle = "#444";
        ctx.stroke();
        ctx.lineWidth = oldValue;
    }


    this.drawText = function() {
        var angle = 45;
        ctx.fillStyle = CoS.domainColour;
        for (var j = 0; j < this.domains.length; j++) {
            var domain = this.domains[j];
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


    this.drawCompleteCircle = function() {
        // Draw segments lines
        ctx.clearRect(0, 0, width, height);
        for (var i = 0; i < this.values.length; i++) {
            var domainValues = this.values[i];
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
        this.values[domainId][subdomainId] = extent;
        this.drawCompleteCircle();
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
            var currentDomain = this.domains[quadrant];
            var subdomainId = Math.floor((angle / 360) * (4 * this.numSubdomains) ) % this.numSubdomains;
            var currentSubdomain = currentDomain.subdomains[subdomainId];
            oldValue = this.values[quadrant][subdomainId];
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

CoS.Process = function(ctx, config) {

    CoS.GenericCircle.call( this, ctx, config );

    // Configurable variables
    var height = config.height || 100;
    var width = config.width || 100;
    var useSameArea = config.useSameArea === false ? false : true;
    var drawText = config.drawText === false ? false : true;
    var radiusProportion = typeof(config.radiusProportion) !== 'undefined' ? config.radiusProportion : 0.9;
    var textRadiusProportion = typeof(config.textRadiusProportion) !== 'undefined' ? config.textRadiusProportion : 1.05;
    var numCircles = config.numCircles || 9;
    this.values = config.values || [];
    var rotation = typeof(config.rotation) !== 'undefined' ? config.rotation : 0;
    var fontColor = config.fontColor || "#000000";
    var phases = config.phases || [
        { name: "COMMIT", description: "COMMIT: Affirm, Establish, Choose, Resource", color: "#ED1C24" },
        { name: "ENGAGE", description: "ENGAGE: Consult, Entrust, Empower, Accord", color: "#F26522" },
        { name: "ASSESS", description: "ASSESS: Determine, Analyse, Research, Project", color: "#F7941E" },
        { name: "DEFINE", description: "DEFINE: Clarify, Identify, Refine, Review", color: "#FFC20E" },
        { name: "IMPLEMENT", description: "IMPLEMENT: Authorize, Enable, Liaise, Revise", color: "#FFF200" },
        { name: "MEASURE", description: "MEASURE: Monitor, Document, Reassess, Evaluate", color: "#CBDB2A" },
        { name: "COMMUNICATE", description: "COMMUNICATE: Translate, Publicize, Report, Advise", color: "#8DC63F" }
    ];

    // Computed variables
    var x = Math.floor(jQuery(ctx.canvas).width() / 2), y = Math.floor(jQuery(ctx.canvas).height() / 2);
    var radius = Math.floor(x * radiusProportion);
    var maxArea = Math.pow(radius, 2) * Math.PI;
    var axisLength = config.axisLength || 1;
    var axisWidth = config.axisWidth || 0.5;

    // Setup context
    ctx.lineWidth = config.lineWidth || 1;
    ctx.font = config.font || "18px sans-serif";
    ctx.translate(x, y);
    ctx.rotate(rotation * Math.PI/180);
    ctx.translate(-x, -y);


    this.refreshValues = function(vals) {
        this.values = vals;
        this.drawCompleteCircle();
    }


    this.drawSegment = function(sector, extent) {
        var colours = phases.map(function(c) {return c.color;});
        var colour = colours[sector];
        var quadFac = Math.PI;
        var dirFac = 1;

        var newRad = radius * (extent - 1) / numCircles;
        if (useSameArea) {
            var newArea = maxArea * (extent - 1) / numCircles;
            newRad = Math.pow(newArea / Math.PI, 1/2);
        }
        var sectorCount = 7 / 4;
        var quadFac = 0;
        var startAngle = Math.PI + Math.PI / (sectorCount * 2) * (quadFac * sectorCount + sector);
        var endAngle = startAngle + Math.PI / (sectorCount * 2);
        var triangleEndAngle = endAngle - Math.PI / 14;
        var meX = x + Math.sin(triangleEndAngle) * newRad;
        var meY = y + Math.cos(triangleEndAngle) * newRad;
        var feX = x + Math.sin(triangleEndAngle) * radius;
        var feY = y + Math.cos(triangleEndAngle) * radius;
        var aeX = x + Math.sin(triangleEndAngle - Math.PI / 30) * (newRad + (radius - newRad) / 2);
        var aeY = y + Math.cos(triangleEndAngle - Math.PI / 30) * (newRad + (radius - newRad) / 2);


        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, radius, startAngle, endAngle, false);
        ctx.closePath();
        ctx.fillStyle = '#fff';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, radius, startAngle, endAngle, false);
        ctx.closePath();
        ctx.fillStyle = colour;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, newRad, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fillStyle = '#fff';
        ctx.fill();
    }

    this.drawSegmentArrows = function(sector, extent) {
        var colour = phases[phases.length - sector - 1].color;
        var quadFac = Math.PI;
        var dirFac = 1;

        var newRad = radius * (extent - 1) / numCircles;
        if (useSameArea) {
            var newArea = maxArea * (extent - 1) / numCircles;
            newRad = Math.pow(newArea / Math.PI, 1/2);
        }
        var sectorCount = 7 / 4;
        var quadFac = 0;
        var startAngle = Math.PI * -0.7845 + Math.PI / (sectorCount * 2) * (quadFac * sectorCount + sector);
        var endAngle = startAngle + Math.PI / (sectorCount * 2);
        var triangleEndAngle = endAngle;
        var meX = x + Math.sin(triangleEndAngle) * newRad;
        var meY = y + Math.cos(triangleEndAngle) * newRad;
        var feX = x + Math.sin(triangleEndAngle) * radius;
        var feY = y + Math.cos(triangleEndAngle) * radius;
        var aeX = x + Math.sin(triangleEndAngle - Math.PI / 25) * (newRad + (radius - newRad) / 2);
        var aeY = y + Math.cos(triangleEndAngle - Math.PI / 25) * (newRad + (radius - newRad) / 2);

        ctx.beginPath();
        ctx.moveTo(meX, meY);
        ctx.lineTo(feX, feY);
        ctx.lineTo(aeX, aeY);
        ctx.closePath();
        ctx.fillStyle = colour;
        ctx.fill();
        // ctx.strokeStyle = "#000";
        // ctx.stroke();
    }

    this.drawSegmentLines = function() {
        ctx.beginPath();
        var counter = 0, j, quadFac, dirFac;
        for (var i = 0; i < 4; i ++) {
            quadFac = Math.PI;
            dirFac = 1;
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
            for (j = 1; j < 7; j ++, counter++) {

                if (counter % 4 == 2 )  {
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + Math.sin(quadFac * (j)  / 7) * dirFac * radius, y + Math.cos(quadFac * (j)  / 7) * dirFac * radius);
                }
            }
        }
        j = 7;
        quadFac = Math.PI / -2;
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.sin(quadFac * (j)  / 7) * dirFac * radius, y + Math.cos(quadFac * (j)  / 7) * dirFac * radius);
        ctx.closePath();
        ctx.strokeStyle = "#000";
        ctx.stroke();

    }

    this.drawCircles = function() {
        ctx.beginPath();
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
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "#444";
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
        // var angle = 45;
        ctx.fillStyle = fontColor;
        for (var j = 0; j < phases.length; j++) {
            var phase = phases[j];
            var text = phase.name.toUpperCase();
            var len = text.length, s;
            var metrics = ctx.measureText(text);
            var w = metrics.width;
            var correction = (w / radius);
            var wedgeAdjust = (7 / 2);
            var radiusCorrection = - (Math.PI / 3.85) + (correction * 0.88) ;

            ctx.save();
            ctx.translate(x, y);

            var correctedAngle = (j * Math.PI / wedgeAdjust)  - ((Math.PI / (wedgeAdjust / 2))) - radiusCorrection;
            ctx.rotate(correctedAngle);
            for (i = 0; i < len; i++) {
                // i / len
              ctx.save();
              s = text[i];
              var rotatePercent = (i / len);
              if (s == "I")
                rotatePercent += 0.03;
              ctx.rotate((rotatePercent) * correction * (Math.PI / 2));
              ctx.translate(0, -1 * radius * textRadiusProportion);
              ctx.fillText(s, 0, 0);
              ctx.restore();
            }
            ctx.restore();
        }
    }


    this.drawCompleteCircle = function() {
        // Draw segments lines
        ctx.clearRect(0, 0, width, height);
       for (var i = 0; i < phases.length; i++) {
            var phase = phases[i];
            this.drawSegment(i, numCircles);
        }

        // this.drawSegmentLines();
        this.drawCircles();
        // this.drawAxes();
        if (drawText)
            this.drawText();

       for (var i = 0; i < phases.length; i++) {
            var phase = phases[i];
            this.drawSegmentArrows(i, numCircles);
        }

    }

    this.updateCircleSegment = function(domainId, subdomainId, extent) {
        this.drawProcessCircle();
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
                    angle = (90 - angle);
                    break;
                case 1:
                    angle = (90 - angle);
                    break;
                case 2:
                    angle = 180 + (90 - angle);
                    break;
                case 3:
                    angle = 180 + (90 - angle);
                    break;
            }
            var phaseId = Math.floor((angle / 360) * (7)) % 7;
            var phaseName = phases[phaseId].description;
            callback(phaseName)
        }
    }

};
CoS.Process.prototype = Object.create(CoS.GenericCircle.prototype);



CoS.Profile = function(ctx, config) {
    config = config || {};
    config.domains = config.domains || [

        { name: 'Economics', subdomains: ["Wealth & Distribution", "Technology & Infrastructure", "Labour & Welfare", "Consumption & Use", "Accounting & Regulation", "Exchange & Transfer", "Production & Resourcing"] },

        { name: 'Ecology', subdomains: ["Materials & Energy", "Water & Air", "Flora & Fauna", "Habitat & Settlements", "Built Form & Transport", "Embodiment & Sustenance", "Emission & Waste"] },

        { name: 'Culture', subdomains: ["Identity & Engagement", "Creativity & Recreation", "Memory & Projection", "Belief & Ideas", "Gender & Generations", "Enquiry & Learning", "Wellbeing & Health"] },

        { name: 'Politics', subdomains: ["Ethics & Accountability", "Dialogue & Reconciliation", "Security & Accord", "Representation & Negotiation", "Communication & Critique", "Law & Justice", "Organization & Governance"        ] }
        ];

    CoS.GenericCircle.call( this, ctx, config );
};
CoS.Profile.prototype = Object.create(CoS.GenericCircle.prototype);


CoS.Knowledge = function(ctx, config) {
    config = config || {};
    config.numSubdomains = 4;
    config.domains = config.domains || [

        { name: 'Pragmatics', subdomains: ["Situated Knowing", "Tacit Knowing", "Intuitive Knowing", "Experiential Knowing"] },

        { name: 'Feeling', subdomains: ["Sensate Knowing", "Perceptive Knowing", "Emotional Knowing", "Revelatory Knowing"] },

        { name: 'Reflexivity', subdomains: ["Recursive Knowing", "Meta-Knowing", "Analytical Knowing II", "Theoretical Knowing II"] },

        { name: 'Reflection', subdomains: ["Theoretical Knowing I", "Analytical Knowing I", "Contemplative Knowing", "Trained Knowing"] }
        ];

    CoS.GenericCircle.call( this, ctx, config );
};
CoS.Knowledge.prototype = Object.create(CoS.GenericCircle.prototype);


CoS.Engagement = function(ctx, config) {
    config = config || {};
    // Configurable variables
    config.numSubdomains = 4;
    config.domains = config.domains || [
        { name: 'Business Organizations', subdomains: ["Non-Profit & Social Enterprises", "Co-operatives & State-Run Enterprises", "Corporations & Large Enterprises", "Small & Medium Enterprises"] },

        { name: 'Civil Society', subdomains: ["Individuals & Communities", "Community-Based & Faith-Based Organizations", "Social Movements & Networks", "Non-Government Organizations & Foundations"] },

        { name: 'Research-Based Entities', subdomains: ["Individual Researchers & Research Groups", "Research Centres & Institutes", "Universities & Colleges", "Think Tanks & Research-Based Foundations"] },

        { name: 'Governance Institutions', subdomains: ["International & Global Governance Organizations", "States & Government Organizations", "Municipal & Provincial Governments", "Elders & Councils"] }
        ];

    CoS.GenericCircle.call( this, ctx, config );
};
CoS.Engagement.prototype = Object.create(CoS.GenericCircle.prototype);


CoS.circleFactory = CoS.GenericCircle;
