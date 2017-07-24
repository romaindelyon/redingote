'use strict';

angular.module('plateaux').controller('PlateauxActionCaseController', ['$scope','$http','Objets',
	function($scope,$http,Objets) {

	$scope.startActionCase = function(categorie,numero){
		$scope.actionCase.categorie = categorie;
		$scope.actionCase.numero = $scope.joueurs[$scope.joueurId].pions[0].case;
		$scope.actionCaseDisplay = {description: true};
		$scope.actionCase.phase ++;
		console.log(numero);
		if ($scope.actionCase.phase === 1){
			if (numero === 'Hub'){
				$scope.actionCase.description = "Veux-tu prendre l'avion vers le plateau-labyrinthe ?"
				$scope.bouton1 = "Oui";
				$scope.bouton2 = "Non";
				console.log('ici');
			}
		}
		else if ($scope.actionCase.phase === 2){
			if (numero === 'Hub'){
				$scope.actionCase.description = "Il te faut un passeport"
				$scope.bouton1 = "OK";
				$scope.bouton2 = "Annuler";
			}
		}
		else if ($scope.actionCase.phase === 3){
			if (numero === 'Hub'){
				$scope.okButtonDisabled = true;
				$scope.valiseNonMaterialiseeIndex = 0;
				$scope.actionCaseDisplay.description = false;
				// Valise non materialisee
				$scope.valiseNonMaterialisee = ['Orque','Eléphant'];
				$scope.actionCase.valiseNonMaterialisee = [];
				$scope.actionCase.description = "Bon voyage ! N'oublie pas de correctement préparer ta valise non-matérialisée."
				$scope.bouton1 = "OK";
				$scope.bouton2 = "";
			}
		}
		else if ($scope.actionCase.phase === 4){
			if (numero === 'Hub' && $scope.actionCase.vnmCorrect){
				$scope.actionCase.valiseNonMaterialisee = undefined;
				$scope.actionCase.description = "Tu pioches deux cartes."
				$scope.bouton1 = "OK";
				$scope.bouton2 = "";
			}
			else {
				$scope.actionCase.valiseNonMaterialisee = undefined;
				$scope.actionCase.description = "Tu perds deux cartes."
				$scope.bouton1 = "OK";
				$scope.bouton2 = "";				
			}
		}
		else if ($scope.actionCase.phase === 5){
			if (numero === 'Hub'){
				$scope.actionCase.phase = 0;
				$scope.$emit('plateaux-labyrinthe-move-pion', {case: 'Hub'});
			}
		}
	}

	$scope.actionCase = {
		phase: 0
	};
	var cases = {};
	$http({
        method: 'GET', 
        url: 'modules/plateaux/json/plateaux-paysage.json'
    }).success(function(response){
    	for (var i in response){
    		for (var j in response[i].colonnes){
    			if (cases[response[i].colonnes[j].numero] === undefined){
    				cases[response[i].colonnes[j].numero] = response[i].colonnes[j];
    			}
    		}
    	}
    	$scope.actionsCase = {
    		achat: cases[$scope.joueurs[$scope.joueurId].pions[0].case].achat,
    		action: cases[$scope.joueurs[$scope.joueurId].pions[0].case].action,
    		question: cases[$scope.joueurs[$scope.joueurId].pions[0].case].question
    	};
	 //  	if (cases[$scope.joueurs[$scope.joueurId].pions[0].case].action){
		// 	$scope.actionCase.categorie = 'action';
		// 	$scope.actionCase.numero = $scope.joueurs[$scope.joueurId].pions[0].case;
		// 	$scope.startActionCase($scope.actionCase.numero);
		// }
    });

    $scope.cancelActionCase = function(){
    	$scope.actionCase.phase = 0;
    }

    $scope.ajouteValise = function(index){
    	if ($scope.valiseNonMaterialisee.length === $scope.actionCase.valiseNonMaterialisee.length &&
    		$scope.valiseNonMaterialisee[$scope.valiseNonMaterialiseeIndex] == $scope.actionCase.valiseNonMaterialisee[$scope.valiseNonMaterialiseeIndex]){
    		$scope.actionCase.vnmCorrect = true;
    	}
    	else if ($scope.valiseNonMaterialisee[$scope.valiseNonMaterialiseeIndex] !== $scope.actionCase.valiseNonMaterialisee[$scope.valiseNonMaterialiseeIndex]) {
    		$scope.actionCase.vnmCorrect = false;
    		$scope.okButtonDisabled = false;
    	}
    	$scope.valiseNonMaterialiseeIndex ++;
    }

}]);