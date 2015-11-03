var app = angular.module("theQ").controller("flashPollMonitorCtrl", function(){

    var dataSet = [1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3];
    
    var h = 500;
    var w = 500;
    
    var chart = d3.select('#svgChart');
    
    chart.attr("width", w);
    chart.attr("height", h);
    
    // This still needs finished!!!
    
});
    
    
    