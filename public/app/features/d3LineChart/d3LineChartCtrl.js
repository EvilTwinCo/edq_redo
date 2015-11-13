var app = angular.module("theQ").controller("d3LineChartCtrl", function ($scope, $element, $interval) {
    var self = this;
    
    var firstTime = true;

    var svg = $element.find('svg');
    svg.attr("id", "chartToSelect");
    var chart = d3.select("#chartToSelect");
    //svg.attr("id", "chart");
    
    var chartSize = svg[0];
    var h = chartSize.clientHeight;
    var w = chartSize.clientWidth;
    console.log(h, w);
    
    var confidences, currentData;
    
    $scope.$watch('is.data', function () {
        console.log(firstTime);
        if (!firstTime) {
            console.log(currentData);
            confidences = chart.selectAll("line").data(currentData).exit().remove();
        } else {
            firstTime = false;
        }
        
        draw();
        console.log('updating...');
    })

    function draw() {
        var lineWidth = w/self.data.length;
        
        confidences = chart.selectAll("line")
        .data(self.data)
        .enter()
        .append("line")
        
        chart.selectAll('line')
        .attr("x1", function(d,i) {
            return i*lineWidth;
        })
        .attr("y1", function(d,i) {
            return d.confidence1;
        })
        .attr("x2", function(d,i) {
            return lineWidth*(i + 1)
        })
        .attr("y2", function(d,i) {
            return d.confidence2;
        })
        .style("stroke", "black");
        
        currentData = self.data;
    }
    
});