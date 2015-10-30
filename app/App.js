var app = angular.module('theQ', ['ngRoute','ngMaterial'])
.config(function($routeProvider, $mdThemingProvider){




  $routeProvider
    .when('/home', {

    })

    .otherwise({
      redirectTo: '/home'
    }),



  $mdThemingProvider.theme('default')
              .primaryPalette('pink', {
                'default': '100',
                'hue-1': '300',
                'hue-2': '600',
                'hue-3': '900'
              })
              .backgroundPalette('blue-grey', {
                'default': '50',
                'hue-1': '100',
                'hue-2': '600',
                'hue-3': 'A100'
              })
              .accentPalette('black', {
                'default': '300',
                'hue-1': '100',
                'hue-2': '600',
                'hue-3': 'A100'
              });


});
