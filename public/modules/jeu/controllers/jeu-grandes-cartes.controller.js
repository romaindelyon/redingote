'use strict';

angular.module('jeu').controller('JeuGrandesCartesController', ['$scope','$rootScope',
	function($scope,$rootScope) {

	$scope.grandesCartes = [
		{code: 'grande_carte_marion_souris',piocheCode: 'grande_carte_pioche_marion_souris'},
		{code: 'grande_carte_piano',piocheCode: 'grande_carte_pioche_piano'},
		{code: 'grande_carte_gateaux',piocheCode: 'grande_carte_pioche_gateaux'},
		{code: 'grande_carte_freres',piocheCode: 'grande_carte_pioche_freres'},
		{code: 'grande_carte_patinage',piocheCode: 'grande_carte_pioche_patinage'},
		{code: 'grande_carte_katie',piocheCode: 'grande_carte_pioche_katie'}
	];

	function initializeGrandesCartes(){
		for (var i = 0;i < $scope.jeu.grandesCartes.length;i ++){
			for (var j = 0;j < $scope.grandesCartes.length;j ++){
				if ($scope.jeu.grandesCartes[i].code === $scope.grandesCartes[j].code || $scope.jeu.grandesCartes[i].code === $scope.grandesCartes[j].piocheCode){
					$scope.grandesCartes[j].completed = true;
				}
			}
		}
	}
	
	initializeGrandesCartes();

	$rootScope.$on('grandes-cartes-initialize',function(event,args){
		initializeGrandesCartes();
	});

}]);