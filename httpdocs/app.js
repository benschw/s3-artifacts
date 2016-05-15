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
		templateUrl: '/views/main.tpl.html',
		controller: 'HomeCtrl'
	};
	var about = {
		name: 'about',
		url: '/about',
		template: "<h2>Hello World</h2>"
	};
	$stateProvider
		.state(home)
		.state(about);
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
					return files;
				}
			});
		}
	};
}])

.controller('HomeCtrl', ['$scope', '$http', 'bucketSvc', function ($scope, $http, bucketSvc) {
	$scope['awesomeThings'] = ['AngularJS', 'Angular-Ui-Router', 'Bootstrap', 'Closure'];

	bucketSvc.getAll().then(function(data) {
		var files = [];
		for (var i=0; i<data.data.length; i++) {
			if (data.data[i].key.substring(0, 9) == 'artifacts') {
				files.push(data.data[i]);
			}
		}
		$scope.files = files
	});

}])

;
