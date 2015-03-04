var app = new angular.module('skatekrak', ['ngRoute']);

app.controlleur('HomeController', function($scope, $route, $routeParams, $location){
	$scope.$route = $route;
	$scope.$location = $location;
	$scope.$routeParams = $routeParams;
});

app.controlleur('ShotController', function($scope, $route, $routeParams, $location){
	$scope.name = 'ShotController';
	$scope.params = $routeParams;
});

app.config(function($routeProvider, $locationProvider){
	$routeProvider
	.when('/shot/:objectId',{
		templateUrl: 'shot.html',
		controller: 'ShotController'
	})
	.when('/',{
		templateUrl: 'home.html',
		controller: 'HomeController'
	});
})