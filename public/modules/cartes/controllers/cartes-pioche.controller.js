'use strict';

angular.module('cartes').controller('CartesPiocheController',
	['$scope','$mdDialog','Cartes','Actions',
	function($scope,$mdDialog,Cartes,Actions) {

	$scope.piochesDisponibles = true;

	function startEffetImmediat(carte){
		console.log("emitting actions-add");
		// Ajouter l'action effet immédiat pour le joueur en cours :
		$scope.$emit('actions-add',{
			categorie: 'notification',
			type: 'effet_immediat',
			cible: $scope.joueurId,
			info: carte,
			priority: 1
		});
	}

	function carteSelection(){
		var carteOrder = Math.floor(Math.random() * $scope.pioches.pioche.length);
		// La carte va dans la main du joueur si elle n'est pas à effet immédiat :
		var newPosition = $scope.joueurId;
		// La carte va dans la défausse si elle est à effet immédiat ;
		if ($scope.pioches.pioche[carteOrder].categorie === 'effet_immediat'){
			newPosition = -2;
		}
		Cartes.moveCartes({
    		carteIds: [$scope.pioches.pioche[carteOrder].id],
    		position: newPosition
    	}).success(function(){
			var carte = $scope.pioches.pioche[carteOrder];
			carte.statut.utilisation = carte.utilisation;
			Cartes.changementStatut({carteId: carte.id,statut: carte.statut}).success(function(){
				console.log("updated statut accordingly");
			}).error(function(){
				console.log("problème de statut update");
			});
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
	        // Déclencher l'effet si la carte est à effet immédiat :
	        if ($scope.pioches.pioche[carteOrder].categorie === 'effet_immediat'){
	        	startEffetImmediat($scope.pioches.pioche[carteOrder]);
	        	$scope.defausses.pioche.push($scope.pioches.pioche[carteOrder]);
	        }
	        // Ajouter la carte a la main
	        else {
	        	$scope.jeu.main.push($scope.pioches.pioche[carteOrder]);
	        }
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

	function piocheCarteMission(){
		var carteOrder = Math.floor(Math.random() * $scope.pioches.missions.length);
		Cartes.moveCartes({
    		carteIds: [$scope.pioches.missions[carteOrder].id],
    		position: $scope.joueurId
    	}).success(function(){
    		// Changer statut to open
    		Cartes.changementStatut({
	    		carteId: $scope.pioches.missions[carteOrder].id,
	    		statut: {statut: 'open', info: $scope.pioches.missions[carteOrder].info}
	    	});
			var carte = $scope.pioches.missions[carteOrder];
			var piocheCartePopup = $mdDialog.confirm({
	        	templateUrl: 'modules/cartes/views/cartes-pioche-popup.view.html',
	        	clickOutsideToClose: true,
			    controller: function($scope){
		        	$scope.image = 'modules/cartes/img/missions/cartes_missions_'+carte.code+'.png';
	            }
	        });
	        $mdDialog.show(piocheCartePopup);
	        // Ajouter la carte a la main
	        $scope.pioches.missions[carteOrder].statut = {
	        	statut: 'open',
	        	info: $scope.pioches.missions[carteOrder].info
	        }
	        $scope.jeu.missions.unshift($scope.pioches.missions[carteOrder]);
	        $scope.$emit('missions-initialize',{});
	        // Retirer la carte de la pioche
			$scope.pioches.missions.splice(carteOrder,1);
			$scope.piochesDisponibles = true;
			$scope.partie.dispo.pioches.missions --;
			// Updater le statut des objets hors pioche requis pour la mission :
			for (var i = 0;i < $scope.jeu.horsPioche.length;i ++){
				console.log($scope.jeu.horsPioche[i]);
				if ($scope.jeu.horsPioche[i].categorie === "objet"){
					for (var j = 0;j < carte.info.etapes.length;j ++){
						for (var k = 0;k < carte.info.etapes[j].cartes.length; k ++){
							console.log(carte.info.etapes[j]);
							if (carte.info.etapes[j].cartes[k] != undefined && carte.info.etapes[j].cartes[k].code === $scope.jeu.horsPioche[i].code){
								console.log("mission locked");
								$scope.jeu.horsPioche[i].statut.missionLocked = true;
								Cartes.changementStatut({carteId: $scope.jeu.horsPioche[i].id,statut: $scope.jeu.horsPioche[i].statut}).success(function(){
									console.log("updated statut accordingly");
								}).error(function(){
									console.log("problème de statut update");
								});
							}
						}
					}
				}
			}
    	}).error(function(){
    		$scope.piochesDisponibles = true;
    	});
	}

	$scope.carteMission = function(){
		$scope.piochesDisponibles = false;
		// Cas ou il reste des cartes quelque part:
		if ($scope.pioches.missions.length > 0){
			piocheCarteMission();
	    }
	    // Si les missions sont épuisées, on redistribue toutes les missions normales :
	    else {
	    	var missionsNormales = [];
	    	for (var i in $scope.cartes){
	    		console.log($scope.cartes[i]);
	    		if ($scope.cartes[i].pile === 'missions' && $scope.cartes[i].categorie === 'normale'){
    				var carte = jQuery.extend({}, $scope.cartes[i]);
    				carte.statut = {};
	    			missionsNormales.push(carte);
	    		}
	    	} 
	    	for (var i = 0;i < missionsNormales.length;i ++){
    			var createMission = function(index){
    				var carte = jQuery.extend({}, missionsNormales[index]);
    				carte.statut = {};
    				carte.categorie = "copie";
    				carte.position = -1;
    				console.log(carte);
	    			Cartes.createCarte(carte).success(function(){
	    				// all missions have been added : on les retélécharge pour avoir les indices
	    				console.log(index);
	    				console.log(missionsNormales.length);
	    				if (index === missionsNormales.length - 1){
	    					Cartes.getCartes({partieId: $scope.partieId}).success(function(response){
	    						for (var i = 0;i < response.length;i ++){
	    							if (response[i].pile === 'missions' && response[i].position === -1){
	    								$scope.pioches.missions.push(response[i]);
	    							}
	    						}
	    						if ($scope.pioches.missions.length > 0){
	    							piocheCarteMission();
	    						}
	    					});
	    				}
	    			});
    			}(i);
	    	}
	        $scope.partie.dispo.pioches.missions --;
	        $scope.piochesDisponibles = true;   	
	    }
	}

}]);