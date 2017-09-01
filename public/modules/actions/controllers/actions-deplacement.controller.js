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
				console.log("allowing rose");
			}
		}
	}

	$rootScope.$on('plateaux-paysage-de',function(event,args){
		$scope.action.deplacement.info.deResult = args.result;
		Actions.update($scope.action.deplacement.info).success(function(){
			console.log("Action updatée");
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
		Actions.update($scope.action.deplacement.info).success(function(){
			console.log("Action updatée");
			$scope.$emit('plateaux-paysage-deplacement-ready',{deResult: $scope.action.deplacement.info.deResult});
		}).error(function(){
			console.log("Erreur d'update de notification d'humeur");
		});
	});


	// Initialization

	console.log('starting deplacement');
	var numero = $scope.joueurs[$scope.joueurId].pions[0].case;
	$scope.action.categorie = 'deplacement';
	$scope.action.deplacement = $scope.actions.deplacement[0];
	console.log($scope.action);
	$scope.action.numero = numero;
	$scope.action.phase = 1;		

	startDeplacement();

}]);