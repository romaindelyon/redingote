'use strict';

angular.module('accueil').controller('AccueilController', ['$scope','$state','Joueurs','Partie','Cartes',
	function($scope,$state,Joueurs,Partie,Cartes) {

	$scope.authentication = {};

	$scope.goToPartie = function(partieId,joueurId){
		for (var i = 0;i < $scope.parties.length;i ++){
			$scope.parties[i].showPassword = [false,false,false];
		}
		for (var i = 0;i < $scope.parties.length;i ++){
			if ($scope.parties[i].id === partieId){
				$scope.parties[i].showPassword[joueurId] = true;
			}
		}
	}

	$scope.submitPassword = function(partieId,joueurId){
		Joueurs.checkPassword({password: $scope.authentication.password}).success(function(passwordCorrect){
			if (passwordCorrect){
				$state.go('partie',{partie: partieId,joueur: joueurId});
			}
		}).error(function(error){
			console.log(error);
		});
	}

	Partie.getAllParties().success(function(response){
		console.log(response);
		$scope.parties = response;
		for (var i = 0;i < $scope.parties.length;i ++){
			$scope.parties[i].showPassword = [false,false,false];
		}
		console.log($scope.parties);
	});

	$scope.creerPartie = function(){
		Partie.create().success(function(partieId){
			Cartes.getCartes({partieId: 1}).success(function(cartes){
				for (var i = 0;i < cartes.length;i ++){
					var carte = cartes[i];
					if (carte.pile !== 'missions' || carte.categorie !== 'copie'){
						carte.statut = {};
						carte.partie = partieId;
						// NOUVELLE FUNCTION CREER CARTES POUR UNE SEULE PARTIE
						Cartes.createCarte(carte).success(function(){
							console.log('carte '+i+" créée");
						}).error(function(){
							console.log("error de création de carte");
						});
					}
				}
			}).error(function(error){
				console.log(error);
			});
			Objets.get({partieId: 1}).success(function(objets){
				for (var i = 0;i < objets.length;i ++){
					var carte = cartes[i];
					if (carte.pile !== 'missions' || carte.categorie !== 'copie'){
						carte.statut = {};
						carte.partie = partieId;
						// NOUVELLE FUNCTION CREER CARTES POUR UNE SEULE PARTIE
						Cartes.createCarte(carte).success(function(){
							console.log('carte '+i+" créée");
						}).error(function(){
							console.log("error de création de carte");
						});
					}
				}
			}).error(function(error){
				console.log(error);
			});
			Joueurs.getJoueurs({partieId: $scope.partieId}).success(function(joueurs){

			}).error(function(error){
				console.log(error);
			});
		}).error(function(){
			console.log("error creating partie");
		});
	}

}]);