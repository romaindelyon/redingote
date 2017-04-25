'use strict';

angular.module('confrontations').controller('ConfrontationsAttaqueDuelController', ['$scope','$rootScope','Confrontations',
	function($scope,$rootScope,Confrontations) {

	$scope.duel.cible = -1;
	$scope.duel.info = {
		results_source: [],
		result_source: 0,
		bonus_source: 0,
		modulo: 18
	};
	$scope.duel.ready = false;

	$scope.chooseJoueur = function(id){
		$scope.duel.cible = id;
		$scope.duel.cible_text = " sur " + $scope.joueurs[id].nom;
	}

	function updateResult(){
		var result = 0;
		for (var i in $scope.duel.info.results_source){
			result += $scope.duel.info.results_source[i];
		}
		$scope.duel.info.result_source = result % $scope.duel.info.modulo;
		console.log($scope.duel.info.result_source);
	}

	function lanceDeDuel(result){
		if ($scope.duel.info.results_source.length < 3){
			$scope.duel.info.results_source.push(result);
			updateResult();
			if ($scope.duel.info.results_source.length == 3){
				$scope.duel.ready = true;
			}
		}
	}

	$scope.lanceDuel = function(){
    	// send attaque !
    	Confrontations.add({
    		categorie: 'attaque',
    		type: 'duel',
    		info: $scope.duel.info,
    		cible: $scope.attaque.cible,
    		source: $scope.joueurId
    	}).success(function(){
    		$scope.partie.dispo.duel = false;
    	}).error(function(){
    		console.log('Sending duel did not work');
    	})
	}


	// Event sent from de controller:
	$rootScope.$on('confrontations-duel-de', function(event, args) {
		lanceDeDuel(args.result);
	});

}]);