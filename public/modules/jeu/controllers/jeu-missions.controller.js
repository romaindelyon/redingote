'use strict';

angular.module('jeu').controller('JeuMissionsController', ['$scope','$rootScope','Cartes',
	function($scope,$rootScope,Cartes) {

	$scope.mission = $scope.jeu.missions[0];
	console.log("rerunning controller");
	$scope.missionCasesAvailable = [];
	var newStatut = {};

	function updateStatutMission(newStatut){
		Cartes.changementStatut({
    		carteId: $scope.mission.id,
    		statut: newStatut
    	}).success(function(){
    		$scope.mission.statut = newStatut;
    	}).error(function(){

    	});
	}

	$scope.updateEtape = function(etape){
		$scope.etape = etape;
		if ($scope.mission.statut.info.etapes.length > 1){
			$scope.etapeTitre = (etape + 1).toString()+ ". ";
		}
		else {
			$scope.etapeTitre = "";
		}
		if ($scope.mission.statut.info.etapes[etape].categorie == 'apporter_des_cartes'){
			$scope.etapeTitre += "Apporter ces objets en case " + $scope.mission.info.etapes[etape].case;
		}
		else if ($scope.mission.statut.info.etapes[etape].categorie == 'reunir_des_cartes'){
			$scope.etapeTitre += "Réunir ces objets";
		}
		else if ($scope.mission.statut.info.etapes[etape].categorie == 'remporter_des_duels'){
			$scope.etapeTitre += "Vaincre ces joueurs en duel";
		}
		else if ($scope.mission.statut.info.etapes[etape].categorie == 'visiter_des_cases'){
			$scope.etapeTitre += "Visiter ces cases";
		}
		else if ($scope.mission.statut.info.etapes[etape].categorie == 'visiter_des_zones'){
			$scope.etapeTitre += "Visiter ces zones";
		}
	}

	$scope.completeMissionCase = function(etape,index){
		if ($scope.missionCasesAvailable.indexOf($scope.mission.statut.info.etapes[etape].cases[index].numero) > -1){
			newStatut = $.extend({}, $scope.mission.statut);
			newStatut.info.etapes[etape].cases[index].completed = true;
			Cartes.changementStatut({
	    		carteId: $scope.mission.id,
	    		statut: newStatut
	    	}).success(function(){
			$scope.mission.statut = newStatut;
				// Verifier si l'étape est finie :
				if ($scope.mission.statut.info.etapes[etape].statut !== 'ready' && $scope.mission.statut.info.etapes[etape].statut !== 'completed'){
					if ($scope.mission.statut.info.etapes[etape].categorie === 'visiter_des_cases'){
						var etapeReady = true;
						for (var i in $scope.mission.statut.info.etapes[etape].cases){
							if (!$scope.mission.statut.info.etapes[etape].cases[i].completed){
								etapeReady = false;
							}
						}
						if (etapeReady){
							newStatut = $.extend({}, $scope.mission.statut);
							newStatut.info.etapes[etape].statut = 'ready';
							updateStatutMission(newStatut);
							console.log('ready !!!');
						}
					}
				}
			});
		}
	}

	$scope.completeEtape = function(etape){
		newStatut = $.extend({}, $scope.mission.statut);
		newStatut.info.etapes[etape].statut = 'completed';
		console.log(newStatut);
		Cartes.changementStatut({
    		carteId: $scope.mission.id,
    		statut: {}
    	}).success(function(){
    		console.log(newStatut);
    		$scope.mission.statut = newStatut;
    		console.log($scope.mission.statut);
			// Vérifier si la mission est finie :
			var missionReady = true;
			for (var i in $scope.mission.statut.info.etapes){
				if ($scope.mission.statut.info.etapes[i].statut !== 'completed'){
					missionReady = false;
				}
			}
			if (missionReady){
				newStatut = $.extend({}, $scope.mission.statut);
				newStatut.statut = 'completed';
				updateStatutMission(newStatut);
				console.log('completed !!!');
			}	
    	}).error(function(){

    	});	
	}

	if ($scope.mission.statut.info !== undefined){
		$scope.updateEtape(0);
	}
	console.log($scope.mission);

	$rootScope.$on('jeu-missions-case-start',function(event, args){
		console.log('missions case start');
		for (var i in $scope.joueurs[$scope.joueurId].pions){
			console.log($scope.mission);
			$scope.missionCasesAvailable.push($scope.joueurs[$scope.joueurId].pions[i].case.toString());
		}	
	});
	$rootScope.$on('jeu-missions-case-end',function(event, args){
		$scope.missionCasesAvailable = [];
	});

}]);