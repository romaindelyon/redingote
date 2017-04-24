'use strict';

angular.module('joueurs').directive('redJoueursRecapLeft', [
	function() {
		return {
			templateUrl: 'modules/joueurs/views/joueurs-recap-left.view.html',
			restrict: 'E'
		};
	}
]);

angular.module('joueurs').directive('redJoueursRecapRight', [
	function() {
		return {
			templateUrl: 'modules/joueurs/views/joueurs-recap-right.view.html',
			restrict: 'E'
		};
	}
]);