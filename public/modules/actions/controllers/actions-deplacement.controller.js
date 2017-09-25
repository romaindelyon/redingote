'use strict';

angular.module('actions').controller('ActionsDeplacementController', ['$scope','$rootScope','$http','$timeout','Partie','Joueurs','Cartes','Objets','Actions','Questions',
	function($scope,$rootScope,$http,$timeout,Partie,Joueurs,Cartes,Objets,Actions,Questions) {

	function startDeplacement(){
		if ($scope.action.deplacement.type === 'paysage'){
			console.log("paysage");
			if ($scope.action.deplacement.info.depart == undefined){
				$scope.action.deplacement.info.depart = $scope.joueurs[$scope.joueurId].pions[0].case;
				$scope.action.deplacement.info.bonus = [];
			}
			if ($scope.action.deplacement.info.deResult == undefined){
				$scope.partie.dispo.des.paysage = 1;
				console.log("allowing dé");
			}
			else if ($scope.action.deplacement.info.direction == undefined){
				$scope.$emit('plateaux-paysage-rose-ready',{});
			}
			else {
				$scope.action.deplacement.info.actionsRestantes = $scope.action.deplacement.info.deResult + 1;
				$scope.$emit('plateaux-paysage-deplacement-ready',{deResult: $scope.action.deplacement.info.deResult});
			}
		}
		else if ($scope.action.deplacement.type === 'labyrinthe'){
			$scope.action.deplacement.info.etapes = [];
			$scope.partie.dispo.des.labyrinthe = 4;
		}
	}

	$rootScope.$on('plateaux-paysage-de',function(event,args){
		$scope.action.deplacement.info.deResult = args.result;
		for (var j = 0;j < $scope.action.deplacement.info.bonus.length;j ++){
			if ($scope.action.deplacement.info.bonus[j].pile === 'hors_pioche'){
				var carte = $scope.action.deplacement.info.bonus[j];
			}
			else if ($scope.action.deplacement.info.bonus[j].utilisation[0] === 'ouverture'){
				var carte = $scope.objets[$scope.action.deplacement.info.bonus[j].info[0]];
			}
			else if ($scope.action.deplacement.info.bonus[j].utilisation[1] === 'ouverture'){
				var carte = $scope.objets[$scope.action.deplacement.info.bonus[j].info[1]];
			}
			for (var i = 0;i < carte.info.consequences.length;i ++){
				var consequence = carte.info.consequences[i];
				if (consequence.categorie === 'deplacement' && consequence.type === 'avantage' && consequence.valeur === 'vitesse_doublee'){
					console.log("on double le déplacement");
					if ($scope.action.deplacement.info.deResult != undefined && $scope.action.deplacement.info.deResult !== 146){
						$scope.action.deplacement.info.deResult *= 2;
					}
				}
			}
		}
		Actions.update({info: $scope.action.deplacement.info}).success(function(){
			$scope.$emit('plateaux-paysage-rose-ready',{});
		}).error(function(){
			console.log("Erreur d'update de notification d'humeur");
		});
	});

	$rootScope.$on('plateaux-paysage-direction',function(event,args){
		var direction = args.direction;
		if (direction === 'bas_gauche' || direction === 'bas_droite' || direction === 'haut_gauche' || direction === 'haut_droite'){
			direction = 'libre';
		}
		$scope.action.deplacement.info.direction = direction;
		Actions.update({info: $scope.action.deplacement.info}).success(function(){
			$scope.action.deplacement.info.actionsRestantes = $scope.action.deplacement.info.deResult + 1;
			$scope.$emit('plateaux-paysage-deplacement-ready',{deResult: $scope.action.deplacement.info.deResult});
		}).error(function(){
			console.log("Erreur d'update de notification d'humeur");
		});
	});

	$scope.terminerDeplacement = function(){
		var arrivee = $scope.action.deplacement.info.deplacement[$scope.action.deplacement.info.deplacement.length - 1];
		$scope.action.deplacement.info.arrivee = arrivee;
		$scope.$emit('plateaux-paysage-deplacement-over',{deResult: $scope.action.deplacement.info.deResult});
		if ($scope.action.deplacement.info.arrivee.case.zones.length > 1){
			$scope.action.deplacement.choixZone = true;
		}
		else {
			$scope.action.deplacement.info.zone = $scope.action.deplacement.info.arrivee.case.zoneKey[0];
			$scope.action.deplacement.fini = true;
		}
	}

	$scope.choixZone = function(zone){
		$scope.action.deplacement.info.zone = zone;
		$scope.action.deplacement.fini = true;
	} 

	$scope.validerDeplacement = function(){
		if ($scope.action.deplacement.type === 'paysage'){
			// Move pion
			$scope.$emit('plateaux-move-pion',{
				case: $scope.action.deplacement.info.arrivee.numero,
				plateau: 'paysage',
				zone: $scope.action.deplacement.info.zone,
				row: $scope.action.deplacement.info.arrivee.row,
				colonne: $scope.action.deplacement.info.arrivee.colonne,
				position: $scope.action.deplacement.info.arrivee.position
			});
			// Effacer les données de déplacement et relancer la rose des vents
			$scope.$emit('plateaux-paysage-deplacement-erase',{});
		}
		// Consommer les cartes :
		var cartesBonus = [];
		var cartesHorsPiocheBonus = [];
		console.log($scope.action.deplacement.info.bonus);
		for (var i = 0;i < $scope.action.deplacement.info.bonus.length;i ++){
			if (!$scope.action.deplacement.info.bonus[i].statut.ouverte){
				console.log($scope.action.deplacement.info.bonus[i]);
				if ($scope.action.deplacement.info.bonus[i].pile === 'pioche'){
					cartesBonus.push($scope.action.deplacement.info.bonus[i].id);
				}
				else if ($scope.action.deplacement.info.bonus[i].pile === 'hors_pioche'){
					cartesHorsPiocheBonus.push($scope.action.deplacement.info.bonus[i].id);
				}
			}
		}
		console.log(cartesBonus);
		console.log(cartesHorsPiocheBonus);
		if (cartesBonus.length > 0){
			Cartes.moveCartes({
	    		carteIds: cartesBonus,
	    		position: -2
	    	}).success(function(){
	    		for (var j = 0;j < $scope.jeu.main.length;j ++){
	    			console.log($scope.jeu.main[j].id);
	    			if (cartesBonus.indexOf($scope.jeu.main[j].id) >= 0){
			    		var carte = $scope.jeu.main[j];
			    		carte.statut = {};
						$scope.defausses.pioche.push(carte);
						$scope.jeu.main.splice(j,1);
	    			}
	    		}
	    	}).error(function(){
	    		console.log("error de défaussage");
	    	});
		}
		if (cartesHorsPiocheBonus.length > 0){
	    	Cartes.moveCartes({
	    		carteIds: cartesHorsPiocheBonus,
	    		position: -1
	    	}).success(function(){
	    		for (var j = 0;j < $scope.jeu.horsPioche.length;j ++){
	    			console.log($scope.jeu.horsPioche[j].id);
	    			if (cartesHorsPiocheBonus.indexOf($scope.jeu.horsPioche[j].id) >= 0){
			    		var carte = $scope.jeu.horsPioche[j];
			    		carte.statut = {};
						$scope.pioches.horsPioche.push(carte);
						$scope.jeu.horsPioche.splice(j,1);
	    			}
	    		}
	    	}).error(function(){
	    		console.log("error de défaussage");
	    	});
		}
		// Retirer l'action
		$scope.cancelAction();
	}

	$rootScope.$on('plateaux-paysage-deplacement',function(event,args){
		$scope.action.deplacement.info.actionsRestantes --;
		$scope.action.deplacement.info.deplacement = args.deplacement;
		if ($scope.action.deplacement.info.actionsRestantes === 0){
			$scope.terminerDeplacement();
		}
	});

	$scope.recommencerDeplacement = function(){
		$scope.action.deplacement.info.actionsRestantes = $scope.action.deplacement.info.deResult + 1;	
		$scope.$emit('plateaux-paysage-deplacement-ready',{deResult: $scope.action.deplacement.info.deResult});
	}
	$scope.ajouterActionDeplacement = function(){
		$scope.$emit('plateaux-paysage-deplacement-restart',{});
		$scope.action.deplacement.info.actionsRestantes ++;
		$scope.action.deplacement.info.arrivee = null;
	}

	// Utility functions

	$scope.showBonus = function(){
		$scope.action.showBonus = !$scope.action.showBonus;
	}

	$scope.dossierPileTransformation = {
		'pioche': 'pioche',
		'hors_pioche': 'hors-pioche'
	};

	// Initialization

	console.log('starting deplacement');
	var numero = $scope.joueurs[$scope.joueurId].pions[0].case;
	$scope.action.categorie = 'deplacement';
	$scope.action.deplacement = $scope.actions.deplacement[0];
	$scope.action.numero = numero;
	$scope.action.phase = 1;	
	$scope.action.showBonus = false;	

	$scope.$emit('cartes-utilisation-possible-circonstance',{categorie: 'deplacement',type: $scope.action.deplacement.type});

	startDeplacement();

	// Utilisation d'objets :

	var carteUtilisationDeplacementEventListener = $rootScope.$on('cartes-utilisation-deplacement',function(event,args){
		// Vérifier que le même objet n'est pas déjà utilisé :
		var objetTrouve = false;
		for (var i = 0;i < $scope.action.deplacement.info.bonus.length;i ++){
			if ($scope.action.deplacement.info.bonus[i].code === args.carte.code){
				objetTrouve = true;
			}
		}
		if (!objetTrouve){
			$scope.action.deplacement.info.bonus.push(args.carte);
			if (args.carte.pile === 'hors_pioche'){
				var carte = args.carte;
			}
			else {
				var carte = $scope.objets[args.carte.info[$args.carte.statut.ouverteIndex]];
			}
			for (var i = 0;i < carte.info.consequences.length;i ++){
				var consequence = carte.info.consequences[i];
				if (consequence.categorie === 'deplacement' && consequence.type === 'avantage' && consequence.valeur === 'vitesse_doublee'){
					console.log("on double le déplacement");
					if ($scope.action.deplacement.type ==='paysage' && $scope.action.deplacement.info.deResult != undefined && $scope.action.deplacement.info.deResult !== 146){
						$scope.action.deplacement.info.deResult *= 2;
						$scope.recommencerDeplacement();
					}
				}
			}
		}
		console.log($scope.action.deplacement.info.bonus);
	});
	$scope.$on("$destroy",carteUtilisationDeplacementEventListener);

	$scope.removeBonus = function(index){
		var carte = $scope.action.deplacement.info.bonus.splice(index,1)[0];
		if (carte.pile === 'hors_pioche'){
			
		}
		else if (carte.utilisation[0] === 'ouverture'){
			carte = $scope.objets[carte.info[0]];
		}
		else if (args.carte.utilisation[1] === 'ouverture'){
			carte = $scope.objets[carte.info[1]];
		}
		for (var i = 0;i < carte.info.consequences.length;i ++){
			var consequence = carte.info.consequences[i];
			if (consequence.categorie === 'deplacement' && consequence.type === 'avantage' && consequence.valeur === 'vitesse_doublee'){
				console.log("on divise le déplacement");
				if ($scope.action.deplacement.type ==='paysage' && $scope.action.deplacement.info.deResult != undefined && $scope.action.deplacement.info.deResult !== 73){
					$scope.action.deplacement.info.deResult /= 2;
					$scope.recommencerDeplacement();
				}
			}
		}
		if ($scope.action.deplacement.info.bonus.length === 0){
			$scope.action.showBonus = false;
		}
	}

}]);