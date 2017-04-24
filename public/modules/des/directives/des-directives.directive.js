'use strict';

angular.module('des').directive('redDesContainer', [
	function() {
		return {
			templateUrl: 'modules/des/views/des-container.view.html',
			restrict: 'E'
		};
	}
]);