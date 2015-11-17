var app = angular.module("theQ").controller("chartStatsConfidenceCtrl", function (socketIoSrvc, $scope, $window, $element, confidenceSrvc, $filter) {
    var socket = socketIoSrvc.getSocket();
    var self = this;
    var filteredData = [];
    self.showChart = 'cohort';

    $scope.$watch('is.cohortId', function () {
        if (self.cohortId) {
            getData();
        }
    });

    function getData() {
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

        var pushedYetCheckObj = {};
        var confidenceLabelsArray = [];
        var confidenceValuesArray = [];
        var confidenceIdsArray = [];
        var confidenceValuesObj = {};

        arrayLocation = 0;
        data.forEach(function (item) {
            if (!pushedYetCheckObj[item.learningObjective]) {
                pushedYetCheckObj[item.learningObjective] = arrayLocation;
                arrayLocation++;
                confidenceValuesArray.push([]);
                confidenceLabelsArray.push(item.learningObjectiveTopic);
                confidenceIdsArray.push(item.learningObjective);
            }
            confidenceValuesArray[pushedYetCheckObj[item.learningObjective]].push(item.confidence);
        });
        console.log(confidenceLabelsArray);
        console.log(confidenceValuesArray);

        self.dataSet = confidenceValuesArray;
        self.dataLabels = confidenceLabelsArray;
    }

    var columnDefs = [
        {headerName: "First Name", field: 'firstName', editable: false},
        {headerName: "Last Name", field: 'lastName', editable: false},
        {headerName: "LO Id", field: 'learningObjective', editable: false},
        {headerName: "LO Topic", field: 'learningObjectiveTopic', editable: false},
        {headerName: "LO Name", field: 'learningObjectiveName', editable: false},
        {headerName: "Confidence", field: 'confidence', editable: false},
        {headerName: "Timestamp", field: 'timestamp', editable: false},
        {headerName: "CohortId", field: 'cohortId', editable: false}
    ];

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
    };

    function refreshView(event) {

        $scope.gridOptions.api.sizeColumnsToFit();
        //console.log('Grid ready');
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
        confidenceSrvc.getUserLearningObjConfidences({
            userId: row.data.user._id,
            learningObjId: row.data.learningObjective
        }).then(function(res) {
            var datapoints = [];
            for (var i = 0; i < res.length - 1; i++) {
                datapoints.push({
                    timestamp1: res[i].timestamp,
                    confidence1: res[i].confidence,
                    timestamp2: res[i+1].timestamp,
                    confidence2: res[i+1].confidence,
                    learningObj1: res[i].learningObjective,
                    learningObj2: res[i+1].learningObjective
                });
            }
            self.graphData = datapoints;
            self.showChart = 'individual';
        }, function(err) {
            console.log(err);
        });
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
        filteredData.push(node.data);
    }
});
