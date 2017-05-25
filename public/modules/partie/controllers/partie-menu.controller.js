'use strict';

angular.module('partie').controller('PartieMenuController', ['$scope','$state',
	function($scope,$state) {

	$scope.goTo = function(state){
		$state.go(state);
	}

}]);