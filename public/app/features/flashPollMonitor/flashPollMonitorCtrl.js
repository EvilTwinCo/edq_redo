var app = angular.module("theQ").controller("flashPollMonitorCtrl", function($element){
    
    $element[0].width = 500;
    $element[0].height = 500;
    
    var dataSet = [1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3];
    //var dataSet = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
    //var dataSet = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 2, 2, 3, 3, 3];
    //var dataSet = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
    
    var aCount = dataSet.filter(function(item) {return (item === 1 ? true : false)}).length;
    var bCount = dataSet.filter(function(item) {return (item === 2 ? true : false)}).length;
    var cCount = dataSet.filter(function(item) {return (item === 3 ? true : false)}).length;
    
    var resultSet = [aCount, bCount, cCount];
    
    console.log(resultSet);
    
    var h = $element[0].height;
    var w = $element[0].width;
    var xPadding = w*.1;
    var maxResult = d3.max(resultSet);
    
    var yScale = d3.scale.linear()
        .domain([0, dataSet.length])
        .range([0, h])
    
    var chart = d3.select('#svgChart')
        .attr("width", w + "%")
        .attr("height", h)
        .style({
            "border-bottom": "1px solid black"
        });
    
    var dataBars = chart.selectAll('rect')
        .data(resultSet)
        .enter()
        .append('rect')
        .attr({
            "x": function (d, i) {
                return (xPadding/2 + i*(w/resultSet.length));
            },
            "y": function (d) {
                return (h - yScale(d));
            },
            "width": function(d) {
                return (w/resultSet.length-xPadding);
            },
            "height": function(d) {
                return yScale(d);
            }
        })
        .style({
            "fill": function (d) {
                return d3.rgb(0, (d/dataSet.length)*255, 0);
            }
        })
    
    var labels = chart.selectAll('text')
        .data(resultSet)
        .enter()
        .append('text')
        .text(function(d) {
            return d;
        })
        .attr({
            "x": function (d, i) {
                return (xPadding/2 + i*(w/resultSet.length) + (w/resultSet.length-xPadding)/2);
            },
            "y": function (d) {
                if (d > .8*dataSet.length) return (h - yScale(d) + 40);
                else return (h - yScale(d) - 10);
            },
            "font-family": "sans-serif",
            "font-size": "40px",
            "text-anchor": "middle"
        })
        .style({
            "fill": function (d) {
                /*if (d > .8*dataSet.length) return "white";
                else return "black"*/
                return "black"
            }
        });
});
    
    
    