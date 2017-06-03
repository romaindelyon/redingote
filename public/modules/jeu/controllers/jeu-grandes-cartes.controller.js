'use strict';

angular.module('jeu').controller('JeuGrandesCartesController', ['$scope',
	function($scope) {

	$scope.grandesCartes = [
		{code: 'quart_de_singe'},
		{code: 'interlude_musical'},
		{code: 'orque_casque_anti_bruit'},
		{code: 'elephant_parapluie'},
		{code: 'crachat_de_lama'},
		{code: 'fumee_de_cigarettes'}
	];

}]);