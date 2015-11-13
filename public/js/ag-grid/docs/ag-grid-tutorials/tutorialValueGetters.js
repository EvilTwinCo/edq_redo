
(function() {

    document.addEventListener('DOMContentLoaded', function() {

        var gridDiv = document.querySelector('#myGrid');

        var selectedMonth = 0;

        var gridOptions = {
            columnDefs: [
                {headerName: 'Country', field: 'country'},
                {headerName: 'City', field: 'city'},
                {headerName: 'Jan', field: 'jan', monthIndex: 0, valueGetter: monthValueGetter},
                {headerName: 'Feb', field: 'feb', monthIndex: 1, valueGetter: monthValueGetter},
                {headerName: 'Mar', field: 'mar', monthIndex: 2, valueGetter: monthValueGetter},
                {headerName: 'Apr', field: 'apr', monthIndex: 3, valueGetter: monthValueGetter},
                {headerName: 'May', field: 'may', monthIndex: 4, valueGetter: monthValueGetter},
                {headerName: 'YTD Act', valueGetter: function(params) {
                    var total = 0;
                    if (selectedMonth>=0) {total += params.data.jan_act;}
                    if (selectedMonth>=1) {total += params.data.feb_act;}
                    if (selectedMonth>=2) {total += params.data.mar_act;}
                    if (selectedMonth>=3) {total += params.data.apr_act;}
                    if (selectedMonth>=4) {total += params.data.may_act;}
                    return total;
                }}
            ]
        };

        function monthValueGetter(params) {
            if (selectedMonth<params.colDef.monthIndex) {
                return params.data[params.colDef.field + '_bud'];
            } else {
                return params.data[params.colDef.field + '_act'];
            }
        }

        new ag.grid.Grid(gridDiv, gridOptions);

        jsonLoad( function(data) {
            gridOptions.api.setRowData(data);
            gridOptions.api.sizeColumnsToFit();
        });

        document.querySelector('#btMonthDown').addEventListener('click', function() {
            selectedMonth--;
            gridOptions.api.refreshView();
        });
        document.querySelector('#btMonthUp').addEventListener('click', function() {
            selectedMonth++;
            gridOptions.api.refreshView();
        });
    });

})();


function jsonLoad(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../sample-data/monthlySales.json'); // by default async
    xhr.responseType = 'json'; // in which format you expect the response to be

    xhr.onload = function() {
        if(this.status == 200) {// onload called even on 404 etc so check the status
            callback(this.response);
        }
    };

    xhr.onerror = function() {
        console.log('loading data error');
    };

    xhr.send();
}