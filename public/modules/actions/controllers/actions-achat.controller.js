'use strict';

angular.module('actions').controller('ActionsAchatController', ['$scope','$rootScope','$http','$timeout','Partie','Joueurs','Cartes','Objets','Actions','Questions',
	function($scope,$rootScope,$http,$timeout,Partie,Joueurs,Cartes,Objets,Actions,Questions) {

	$scope.achatObjet = function(carte){
		$scope.actionCase.carte = carte;
		$scope.actionCase.phase = 2;
		if ($scope.actionCase.carte.info.paiement === 'glutis'){
			console.log($scope.joueurs[$scope.joueurId].glutis);
			if ($scope.joueurs[$scope.joueurId].glutis >= $scope.actionCase.carte.info.prix){
				$scope.actionCase.paiementPossible = true;
			}
			else {
				$scope.actionCase.paiementPossible = false;
			}
		}
		else if ($scope.actionCase.carte.info.paiement === 'echange'){
			$scope.actionCase.paiementPossible = true;
			$scope.actionCase.carteEchangeNoms = [];
			for (var j = 0;j < carte.info.echange.length;j ++){
				var echangePossible = false;
				for (var i = 0;i < $scope.jeu.horsPioche.length;i ++){
					if ($scope.jeu.horsPioche[i].code === carte.info.echange[j]){
						echangePossible = true;
						$scope.actionCase.carteEchangeNoms.push($scope.jeu.horsPioche[i].nom);
					}
				}
				if (!echangePossible){
					$scope.actionCase.paiementPossible = false;
				}
			}
		}
	}

	$scope.acheterObjet = function(){
		if (!$scope.actionCase.paiementPossible){
			$scope.actionCase.phase = 1;
		}
		if ($scope.actionCase.paiementPossible){
			$scope.actionCase.phase = 3;
			Cartes.moveCartes({
	    		carteIds: [$scope.actionCase.carte.id],
	    		position: $scope.joueurId
	    	}).success(function(){
				var carte = $scope.actionCase.carte;
				// Updater le statut de l'objet s'il est utile en mission :
				for (var i = 0;i < $scope.jeu.missions.length;i ++){
					if ($scope.jeu.missions[i].statut !== 'completed'){
						for (var j = 0;j < $scope.jeu.missions[i].info.etapes.length;j ++){
							if ($scope.jeu.missions[i].info.etapes[j].statut !== 'completed'){
								for (var k = 0;k < $scope.jeu.missions[i].info.etapes[j].cartes.length; k ++){
									console.log($scope.jeu.missions[i].info.etapes[j]);
									if ($scope.jeu.missions[i].info.etapes[j].cartes[k] != undefined && $scope.jeu.missions[i].info.etapes[j].cartes[k].code === carte.code){
										console.log("mission locked");
										carte.statut.missionLocked = true;
										Cartes.changementStatut({id: carte.id,statut: carte.statut}).success(function(){
											console.log("updated statut accordingly");
										}).error(function(){
											console.log("problème de statut update");
										})
									}
								}
							}
						}
					}
				}
		        // Ajouter la carte à la main :
		        $scope.jeu.horsPioche.push(carte);
		       // Retirer la carte des achats possible :
		       console.log($scope.actionsCase.achat);
				for (var i = 0;i < $scope.actionsCase.achat.length;i ++){
					if ($scope.actionsCase.achat[i].id === carte.id){
						$scope.actionsCase.achat.splice(i,1);
					}
				}				
				$scope.partie.dispo.tourDeJeu.achat[0] --;
				console.log($scope.partie.dispo.tourDeJeu.achat);
				console.log($scope.actionsCase.achat);
				// Retirer la carte de la pioche d'objets hors pioche :
				console.log( $scope.pioches.horsPioche);
				for (var i = 0;i < $scope.pioches.horsPioche.length;i ++){
					if ($scope.pioches.horsPioche[i].id === carte.id){
						$scope.pioches.horsPioche.splice(i,1);
					}
				}
				console.log($scope.pioches.horsPioche);
				// Effectuer le paiement :
				if (carte.info.paiement === 'glutis'){
					var nouvelleFortune = $scope.joueurs[$scope.joueurId].glutis - carte.info.prix;
					Joueurs.updateGlutis({joueurId: $scope.joueurId,glutis: nouvelleFortune,partieId: $scope.partieId}).success(function(){
						$scope.joueurs[$scope.joueurId].glutis = nouvelleFortune;
					}).error(function(){
						console.log("Echec d'actualisation des glutis");
					});
					$scope.$emit('jeu-hors-pioche-change',{});
				}
				else if (carte.info.paiement === 'echange'){
					var carteId = -1;
					var echangeIndices = [];
					var echangeIds = [];
					for (var j = 0;j < carte.info.echange.length;j ++){
						for (var i = 0;i < $scope.jeu.horsPioche.length;i ++){
							if ($scope.jeu.horsPioche[i].code === carte.info.echange[j]){
								echangeIndices.push(i);
								echangeIds.push($scope.jeu.horsPioche[i].id);
							}
						}
					}
					console.log(echangeIndices);
					Cartes.moveCartes({
			    		carteIds: echangeIds,
			    		position: -1
			    	}).success(function(){
			    		for (var i = echangeIndices.length - 1;i >= 0;i --){
							var carte = $scope.jeu.horsPioche[echangeIndices[i]];
							console.log(carte);
					        // Ajouter la carte aux objets hors pioche disponible :
					        $scope.pioches.horsPioche.push(carte);
					        // Updater la liste d'achats disponibles si un pion du joueur se trouve sur une case permettant de racheter cet objet :
							for (var j = 0;j < $scope.joueurs[$scope.joueurId].pions.length;j ++){
								if (carte.info.case === $scope.joueurs[$scope.joueurId].pions[j]){
									$scope.actionsCase.achat.push(carte);
									$scope.partie.dispo.tourDeJeu.achat[0] ++;
								}
							}
							// Retirer la carte de la main :
							$scope.jeu.horsPioche.splice(echangeIndices[i],1);
							$scope.$emit('jeu-hors-pioche-change',{});
			    		}
					}).error(function(){
						console.log("L'objet d'échange n'a pas pu être transféré");
					});
				}
				$timeout(function(){
					if ($scope.actionsCase.achat.length > 0){
						$scope.actionCase.phase = 1.1;
					}
					else {
						 $scope.cancelAction();
					}
				},2000);
	    	}).error(function(){
	    		$scope.piochesDisponibles = true;
				$timeout(function(){
					$scope.actionCase.phase = 1;
				},2000);
	    	});
		}

	}

	// Initialization

	var numero = $scope.joueurs[$scope.joueurId].pions[0].case;
	$scope.actionCase.categorie = 'achat';
	$scope.actionCase.numero = numero;
	$scope.actionCase.phase = 1;		


}]);