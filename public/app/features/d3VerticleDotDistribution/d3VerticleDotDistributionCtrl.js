var app = angular.module("theQ").controller("d3VerticleDotDistributionCtrl", function ($scope, $element, $interval) {
    var self = this;

    self.svg = $element.find('svg');
    self.svg.attr("id", "chartToSelect");
    self.chart = d3.select("#chartToSelect");
    self.svg.attr("id", "chart");

    $scope.$watch('is.data', function () {
        draw();
    });

    var RedYellowInterpolater = d3.interpolateRgb("red", "gold");
    var YellowGreenInterpolater = d3.interpolateRgb("gold", "green");

    function draw() {
        var chartSize = self.svg[0];
        var h = chartSize.clientHeight;
        var w = chartSize.clientWidth;

        var chart = self.chart;

        var r = 1.5;

        var students = chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", 25)
            .attr("cy", 50)
            .attr("r", 1);

        students = chart.selectAll("circle")
            .data(self.data);
        var studentCount = self.data.length;
        students.transition().duration(1000)
            .attr("cx", function (d, index) {
                return (20 - 2 * r) * (index + 1) / (studentCount + 1) + r;
            })
            .attr("cy", function (d, index) {
                return (100 - 2 * r) * (100 - d) / 100 + r;
            })
            .attr("r", function (d, index) {
                return r;
            })
            .attr("title", function (d, index) {
                return index + ":" + "d";
            })
            .style("fill", function (d, index) {
                if (d < 50) {
                    return RedYellowInterpolater(d / 50);
                }
                return YellowGreenInterpolater((d - 50) / 50);
            });
    }

    //$interval(draw,5000);

});
