'use strict';

angular.module('joueurs').directive('redJoueursRecap', ['$parse',
	function($parse) {
		return {
			templateUrl: 'modules/joueurs/views/joueurs-recap.view.html',
			restrict: 'E',
		    scope: true,
		    link: function(scope, element, attrs) {
		       scope.joueurJeuIndex = attrs.joueur;
		    }
		};
	}
]);