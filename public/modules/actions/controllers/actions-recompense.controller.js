'use strict';

angular.module('actions').controller('ActionsRecompenseController', ['$scope','$rootScope','$http','$timeout','Partie','Joueurs','Cartes','Objets','Actions','Questions',
	function($scope,$rootScope,$http,$timeout,Partie,Joueurs,Cartes,Objets,Actions,Questions) {

	console.log("starting this");
	$scope.action.phase = 1;
	$scope.action.recompense = $scope.actions.recompense[0];  
	console.log($scope.action.recompense);
	$scope.action.grandesCartes = [
		{code: 'grande_carte_marion_souris',piocheCode: 'grande_carte_pioche_marion_souris'},
		{code: 'grande_carte_piano',piocheCode: 'grande_carte_pioche_piano'},
		{code: 'grande_carte_gateaux',piocheCode: 'grande_carte_pioche_gateaux'},
		{code: 'grande_carte_freres',piocheCode: 'grande_carte_pioche_freres'},
		{code: 'grande_carte_patinage',piocheCode: 'grande_carte_pioche_patinage'},
		{code: 'grande_carte_katie',piocheCode: 'grande_carte_pioche_katie'}
	];

	for (var i = 0;i < $scope.action.grandesCartes.length;i ++){
		$scope.action.grandesCartes[i].quantity = 0;
		for (var j = 0;j < $scope.jeu.grandesCartes.length;j ++){
			if ($scope.jeu.grandesCartes[j].code === $scope.action.grandesCartes[i].code || $scope.jeu.grandesCartes[j].code === $scope.action.grandesCartes[i].piocheCode){
				$scope.action.grandesCartes[i].completed = true;
			}
		}
		for (var j = 0;j < $scope.pioches.horsPioche.length;j ++){
			if ($scope.pioches.horsPioche[j].code === $scope.action.grandesCartes[i].code && $scope.pioches.horsPioche[j].position == -1){
				$scope.action.grandesCartes[i].quantity ++;
				$scope.action.grandesCartes[i].id = $scope.pioches.horsPioche[j].id;
			}
		}
	}  	
	console.log($scope.action.grandesCartes);

    $scope.getGrandeCarte = function(carteId,carteIndex){
    	console.log(carteId);
    	if ($scope.action.recompense.valeur > 0){
			$scope.action.grandesCartes[carteIndex].completed = true;
	    	Cartes.moveCartes({
	    		carteIds: [carteId],
	    		position: -1
	    	}).success(function(){
	    		for (var j = 0;j < $scope.pioches.horsPioche.length;j ++){
	    			if ($scope.pioches.horsPioche[j].id === carteId){
	    				$scope.jeu.grandesCartes.push($scope.pioches.horsPioche[j]);
	    				$scope.pioches.horsPioche.splice(j,1);
	    			}
	    		}
	    		$scope.action.recompense.valeur --;
	    		$scope.$emit('grandes-cartes-initialize',{});
	    		if ($scope.action.recompense.valeur === 0){
	    			$timeout(function(){
	    				$scope.cancelAction();
	    				$scope.partie.dispo.tourDeJeu.recompense[1] --;
	    			},500);
	    		}
	    	}).error(function(){
	    		console.log("error de transfert de grande carte");
	    	});
    	}
    };

}]);