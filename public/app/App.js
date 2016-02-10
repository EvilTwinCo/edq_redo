
var app = angular.module('theQ', ['ngRoute','ngMaterial', 'agGrid', 'ngSanitize']);

app.config(function($routeProvider, $mdThemingProvider) {
    $routeProvider
    .when("/", {template: '<login></login>'})
    .when("/login", {template: '<login></login>'})
    .when("/calendar", {template: '<calendar></calendar>'})
    .when("/studentDashboard", {template: '<student-dashboard></student-dashboard>'})
    .when("/statsDashboard", {template: '<stats-dashboard></stats-dashboard>'})
    .when("/adminDashboard", {template: '<admin-dashboard></admin-dashboard>'})
    .when("/adminControls", {template: '<admin-controls></admin-controls>'})
    .when("/instructorDashboard", {template: '<instructor-dashboard></instructor-dashboard>'})
    .when("/queueDashboard", {template: '<queue-dashboard></queue-dashboard>'})
    .when("/logout", {template: '<login></login>'})
    .otherwise({redirectTo: '/'});

    $mdThemingProvider.theme('default') .primaryPalette('pink') .accentPalette('orange');
});



 $(document).ready(function(){
   $('.dropdown-button').dropdown();
   $('.button-collapse').sideNav();
   $('.parallax').parallax();
 });

//   'default': '100',
//   'hue-1': '300',
//   'hue-2': '600',
//   'hue-3': '900'
// })
// .backgroundPalette('blue', {
//   'default': '50',
//   'hue-1': '100',
//   'hue-2': '600',
//   'hue-3': 'A100'
// })
// .accentPalette('black', {
//   'default': '300',
//   'hue-1': '100',
//   'hue-2': '600',
//   'hue-3': 'A100'
// });
