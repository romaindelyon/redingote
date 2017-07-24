'use strict';

angular.module('core').controller('CoreMenuController', ['$scope','$state',
	function($scope,$state) {

	$scope.goTo = function(state){
		$state.go(state);
	}

}]);