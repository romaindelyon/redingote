'use strict';

angular.module('actions').controller('ActionsTroisFamillesController', ['$scope','$rootScope','$http','$timeout','Partie','Joueurs','Cartes','Objets','Actions','Questions',
	function($scope,$rootScope,$http,$timeout,Partie,Joueurs,Cartes,Objets,Actions,Questions) {
		
	// Utility functions
	
	$scope.changeFamille = function(increment){
		$scope.familleDisplay = ($scope.familleDisplay + increment + 3)%3;
		$scope.action.troisFamilles.membre = -1;
	}
		
	// Initialization

	$scope.familleDisplay = 0;

	$scope.familles = [
		{
			code: 'cabines_telephoniques',
			nom: 'Cabines téléphoniques',
			membres: [
				{code: 'zegylxaontwixneg',nom: 'Zegylxaontwixneg'},
				{code: 'vrougemillon',nom: 'Vrougemillon'},
				{code: 'william',nom: 'William'},
				{code: 'wanhoutenne',nom: 'Wanhoutenne'},
				{code: 'wouguette',nom: 'Wouguette'}
			],
			description: "Apporte ces cartes à la maison de Marion (case 75)",
			caseRecompense: "75"
		},
		{
			code: 'conducteurs_de_bus',
			nom: 'Conducteurs de bus',
			membres: [
				{code: 'c3po',nom: 'C3PO'},
				{code: "l_ahuri",nom: "L'Ahuri"},
				{code: 'le_crochu',nom: 'Le Crochu'},
				{code: 'wanhoutenne',nom: 'Wanhoutenne'},
				{code: 'wouguette',nom: 'Wouguette'}
			],
			description: "Apporte ces cartes à l'arbre de la Punie (case 200EDR91)",
			caseRecompense: "200EDR91"
		},
		{
			code: 'jeux_de_tarot',
			nom: 'Jeux de tarot',
			membres: [
				{code: 'tarot_cuisine',nom: 'Tarot cuisiné'},
				{code: 'tarot_des_fleurs',nom: 'Tarot des fleurs'},
				{code: 'tarot_d_anniversaire',nom: "Tarot d'anniversaire"},
				{code: 'wanhoutenne',nom: 'Wanhoutenne'},
				{code: 'wouguette',nom: 'Wouguette'}
			],
			description: "Apporte ces cartes à la maison de Romain (case 103)",
			caseRecompense: "103"
		}];
		
		for (var j = 0;j < $scope.familles.length;j ++){
			for (var i = 0;i < $scope.jeu.main.length;i ++){
				for (var k = 0;k < $scope.familles[j].membres.length;k ++){
					if ($scope.familles[j].membres[k].code === $scope.jeu.main[i].code){
						$scope.familles[j].membres[k].completed = true;
						$scope.familles[j].membres[k].carteId = $scope.jeu.main[i].id;
						console.log("code found");
					}
				}
			}
			var familleComplete = true;
			for (var k = 0;k < $scope.familles[j].membres.length;k ++){
				console.log($scope.familles[j].membres[k].completed);
				familleComplete = familleComplete && $scope.familles[j].membres[k].completed;
			}
			if (familleComplete){
				$scope.familles[j].statut = 'ready';
				console.log("on est ready");
				for (var p = 0;p < $scope.joueurs[$scope.joueurId].pions.length;p ++){
					console.log($scope.joueurs[$scope.joueurId].pions[p].plateau);
					console.log($scope.joueurs[$scope.joueurId].pions[p].case.toString());
					if ($scope.joueurs[$scope.joueurId].pions[p].plateau === 'paysage' && $scope.joueurs[$scope.joueurId].pions[p].case.toString() === $scope.familles[j].caseRecompense){
						$scope.familles[j].statut = 'completed';
						console.log("on est completed");
					}
				}
			}
		}
		
		$scope.appelTroisFamilles = function(joueurId,famille,membre){
			for (var i = 0;i < $scope.joueurs[joueurId].main.length;i ++){
				if ($scope.joueurs[joueurId].main[i].code === $scope.familles[famille].membres[membre].code){
					$scope.action.troisFamilles.info.gains.push({carte: $scope.joueurs[joueurId].main[i]});
					$scope.action.troisFamilles.appel = 'succes';
				}
			}
		}
		
		$scope.completerFamille = function(famille){
			var carteIds = [];
			for (var i = 0;i < $scope.familles[famille].membres.length;i ++){
				carteIds.push($scope.familles[famille].membres[i].carteId);
			}
			Cartes.moveCartes({
	    		carteIds: carteIds,
	    		position: -2
	    	}).success(function(){
	    		for (var j = $scope.jeu.main.length - 1;j >= 0;j --){
	    			console.log($scope.jeu.main[j].id);
	    			if (carteIds.indexOf($scope.jeu.main[j].id) >= 0){
			    		var carte = $scope.jeu.main[j];
			    		carte.statut = {};
						$scope.defausses.pioche.push(carte);
						$scope.jeu.main.splice(j,1);
	    			}
	    		}
	    		var consequences = [{
	    			categorie: 'grande_carte',
	    			type: 'pioche',
	    			valeur: 2
	    		}];
	    		$scope.$emit('consequence-start',{consequences: consequences,type: 'recompense'});
	    		$scope.cancelAction();
	    		console.log("recompense emitted");
	    	}).error(function(){
	    		console.log("error de défaussage");
	    	});
		}

		if ($scope.actions.troisFamilles.length > 0){
			$scope.action.troisFamilles = $scope.actions.troisFamilles[0];
			$scope.action.troisFamilles.appel = 'pending';
			if ($scope.action.troisFamilles.gains == undefined){
				$scope.action.troisFamilles.gains = [];
			}
			$scope.action.troisFamilles.joueur = -1;
			$scope.action.troisFamilles.membre = -1;
			$scope.action.troisFamilles.type = 'appel';
		}
		else {
			$scope.action.troisFamilles = {type: "read-only"};
		}

	//,'conducteurs_de_bus','jeux_de_tarot'];

}]);