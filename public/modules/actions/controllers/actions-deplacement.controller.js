'use strict';

angular.module('actions').controller('ActionsDeplacementController', ['$scope','$rootScope','$http','$timeout','Partie','Joueurs','Cartes','Objets','Actions','Questions',
	function($scope,$rootScope,$http,$timeout,Partie,Joueurs,Cartes,Objets,Actions,Questions) {

	function startDeplacement(){
		if ($scope.action.deplacement.type === 'paysage'){
			console.log("paysage");
			// $scope.action.deplacement.info.deLance = false;
			// $scope.action.deplacement.info.deResult = -1;
			// $scope.action.deplacement.info.directionChoisie = false;
			// $scope.action.deplacement.info.direction = "";
			if ($scope.action.deplacement.info.depart == undefined){
				$scope.action.deplacement.info.depart = $scope.joueurs[$scope.joueurId].pions[0].case;
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


	// Initialization

	console.log('starting deplacement');
	var numero = $scope.joueurs[$scope.joueurId].pions[0].case;
	$scope.action.categorie = 'deplacement';
	$scope.action.deplacement = $scope.actions.deplacement[0];
	$scope.action.numero = numero;
	$scope.action.phase = 1;		

	$scope.$emit('cartes-utilisation-possible-circonstance',{categorie: 'deplacement',type: $scope.action.deplacement.type});

	startDeplacement();

}]);