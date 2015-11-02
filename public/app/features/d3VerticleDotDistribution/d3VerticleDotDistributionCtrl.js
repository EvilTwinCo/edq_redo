var app = angular.module("theQ");

app.controller("d3VerticleDotDistributionCtrl", function($scope){

  $scope.$watch('data', function(){
    draw();
  })


  function draw(){
    var chartSize = $scope.svg[0];
    var h = chartSize.clientHeight;
    var w = chartSize.clientWidth;


    var chart = $scope.chart;

    var r = 2;


    var students = chart.selectAll("cirlce")
                        .data($scope.data)
                        .enter()
                        .append("circle")
                        .attr("cx", 25)
                        .attr("cy", 50)
                        .attr("r", 1);

        students = chart.selectAll("circle")
                        .data($scope.data);
    var studentCount = $scope.data.length;
    students.transition().duration(1000).attr("cx", function(d, index){

      return (20-2*r) * index/studentCount+r;
    })
    .attr("cy", function(d, index){
      //console.log(d);

      return (100-2*r)*(100-d)/100 + r;
    })
    .attr("r", function(d, index){
      return r;
    })

  }

});
