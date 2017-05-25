'use strict';

angular.module('cartes').directive('redCartesCreationConsequences', [
	function() {
		return {
			templateUrl: 'modules/cartes/views/red-cartes-creation-consequences.view.html',
			restrict: 'E',
		    scope: {
		      carte:"="
		    }
		};
	}
]);

angular.module('cartes').directive('redCartesCreationContraintes', [
	function() {
		return {
			templateUrl: 'modules/cartes/views/red-cartes-creation-contraintes.view.html',
			restrict: 'E',
		    scope: {
		      carte:"="
		    }
		};
	}
]);

angular.module('cartes').directive('redCartesCreationCirconstances', [
	function() {
		return {
			templateUrl: 'modules/cartes/views/red-cartes-creation-circonstances.view.html',
			restrict: 'E',
		    scope: {
		      carte:"="
		    }
		};
	}
]);