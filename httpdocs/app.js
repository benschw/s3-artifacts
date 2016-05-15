'use strict';




angular.module('s3art', [
	'ui.router'
])

.constant('appConfig', {
	awsEndpoint: 'http://dl.fligl.io.s3.amazonaws.com'
})

.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/');
	
	var home = {
		name: 'home',
		url: '/',
		templateUrl: '/main.tpl.html',
		controller: 'HomeCtrl'
	};
	var project = {
		name: 'about',
		url: '/:project',
		templateUrl: '/project.tpl.html',
		controller: 'ProjectCtrl'
	};

	$stateProvider
		.state(home)
		.state(project);
}])
.run(['$rootScope', '$state', '$stateParams', function ($rootScope,   $state,   $stateParams) {
	$rootScope.$state       = $state;
	$rootScope.$stateParams = $stateParams;
}])

.factory('bucketSvc', ['$http', 'appConfig', function($http, appConfig) {
	return {
		'getAll' : function() {
			return $http({
				method: "get",
				url: appConfig.awsEndpoint,
				transformResponse : function(response) {
					var data = $.parseXML(response);

					var host = $(data).find('Name')[0].firstChild.data;
					var urlBase = 'http://' + host + '/';

					var nodes = $(data).find('Contents');
					
					var files = [];
					for (var i=0; i<nodes.length; i++) {
						var key = $(nodes[i]).find('Key')[0].firstChild.data;
						
						files.push({
							'key': key,
							'url': urlBase + key,
							'lastModified': $(nodes[i]).find('LastModified')[0].firstChild.data,
							'size': $(nodes[i]).find('Size')[0].firstChild.data,
						});
					}

					files.sort(function(a,b) {
						return (a.key > b.key) ? 1 : ((b.key > a.key) ? -1 : 0);
					});

					return files;
				}
			});
		}
	};
}])

.controller('HomeCtrl', ['$scope', 'bucketSvc', function ($scope, bucketSvc) {

	bucketSvc.getAll().then(function(data) {
		var keys = [];
		for (var i=0; i<data.data.length; i++) {
			if (data.data[i].key.substring(0, 9) == 'artifacts') {
				var parts = data.data[i].key.split('/');
				keys.push(parts[1]);
			}
		}
		$scope.keys = $.unique(keys);
		console.log($scope.keys);
	});

}])

.controller('ProjectCtrl', ['$scope', '$stateParams', 'bucketSvc', function ($scope, $stateParams, bucketSvc) {
	$scope.project = $stateParams.project;
	bucketSvc.getAll().then(function(data) {
		var files = [];
		for (var i=0; i<data.data.length; i++) {
			if (data.data[i].key.substring(0, 9) == 'artifacts') {
				var parts = data.data[i].key.split('/');
				if (parts[1] == $scope.project) {
					files.push(data.data[i]);
				}
			}
		}
		$scope.files = files
	});

}])

;
