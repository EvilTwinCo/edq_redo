var app = angular.module("theQ").controller("chartStatsConfidenceCtrl", function (socketIoSrvc, $scope, $window, $element, confidenceSrvc, $filter) {
    var socket = socketIoSrvc.getSocket();
    var self = this;

    var filteredData = [];

    $scope.$watch('is.cohortId', function () {
        if (self.cohortId) {
            getData();
        }
    });

    function getData() {
        console.log(self.cohortId);

        confidenceSrvc.getConfidences(self.cohortId).then(function(confidences) {



            for (var i = 0; i < confidences.length; i++) {
                confidences[i].firstName = confidences[i].user.firstName;
                confidences[i].lastName = confidences[i].user.lastName;
                confidences[i].timestamp = $filter('date')(confidences[i].timestamp, 'medium');
            }

            confidences = _.uniq(confidences, false, function(item) {
                return item.firstName + item.lastName + item.cohortId + item.learningObjective;
            });

            $scope.gridOptions.api.setRowData(confidences);
            $scope.gridOptions.api.refreshView();

            updateChart(confidences);

        }, function(err) {
            console.log(err);
        });
    }

    function updateChart (data) {
        console.log(data);

        var confidenceValuesObj = {};
        data.forEach(function(item) {
            if (!confidenceValuesObj[item.learningObjective]) {
                confidenceValuesObj[item.learningObjective] = [];
            }
            confidenceValuesObj[item.learningObjective].push(item.confidence);
        });

        var confidenceValuesArray = [];
        var confidenceLabelsArray =[];
        for (var prop in confidenceValuesObj) {
            confidenceValuesArray.push(confidenceValuesObj[prop]);
            confidenceLabelsArray.push(prop);
        }
        console.log(confidenceLabelsArray);
        console.log(confidenceValuesArray);

        self.dataSet = confidenceValuesArray;
    }

    var columnDefs = [
        {headerName: "First Name", field: 'firstName', editable: false},
        {headerName: "Last Name", field: 'lastName', editable: false},
        {headerName: "Learning Objective", field: 'learningObjective', editable: false},
        {headerName: "Confidence", field: 'confidence', editable: false},
        {headerName: "Timestamp", field: 'timestamp', editable: false},
        {headerName: "CohortId", field: 'cohortId', editable: false}
    ]

    $scope.gridOptions = {
        columnDefs: columnDefs,
        enableFilter: true,
        enableSorting: true,
        rowSelection: 'single',
        enableColResize: true,
        onCellClicked: cellClicked,
        onCellValueChanged: cellChanged,
        onRowSelected: selectionChanged,
        onReady: refreshView,
        onRowDoubleClicked: rowDoubleClicked,
        onBeforeFilterChanged: beforeFilterChanged,
        onAfterFilterChanged: afterFilterChanged
    }

//    $window.onresize = function() {
//        $scope.gridOptions.columnApi.sizeColumnsToFit(100);
//    }

    function refreshView(event) {

        $scope.gridOptions.api.sizeColumnsToFit();
        console.log('Grid ready');
    }

    function cellClicked(cell) {
        //console.log('cell clicked', cell)
    }


    function cellChanged(changedObj) {
        //console.log(changedObj);
    }

    function selectionChanged(row) {
        //console.log('row selected', row);
    }

    function rowDoubleClicked(row) {
        console.log('row double clicked', row);
    }

    function beforeFilterChanged() {
        console.log('before filter changed');
        filteredData = [];
    }

    function afterFilterChanged() {
        console.log('after filter changed');
        $scope.gridOptions.api.forEachNodeAfterFilter(filteredDataAggregator);
        console.log(filteredData);
        updateChart(filteredData);
    }

    function filteredDataAggregator (node) {
        filteredData.push(node.data)
    }

});
