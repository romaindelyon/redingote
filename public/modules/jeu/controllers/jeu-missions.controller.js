'use strict';

angular.module('jeu').controller('JeuMissionsController', ['$scope','$rootScope','$filter','Cartes',
	function($scope,$rootScope,$filter,Cartes) {

	function missionPiochePossible(){
		if ($scope.partie.tour_action === 6){
			// Possibilité de piocher des missions si aucune mission au statut open ou ready
			var newMissionPossible = true;
			for (var i = 0;i < $scope.jeu.missions.length;i ++){
				if ($scope.jeu.missions[i].statut.statut === 'open' || $scope.jeu.missions[i].statut.statut === 'ready'){
					newMissionPossible = false;
				}
			}
			if (newMissionPossible){
				console.log("new mission possible");
				$scope.partie.dispo.pioches.missions = 1;
			}
		}
	}

	function updateStatutMission(newStatut){
		console.log("updating mission status");
		console.log(newStatut);
		Cartes.changementStatut({
    		carteId: $scope.mission.id,
    		statut: newStatut
    	}).success(function(){
    		$scope.mission.statut = newStatut;
    		missionPiochePossible();
    		missionsTriParDate();
    		console.log($scope.mission.statut);
    	}).error(function(){

    	});
	}

	// Affichage d'une autre mission :
	$scope.updateMission = function(index){
		$scope.missionIndex = index;
		$scope.mission = $scope.jeu.missions[$scope.missionIndex];
		$scope.missionCasesAvailable = [];
		updateMissionObjets();
		updateMissionCases();
		if ($scope.mission.statut.info !== undefined){
			$scope.updateEtape(0);
		}
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

	function updateMissionObjets(){
		for (var etape = 0;etape < $scope.mission.statut.info.etapes.length;etape ++){
			if ($scope.mission.statut.info.etapes[etape].statut !== 'completed'){
				var cartesReunies = true;
				if ($scope.mission.statut.info.etapes[etape].categorie === 'reunir_des_cartes' || $scope.mission.statut.info.etapes[etape].categorie === 'apporter_des_cartes'){
					console.log("on y est PRESQUE");
					for (var i = 0;i < $scope.mission.statut.info.etapes[etape].cartes.length;i ++){
						var carteFound = false;
						for (var j = 0;j < $scope.jeu.horsPioche.length;j ++){
							if ($scope.jeu.horsPioche[j].code === $scope.mission.statut.info.etapes[etape].cartes[i].code){
								carteFound = true;
							}
						}
						$scope.mission.statut.info.etapes[etape].cartes[i].completed = carteFound;
						if (!carteFound){
							cartesReunies = false;
						}
					}
					$scope.mission.statut.info.etapes[etape].cartesReunies = cartesReunies;
					console.log(cartesReunies);
					if ($scope.mission.statut.info.etapes[etape].categorie === 'reunir_des_cartes' && cartesReunies){
						$scope.mission.statut.info.etapes[etape].statut = 'ready';
					}
				}
			}
		}
	}

	$scope.completeMissionCase = function(etape,index){
		if ($scope.missionCasesAvailable.indexOf($scope.mission.statut.info.etapes[etape].cases[index].numero) > -1 && (etape === 0 || $scope.mission.statut.info.etapes[etape - 1].statut === 'completed')){
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

	function updateMissionCases(){
		for (var etape = 0;etape < $scope.mission.statut.info.etapes.length;etape ++){
			if ($scope.mission.statut.info.etapes[etape].statut !== 'completed' && $scope.mission.statut.info.etapes[etape].categorie === 'apporter_des_cartes' && (etape === 0 || $scope.mission.statut.info.etapes[etape - 1].statut === 'completed')){
				var etapeReady = false;
				for (var i in $scope.joueurs[$scope.joueurId].pions){
					if ($scope.joueurs[$scope.joueurId].pions[i].case.toString() === $scope.mission.statut.info.etapes[etape].case && $scope.mission.statut.info.etapes[etape].categorie === 'apporter_des_cartes' && $scope.mission.statut.info.etapes[etape].statut !== 'completed' && $scope.mission.statut.info.etapes[etape].cartesReunies){
						etapeReady = true;
					}				
				}
				if (etapeReady){
					$scope.mission.statut.info.etapes[etape].statut = 'ready';
				}
				else {
					$scope.mission.statut.info.etapes[etape].statut = 'open';
				}
			}
		}
	}

	$scope.completeEtape = function(etape){
		newStatut = $.extend({}, $scope.mission.statut);
		newStatut.info.etapes[etape].statut = 'completed';
		Cartes.changementStatut({
    		carteId: $scope.mission.id,
    		statut: newStatut
    	}).success(function(){
    		$scope.mission.statut = newStatut;
			// Vérifier si la mission est finie :
			var missionReady = true;
			for (var i in $scope.mission.statut.info.etapes){
				if ($scope.mission.statut.info.etapes[i].statut !== 'completed'){
					console.log("il reste une mission à faire");
					missionReady = false;
				}
			}
			if (missionReady){
				console.log("la mission est prête");
				newStatut = $.extend({}, $scope.mission.statut);
				newStatut.statut = 'completed';
				$scope.$emit('consequence-start',{consequences: $scope.mission.info.consequences,type: 'recompense'});
				newStatut.completionDate = new Date();
				updateStatutMission(newStatut);
				console.log('completed !!!');
			}	
    	}).error(function(){

    	});	
	}

	// Placer les plus récentes en haut :
	function missionsTriParDate(){
		var missions = [];
		var completedMissions = [];
		for (var i = 0;i < $scope.jeu.missions.length;i ++){
			if ($scope.jeu.missions[i].statut.statut !== 'completed'){
				missions.push($scope.jeu.missions[i]);
			}
			else {
				completedMissions.push($scope.jeu.missions[i]);
			}
		}
		console.log(missions);
		console.log(completedMissions);
		$scope.jeu.missions = missions;
		completedMissions = $filter('orderBy')(completedMissions,['-statut.completionDate'],false);
		for (var i = 0;i < completedMissions.length;i ++){
			if (completedMissions[i].statut.statut === 'completed'){
				$scope.jeu.missions.push(completedMissions[i]);
			}
		}		
	}

	function initializeMissions(){
		missionsTriParDate();
		$scope.missionIndex = 0;
		$scope.mission = $scope.jeu.missions[0];
		console.log($scope.mission);
		$scope.missionCasesAvailable = [];
		updateMissionObjets();
		updateMissionCases();

		if ($scope.mission.statut.info !== undefined){
			var etape = 0;
			for (var i = $scope.mission.info.etapes.length - 1;i >= 0;i --){
				if ($scope.mission.statut.info.etapes[i].statut !== 'completed'){
					etape = i;
				}
			}
			console.log(i);
			$scope.updateEtape(etape);
		}		
	}

	// Initialization :
	var newStatut = {};
	if ($scope.jeu.missions.length > 0){
		initializeMissions();
	}

	$rootScope.$on('jeu-missions-case-start',function(event, args){
		for (var i in $scope.joueurs[$scope.joueurId].pions){
			$scope.missionCasesAvailable.push($scope.joueurs[$scope.joueurId].pions[i].case.toString());
		}
	});
	$rootScope.$on('jeu-missions-case-end',function(event, args){
		$scope.missionCasesAvailable = [];
	});

	// Every time hors pioche objets are changed, call this to update the visuals of ongoing mission:
	$rootScope.$on('jeu-hors-pioche-change',function(event, args){
		updateMissionObjets();
	});	
	// Every time a pion is moved, call this to update the visuals of ongoing mission:
	$rootScope.$on('plateaux-pion-move',function(event, args){
		updateMissionCases();
	});	

	// On regarde si on peut piocher des missions :
	$rootScope.$on('partie-tour-action-start',function(event, args){
		missionPiochePossible();
	});	

	// On initialize les missions :
	$rootScope.$on('missions-initialize',function(event, args){
		initializeMissions();
	});	

}]);