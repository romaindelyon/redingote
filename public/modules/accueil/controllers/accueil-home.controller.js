'use strict';


angular.module('accueil').controller('HomeController', ['$scope','$sessionStorage','$location','$auth',
	function($scope,$sessionStorage,$location,$auth) {

		$scope.$storage = $sessionStorage.$default({
			me: [],
			clinicInfo : {},
			medications : [],
			api: {},
			buildWebNumber: ''
		});
		$scope.authentication = function () {
			return $auth.isAuthenticated();
		};
		if(!$scope.authentication){
			$location.path('/signin');
		}

	}
]);
