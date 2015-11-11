var app = angular.module("theQ").controller("graphStudentQueueCtrl", function ($scope, $element, $interval) {
    var self = this;

    var svg = $element.find('svg');
    svg.attr("id", "chartToSelect");
    var chart = d3.select("#chartToSelect");
    svg.attr("id", "");
      
})
