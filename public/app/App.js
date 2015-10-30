var app = angular.module('theQ', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {template: '<login></login'})
    .when("/calendar", {template: '<calendar></calendar>'})
    .when("/studentDashboard", {template: '<student-dashboard></student-dashboard>'})
    .when("/adminDashboard", {template: '<admin-dashboard></admin-dashboard>'})
    .when("/logout", {template: '<logout></logout>'})
    .otherwise({redirectTo: '/'})
});