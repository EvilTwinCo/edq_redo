var app = angular.module("theQ").controller("d3LineChartCtrl", function ($scope, $element, $interval) {
    var self = this;
    var firstTime = true;
    var confidences, currentData;
    var leftEdgeMargin = 25;
    var bottomEdgeMargin = 25;

    var svg = $element.find('svg');
    svg.attr("id", "chartToSelect");
    var chart = d3.select("#chartToSelect");
    var chartSize = svg[0];
    var h = chartSize.clientHeight;
    var w = chartSize.clientWidth;

    var yScale = d3.scale.linear()
        .domain([0, 100])
        .range([h-bottomEdgeMargin, 10])
    
    var yAxis = d3.svg.axis()
        .orient("left")
        .outerTickSize(1)
    
    var xAxis = d3.svg.axis()
        .orient("bottom")
        .outerTickSize(1)
    
    $scope.$watch('is.data', function () {
        draw();
    })

    function draw() {
        var lineWidth = w/self.data.length;
        
        var xLabels = _.pluck(self.data, 'timestamp1');
        xLabels.push(self.data[self.data.length - 1].timestamp2);
        //console.log(xLabels);
        
        var timeScale = d3.time.scale()
            .domain([new Date(xLabels[0]), new Date(xLabels[xLabels.length - 1])])
            .range([w-10, leftEdgeMargin])
        
        //console.log(firstTime);
        if (!firstTime) {
            //console.log(currentData.length , self.data.length);
            chart.selectAll("line")
                .remove()
        } else firstTime = false;
        
        //console.log(self.data.length);
        chart.selectAll("line")
            .data(self.data)
            .enter()
            .append("line")
        
        chart.selectAll('line')
        .attr("x1", function(d,i) {
            //console.log(new Date (d.timestamp1) + '__' + d.confidence1 + '||' + d.learningObj1 + '&&' + new Date (d.timestamp2) + '__' + d.confidence2 + '||' + d.learningObj2);
            return timeScale(new Date (d.timestamp1));
        })
        .attr("y1", function(d,i) {
            return yScale(d.confidence1);
        })
        .attr("x2", function(d,i) {
            //console.log(new Date (d.timestamp2));
            return timeScale(new Date (d.timestamp2));
        })
        .attr("y2", function(d,i) {
            return yScale(d.confidence2);
        })
        .style("stroke", "blue")
         
        yAxis.scale(yScale);
        xAxis.scale(timeScale);
        
        chart.selectAll('g')
            .remove()
        
        chart.append('g')
            .attr('transform', 'translate(' + (leftEdgeMargin) + ',0)')
            .attr("font-size", "10px")
            .attr('class', 'axis')
            .call(yAxis)
        
        chart.append('g')
            .attr('transform', 'translate(0,' + (h-bottomEdgeMargin) + ')')
            .attr("font-size", "10px")
            .attr('class', 'axis')
            .call(xAxis)
        
        chart.selectAll('.axis')
            .attr('shape-rendering', 'crispEdges')

        chart.selectAll('.axis line')
            .attr('stroke', 'black')
        
        currentData = self.data;
    
    }
    
});