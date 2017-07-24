'use strict';

angular.module('jeu').controller('JeuMissionsController', ['$scope',
	function($scope) {

		$scope.mission = $scope.jeu.missions[0];

		$scope.updateEtape = function(etape){
			$scope.etape = etape;
			$scope.etapeTitre = (etape + 1).toString()+ ". ";
			if ($scope.mission.info.etapes[etape].categorie == 'apporter_des_cartes'){
				$scope.etapeTitre += "Apporter ces objets en case " + $scope.mission.info.etapes[etape].case;
			}
			else if ($scope.mission.info.etapes[etape].categorie == 'reunir_des_cartes'){
				$scope.etapeTitre += "Réunir ces objets";
			}
			else if ($scope.mission.info.etapes[etape].categorie == 'remporter_des_duels'){
				$scope.etapeTitre += "Vaincre ces joueurs en duel";
			}
			else if ($scope.mission.info.etapes[etape].categorie == 'visiter_des_cases'){
				$scope.etapeTitre += "Visiter ces cases";
			}
			else if ($scope.mission.info.etapes[etape].categorie == 'visiter_des_zones'){
				$scope.etapeTitre += "Visiter ces zones";
			}
		}
		if ($scope.mission.info !== undefined){
			$scope.updateEtape(0);
		}
}]);