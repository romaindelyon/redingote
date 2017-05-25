'use strict';

angular.module('cartes').controller('CartesPiocheController',
	['$scope','$mdDialog','Cartes',
	function($scope,$mdDialog,Cartes) {

	$scope.piochesDisponibles = true;

	function carteSelection(){
		var carteOrder = Math.floor(Math.random() * $scope.pioches.pioche.length);
		Cartes.moveCartes({
    		carteIds: [$scope.pioches.pioche[carteOrder].id],
    		position: $scope.joueurId
    	}).success(function(){
			var carte = $scope.pioches.pioche[carteOrder];
			var piocheCartePopup = $mdDialog.confirm({
	        	templateUrl: 'modules/cartes/views/cartes-pioche-popup.view.html',
	        	clickOutsideToClose: true,
			    controller: function($scope){
		        	$scope.image = 'modules/cartes/img/pioche/cartes_pioche_'+carte.code+'.png';
		        	var flipped = false;
		        	$scope.flip = function(){
		        		if (carte.categorie == 'objet'){
			        		if (!flipped){
			        			$scope.image = 'modules/cartes/img/pioche/cartes_pioche_'+carte.code+'_flipped.png';
			        			flipped = true;
			        		}
			        		else {
			        			$scope.image = 'modules/cartes/img/pioche/cartes_pioche_'+carte.code+'.png';
			        			flipped = false;
			        		}
		        		}
		        	}
	            }
	        });
	        $mdDialog.show(piocheCartePopup);
	        // Ajouter la carte a la main
	        $scope.jeu.main.push($scope.pioches.pioche[carteOrder]);
	        // Retirer la carte de la pioche
			$scope.pioches.pioche.splice(carteOrder,1);
			if ($scope.pioches.pioche.length <= 0 && $scope.defausses.pioche.length > 0){
				retournement();
			}
			$scope.piochesDisponibles = true;
			$scope.partie.dispo.pioches.pioche --;
    	}).error(function(){
    		$scope.piochesDisponibles = true;
    	})
	}

	function retournement(pioche){
		console.log('retourning');
		var ids = [];
		for (var i in $scope.defausses.pioche){
			ids.push($scope.defausses.pioche[i].id);
		}
		Cartes.moveCartes({
    		carteIds: ids,
    		position: -1
    	}).success(function(){
    		for (var i in $scope.defausses.pioche){
    			$scope.pioches.pioche.push($scope.defausses.pioche[i]);
    		}
    		$scope.defausses.pioche = [];
    		if (pioche){
    			carteSelection();
    		}
    	});
	} 

	$scope.cartePioche = function(){
		$scope.piochesDisponibles = false;
		// Cas ou il reste des cartes quelque part:
		if ($scope.pioches.pioche.length > 0 || $scope.defausses.pioche.length > 0){
			if ($scope.pioches.pioche.length <= 0){
				retournement(true);
			}
			else {
				carteSelection();
			}
			
	    }
	    // Cas ou il n'y a pas de cartes disponibles:
	    else {
			var piocheCartePopup = $mdDialog.confirm({
				templateUrl: 'modules/core/views/core-warning-popup.view.html',
	        	clickOutsideToClose: true,
			    controller: function($scope){
		        	$scope.message = 'La pioche est vide';
	            }
	        });	 
	        $mdDialog.show(piocheCartePopup);
	        $scope.partie.dispo.pioches.pioche --;
	        $scope.piochesDisponibles = true;   	
	    }
	}

	$scope.carteQuestion = function(){
		var poseur = Math.floor(Math.random() * 3);
		var poseurNoms = ['Julia','Marie','Romain'];
		var poseurTextes = [
			"J'espère que tu connais les lois américaines stupides !",
			"Easy !",
			"J'espère que tu es très cultivé !"
		];
		var piocheQuestionPopup = $mdDialog.confirm({
        	templateUrl: 'modules/cartes/views/cartes-questions-pioche-popup.view.html',
        	clickOutsideToClose: true,
		    controller: function($scope,$mdDialog){
	        	$scope.poseur = poseurNoms[poseur];
	        	$scope.texte = poseurTextes[poseur];
	            $scope.popupConfirm = function(){
	            	$mdDialog.hide();
	            }
            }
        });
		$mdDialog.show(piocheQuestionPopup).then(function(){

		});
	}

}]);