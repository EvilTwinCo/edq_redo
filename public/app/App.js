
var app = angular.module('theQ', ['ngRoute','ngMaterial', 'agGrid']);

app.config(function($routeProvider, $mdThemingProvider) {
    $routeProvider
    .when("/", {template: '<login-Page></login-Page>'})
    .when("/login", {template: '<login></login'})
    .when("/calendar", {template: '<calendar></calendar>'})
    .when("/studentDashboard", {template: '<student-dashboard></student-dashboard>'})
    .when("/statsDashboard", {template: '<stats-dashboard></stats-dashboard>'})
    .when("/adminDashboard", {template: '<admin-dashboard></admin-dashboard>'})
    .when("/logout", {template: '<logout></logout>'})
    .otherwise({redirectTo: '/'})

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
