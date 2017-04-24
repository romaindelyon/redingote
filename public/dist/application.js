'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'Redingote';
	var applicationModuleVendorDependencies = ['ngResource', 'ngMessages', 'ngAria', 'ngMaterial', 'ngAnimate', 
	'toastr', 'ui.router', 'ui.bootstrap', 'ui.utils', 'satellizer', 'ngStorage', 'ngIdle', 
	'angulartics', 'angulartics.google.analytics', 'infinite-scroll','pascalprecht.translate'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();

'use strict';

// This does not seem to work. Need to fix code versioning so that browser always loads new file.
var version='0.0.0'; 

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Configure throttle for infinite scroll.
angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 150)

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

angular.module(ApplicationConfiguration.applicationModuleName).config(["$mdThemingProvider", "$mdIconProvider", function($mdThemingProvider, $mdIconProvider){
	// TODO: add configurations here
	$mdThemingProvider.theme('default')
		.primaryPalette('light-blue', {
		})
}]);

angular.module(ApplicationConfiguration.applicationModuleName).provider('configService', function(){
	var options = {};
	this.config = function(opt){
		angular.extend(options,opt);
	};
	this.$get = [function() {
		if(!options){
			throw new Error('config options must be configured');
		}
		return options;

	}]
});

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	// if (window.location.hash === '#_=_') window.location.hash = '#!';

	$.get('env.json', function (configData) {
		console.log('env.json coming');
		angular.module(ApplicationConfiguration.applicationModuleName).config(['configServiceProvider',
			function (configServiceProvider) {
			if (window.location.href.substring(7,16) == 'localhost'){
				configData.local = true;
			}
			configServiceProvider.config(configData);
		}]);
		console.log('initializing!');
		//Init the app
		angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
	});
});

angular.module(ApplicationConfiguration.applicationModuleName).run(["$http", "$httpBackend", function($http, $httpBackend) {
	$http.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
	$http.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
	$http.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
}]);



'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('accueil');

'use strict';

// Setting up route
angular.module('accueil').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise(function($injector, $location){
			var state = $injector.get('$state');
   			state.go('accueil');
	   		return $location.path();
		});

		// Home state routing
		$stateProvider.
		state('accueil', {
			url: '/',
			templateUrl: 'modules/accueil/views/accueil.view.html'
		});
	}
]);
'use strict';


angular.module('accueil').controller('HomeController', ['$scope','$sessionStorage','$location','$auth',
	function($scope,$sessionStorage,$location,$auth) {

		$scope.$storage = $sessionStorage.$default({
			me: [],
			clinicInfo : {},
			medications : [],
			api: {},
			buildWebNumber: ''
		});
		$scope.authentication = function () {
			return $auth.isAuthenticated();
		};
		if(!$scope.authentication){
			$location.path('/signin');
		}

	}
]);

'use strict';

angular.module('accueil').controller('AccueilController', ['$scope','$state',
	function($scope,$state) {

	$scope.goToPartie = function(id){
		$state.go('partie',{joueur: id});
	}

}]);
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('attaques');

'use strict';

angular.module('attaques').controller('AttaquesContainerController', ['$scope','Cartes','Attaques',
	function($scope,Cartes,Attaques) {

	$scope.chooseJoueur = function(id){
		$scope.attaque.cible = id;
	}

	$scope.cancelAttaque = function(){
		$scope.attaque.active = false;
		$scope.attaque.cible = -1;
		$scope.attaque.carte = {};
		$scope.attaque.carteIndex = -1;
	}

	$scope.lanceAction = function(){
		var carte = $scope.attaque.carte;
		console.log(carte);
		// retirer la carte de la main:
		Cartes.moveCartes({
    		carteIds: [carte.id],
    		position: -2
        }).success(function(){
        	// send attaque !
        	Attaques.add({
        		categorie: 'attaque',
        		type: 'action',
        		carte: carte.id,
        		cible: $scope.attaque.cible,
        		source: $scope.joueurId
        	});
    		$scope.defausses.pioche.push(carte);
			$scope.jeu.main.splice($scope.attaque.carteIndex,1);
			console.log($scope.jeu.main);
			$scope.cancelAttaque();
    	}).error(function(){

    	})
	}

}]);
'use strict';

angular.module('attaques').controller('AttaquesDefenseContainerController', ['$scope','Cartes','Attaques','Partie','Joueurs','AttaquesDefenseService','PartieTourService',
	function($scope,Cartes,Attaques,Partie,Joueurs,AttaquesDefenseService,PartieTourService) {

	$scope.toursToSkip = 0;

	$scope.removeCarte = function(index){
		$scope.defense.cartes_jeter[index].filled = false;
		$scope.defense.cartes_jeter_filled --;
		$scope.defense.canProceed = false;
	}

	$scope.finishDefense = function(){
		if ($scope.defense.type == 'action'){
			var action = $scope.defense.action;
			if (action.types[0] == 'tour_passe'){
				$scope.toursToSkip ++;
			}
			else if (action.types[0] == 'cartes_perte'){
				for (var i in $scope.defense.cartes_jeter){
					if ($scope.defense.cartes_jeter[i].filled){
						// find index:
						var index = -1;
						var j = 0;
						while (index < 0 && j < $scope.jeu.main.length){
							if ($scope.jeu.main[j].id == $scope.defense.cartes_jeter[i].id){
								index = j;
							}
							j ++;
						}
						Cartes.moveCartes({
				    		carteIds: [$scope.defense.cartes_jeter[i].id],
				    		position: -2
				    	}).success(function(){
				    		var carte = $scope.jeu.main[index];
				    		carte.main = {};
							$scope.defausses.pioche.push(carte);
							$scope.jeu.main.splice(index,1);
							$scope.focusIndex = -2;
				    	}).error(function(){

				    	})
					}
				}
			}
		}
		// Si la defense en question est bien finie:
		if ($scope.defense.remainingSteps <= 0){
			// On la vire:
			Attaques.delete({id: $scope.defense.id});
			$scope.defense.active = false;
			// On enchaine avec les eventuelles defenses suivantes:
			if ($scope.attaques.defenses.length > 0){
				AttaquesDefenseService.startDefense($scope);
			}
			// On skippe les tours eventuellement:
			else {
				if ($scope.toursToSkip > 0){
					PartieTourService.moveTour($scope,7,$scope.toursToSip - 1);
				}
			}
		}
	}
		// var carte = $scope.attaque.carte;
		// // retirer la carte de la main:
		// // Cartes.moveCartes({
  // //   		carteIds: [carte.id],
  // //   		position: -2
  // //       }).success(function(){
  //       	// send attaque !
	 //    	Attaques.remove({
	 //    		id: $scope.defense.id;
	 //    	});
   //  		$scope.defausses.pioche.push(carte);
			// $scope.jeu.main.splice($scope.attaque.carteIndex,1);
			// $scope.cancelAttaque();
    	// }).error(function(){

    	// })

}]);
'use strict';

angular.module('attaques').directive('redAttaquesContainer', [
	function() {
		return {
			templateUrl: 'modules/attaques/views/attaques-container.view.html',
			restrict: 'E'
		};
	}
]);

angular.module('attaques').directive('redAttaquesDefenseContainer', [
	function() {
		return {
			templateUrl: 'modules/attaques/views/attaques-defense-container.view.html',
			restrict: 'E'
		};
	}
]);
'use strict';

angular.module('attaques').factory('Attaques', ['$http','configService',
	function($http,configService) {
		return {
			// Add an attaque:
			add: function(params){
				if (configService.local){
					return $http({
				        method: 'GET', 
				        url: 'modules/joueurs/json/joueurs.json'
				    });
				}
				else {
					return $http({
				        method: 'POST', 
				        url: 'modules/attaques/php/attaques-add.php',
				        params: params,
				        headers: {
				        	'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate',
				        	'Content-Type': 'application/json'
				        }
				    });
				}
			},
			get: function(params){
				if (configService.local){
					return $http({
				        method: 'GET', 
				        url: 'modules/attaques/json/attaques.json'
				    });
				}
				else {
					return $http({
				        method: 'GET', 
				        url: 'modules/attaques/php/attaques-get.php',
				        params: params,
				        headers: {
				        	'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate',
				        	'Content-Type': 'application/json'
				        }
				    });
				}
			},
			delete: function(params){
				if (configService.local){
					return $http({
				        method: 'GET', 
				        url: 'modules/attaques/json/attaques.json'
				    });
				}
				else {
					return $http({
				        method: 'POST', 
				        url: 'modules/attaques/php/attaques-delete.php',
				        params: params,
				        headers: {
				        	'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate',
				        	'Content-Type': 'application/json'
				        }
				    });
				}
			}
		}
	}
]);

angular.module('attaques').service('attaquesActions',
	['$mdDialog','Cartes',
	function($mdDialog,Cartes) {

	var attaquesActionsFunctions = {};

	function addAttaqueDescription(scope,action){
		var description = "";
		if (action.types[0] == 'cartes_perte'){
			description = "perd " + action.valeur + " cartes !";
		}
		else if (action.types[0] == 'tour_passe'){
			description = "passe " + action.valeur + " tour !";
		}
		else if (action.types[0] == 'cartes_perte_test'){
			description = "risque de perdre " + action.valeur + " cartes !";
		}
		scope.attaque.description = description;
	};

	attaquesActionsFunctions.utiliser = function(scope,carte){
		scope.attaque.active = true;
		scope.attaque.categorie = 'action';
		scope.attaque.carte = carte;
		addAttaqueDescription(scope,carte.action);
	}

	return(attaquesActionsFunctions);
}]);
angular.module('attaques').service('AttaquesDefenseService',
	['Cartes',
	function(Cartes) {

	var attaquesDefenseFunctions = {};

	function implementDefense($scope){
		var description = "";
		var defense = $scope.defense;
		if (defense.type == 'action'){
			var carteId = defense.carte;
			var action = $scope.cartes[carteId].action;
			$scope.defense.action = action;
			console.log($scope.cartes);
			console.log(carteId);
		console.log($scope.defense.action.types[0]);
			if (action.types[0] == 'cartes_perte'){
				$scope.defense.remainingSteps = 0;
				$scope.defense.cartes_jeter = [
					{filled: false},
					{filled: false}
				];
				$scope.defense.cartes_jeter_filled = 0;
				$scope.defense.cartes_jeter_total = action.valeur;
				var cartesJetables = 0;
				for (var i in $scope.jeu.main){
					if (!$scope.jeu.main[i].injetable){
						cartesJetables ++;
					}
				}
				if (cartesJetables < action.valeur){
					$scope.defense.cartes_jeter_total = cartesJetables;
				}
				$scope.partie.dispo.cartes.main_jeter_attaque = true;
				if (action.valeur == 1){
					description = "Choisis " + action.valeur + " carte à défausser :";
				}
				else {
					description = "Choisis " + action.valeur + " cartes à défausser :";
				}
			}
			else if (action.types[0] == 'cartes_perte_test'){
				$scope.defense.remainingSteps = 1;
				if (action.valeur == 1){
					description = "Tu passes " + action.valeur + " tour";
				}
				else {
					description = "Tu passes " + action.valeur + " tour";
				}
			}
			else if (action.types[0] == 'tour_passe'){
				$scope.defense.canProceed = true;
				$scope.defense.remainingSteps = 0;
				if (action.valeur == 1){
					description = "Tu passes " + action.valeur + " tour";
				}
				else {
					description = "Tu passes " + action.valeur + " tour";
				}
			}
		}
		$scope.defense.description = description;
		console.log($scope.defense);
	};

	attaquesDefenseFunctions.startDefense = function($scope){
		if($scope.partie.tour_joueur == $scope.joueurId && $scope.partie.tour_action == 0){
			$scope.defense.id = $scope.attaques.defenses[0].id;
			$scope.defense.type = $scope.attaques.defenses[0].type;
			$scope.defense.categorie = $scope.attaques.defenses[0].categorie;
			$scope.defense.carte = $scope.attaques.defenses[0].carte;
			$scope.defense.source = $scope.attaques.defenses[0].source;
			$scope.defense.canProceed = false;
			$scope.defense.active = true;
			$scope.attaques.defenses.splice(0,1);
			implementDefense($scope);
		}
	}

	attaquesDefenseFunctions.jeterCarte = function($scope,id){
		var carteJetee = false;
		for (var i in $scope.defense.cartes_jeter){
			if ($scope.defense.cartes_jeter[i].id == id){
				carteJetee = true;
			}
		}
		if (!carteJetee){
			var foundSpot = false;
			var i = 0;
			var cartesAJeter = $scope.defense.cartes_jeter.length;
			while (i < cartesAJeter && !foundSpot){
				if (!$scope.defense.cartes_jeter[i].filled){
					console.log($scope.defense.cartes_jeter);
					$scope.defense.cartes_jeter[i] = $scope.cartes[id];
					$scope.defense.cartes_jeter[i].filled = true;
					foundSpot = true;
					$scope.defense.cartes_jeter_filled ++;
				}
				// On a tout rempli:
				if ($scope.defense.cartes_jeter_total == $scope.defense.cartes_jeter_filled){
					$scope.defense.canProceed = true;
				}
				i ++;
			}
		}
	}

	return(attaquesDefenseFunctions);
}]);
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('cartes');

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
		        	$scope.image = 'modules/cartes/img/pioche/cartes_pioche_'+carte.id+'.png';
		        	var flipped = false;
		        	$scope.flip = function(){
		        		if (carte.categorie == 'objet'){
			        		if (!flipped){
			        			$scope.image = 'modules/cartes/img/pioche/cartes_pioche_'+carte.id+'_flipped.png';
			        			flipped = true;
			        		}
			        		else {
			        			$scope.image = 'modules/cartes/img/pioche/cartes_pioche_'+carte.id+'.png';
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
    	});
    	if (pioche){
    		carteSelection();
    	}
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
'use strict';

angular.module('cartes').factory('Cartes', ['$http','configService',
	function($http,configService) {
		return {
			// Get all the cartes:
			getCartes: function(){
				if (configService.local){
					return $http({
				        method: 'GET', 
				        url: 'modules/cartes/json/cartes.json'
				    });
				}
				else {
					return $http({
				        method: 'GET', 
				        url: 'modules/cartes/php/cartes.php',
				        headers: {
				        	'Cache-Control': 'no-cache'
				        }
				    });
				}
			},
			moveCartes: function(params){
				if (configService.local){
					return $http({
				        method: 'GET', 
				        url: 'modules/cartes/json/cartes.json'
				    });
				}
				else {
					var phpParams = "";
					phpParams += "position="+params.position;
					for (var i in params.carteIds){
						phpParams += "&carteId[]=" + params.carteIds[i];
					}
					console.log(phpParams);
					return $http({
				        method: 'GET', 
				        url: 'modules/cartes/php/cartes-move.php?'+phpParams,
				        headers: {
				        	'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate'
				        }
				    });
				}
			},
			changementMain: function(params){
				if (configService.local){
					return $http({
				        method: 'GET', 
				        url: 'modules/cartes/json/cartes.json'
				    });
				}
				else {
					return $http({
				        method: 'POST', 
				        url: 'modules/cartes/php/cartes-changement-main.php',
			        	params: {
		        			carteId: params.carteId,
		        			main: params.main
		        		},
				        headers: {
				        	'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate'
				        }
				    });
				}				
			}
		}
	}
]);

angular.module('cartes').service('cartesQuestionsPioche',
	['$mdDialog',
	function($mdDialog) {

	var questionsPiocheFunctions = {};

	questionsPiocheFunctions.pioche = function(){
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

	return(questionsPiocheFunctions);
}]);
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('des');

'use strict';

angular.module('des').controller('DesContainerController', ['$scope',
	function($scope) {

		var des_size = {
			rhombo: 6,
			paysage: 12,
			echecs: 6,
			duel: 20,
			labyrinthe: 4
		};

		var des_options = {
			rhombo: [0,0,0,1,1,2],
			paysage: [2,3,4,5,5,7,7,12,16,73],
			echecs: ['Tour','Dame','Dada','Fou','Roi','Stop'],
			duel: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
			labyrinthe: [1,2,3,4]
		};

		function translateResult(de,result){
			if (de == 'rhombo'){
				$scope.partie.dispo.pioches.pioche += result;
			}
		}

		$scope.lanceDe = function(de){
			var rand = Math.floor((Math.random() * des_size[de]));
			$scope.jeu.de = des_options[de][rand];
			$scope.partie.dispo.des[de] --;
			translateResult(de,des_options[de][rand]);
		}

}]);
'use strict';

angular.module('des').directive('redDesContainer', [
	function() {
		return {
			templateUrl: 'modules/des/views/des-container.view.html',
			restrict: 'E'
		};
	}
]);
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('jeu');

'use strict';

angular.module('jeu').controller('JeuContainerController', ['$scope',
	function($scope) {

	$scope.actionsDisponibles = {
		action: true,
		nextAction: true
	}

}]);
'use strict';

angular.module('jeu').controller('JeuMainController', ['$scope','$timeout','Cartes','attaquesActions','AttaquesDefenseService',
	function($scope,$timeout,Cartes,attaquesActions,AttaquesDefenseService) {

	// Mains:

	$scope.focusIndex = -2;

	$scope.focusCarte = function(index){
		if (index == $scope.focusIndex){
			$scope.focusIndex = -2;
		}
		else {
			$scope.focusIndex = index;
		}	
	}

	$scope.utiliserCarte = function(index){
		var carte = $scope.jeu.main[index];
		if (carte.categorie == 'action'){
			$scope.attaque.carteIndex = index;
			attaquesActions.utiliser($scope,carte);
		}
	}

	$scope.ouvrirCarte = function(index){
		var carte = $scope.jeu.main[index];
		carte.main.ouverte = true;
		Cartes.changementMain({
    		carteId: $scope.jeu.main[index].id,
    		main: carte.main
    	}).success(function(){
			$timeout(function(){
				$scope.jeu.ouvertes.push(carte);
			},250);
			$scope.jeu.main.splice(index,1);
			$scope.focusIndex = -2;
    	}).error(function(){

    	})
	}

	$scope.jeterCarte = function(index){
		Cartes.moveCartes({
    		carteIds: [$scope.jeu.main[index].id],
    		position: -2
    	}).success(function(){
    		var carte = $scope.jeu.main[index];
    		carte.main = {};
			$scope.defausses.pioche.push(carte);
			$scope.jeu.main.splice(index,1);
			$scope.focusIndex = -2;
    	}).error(function(){

    	})
	}

	$scope.jeterAttaqueCarte = function(index){
		AttaquesDefenseService.jeterCarte($scope,$scope.jeu.main[index].id);
	}

}]);
'use strict';

angular.module('jeu').controller('JeuOuvertesController', ['$scope','Cartes',
	function($scope,Cartes) {

	$scope.focusIndex = -2;

	$scope.focusCarte = function(index){
		if (index == $scope.focusIndex){
			$scope.focusIndex = -2;
		}
		else {
			$scope.focusIndex = index;
		}	
	}

	$scope.jeterCarte = function(index){
		Cartes.moveCartes({
    		carteIds: [$scope.jeu.ouvertes[index].id],
    		position: -2
    	}).success(function(){
    		var carte = $scope.jeu.ouvertes[index];
    		carte.main = {};
			$scope.defausses.pioche.push(carte);
			$scope.jeu.ouvertes.splice(index,1);
			$scope.focusIndex = -2;
    	}).error(function(){

    	})
    }

}]);
'use strict';

angular.module('jeu').directive('redJeuContainer', [
	function() {
		return {
			templateUrl: 'modules/jeu/views/jeu-container.view.html',
			restrict: 'E'
		};
	}
]);

angular.module('jeu').directive('redJeuMain', [
	function() {
		return {
			templateUrl: 'modules/jeu/views/jeu-main.view.html',
			restrict: 'E'
		};
	}
]);

angular.module('jeu').directive('redJeuOuvertes', [
	function() {
		return {
			templateUrl: 'modules/jeu/views/jeu-ouvertes.view.html',
			restrict: 'E'
		};
	}
]);
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('joueurs');

'use strict';

angular.module('joueurs').controller('JoueursRecapController', ['$scope',
	function($scope) {
		console.log($scope.autresJoueurs)
	$scope.joueurLeftStyle = "{'background-color': '"+$scope.joueurs[$scope.joueurLeft].backgroundColor+"'}";
	$scope.joueurRightStyle = "{'background-color': '"+$scope.joueurs[$scope.joueurRight].backgroundColor+"'}";
}]);
'use strict';

angular.module('joueurs').directive('redJoueursRecapLeft', [
	function() {
		return {
			templateUrl: 'modules/joueurs/views/joueurs-recap-left.view.html',
			restrict: 'E'
		};
	}
]);

angular.module('joueurs').directive('redJoueursRecapRight', [
	function() {
		return {
			templateUrl: 'modules/joueurs/views/joueurs-recap-right.view.html',
			restrict: 'E'
		};
	}
]);
'use strict';

angular.module('joueurs').factory('Joueurs', ['$http','configService',
	function($http,configService) {
		return {
			// Get all the joueurs:
			getJoueurs: function(){
				if (configService.local){
					return $http({
				        method: 'GET', 
				        url: 'modules/joueurs/json/joueurs.json'
				    });
				}
				else {
					return $http({
				        method: 'GET', 
				        url: 'modules/joueurs/php/joueurs.php',
				        headers: {
				        	'Cache-Control': 'no-cache'
				        }
				    });
				}
			}
		}
	}
]);

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('partie');

'use strict';

// Setting up route
angular.module('partie').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider,$urlRouterProvider){
	// Home state routing
	$stateProvider.
	state('partie', {
		url: '/partie/:joueur',
		templateUrl: 'modules/partie/views/partie-general.view.html'
	});

}]);
'use strict';

angular.module('partie').controller('PartieGeneralController', ['$scope','$state','$stateParams','Cartes','Partie','Joueurs','Attaques','AttaquesDefenseService',
	function($scope,$state,$stateParams,Cartes,Partie,Joueurs,Attaques,AttaquesDefenseService) {

	// Tracking if all information has been well retrieved:
	$scope.loaded = {
		partie: false,
		cartes: false,
		joueurs: false,
		defenses: false // integrated
	};

	// Get param:

	$scope.joueurId = $stateParams.joueur;

	// Attaques:

	$scope.attaques = {
		defenses: [],
		recompenses: []
	};

	$scope.defense = {};

	function getAttaques(){
		if ($scope.loaded.joueurs && $scope.loaded.cartes){
			if ($scope.partie.tour_joueur == $scope.joueurId && $scope.partie.tour_action == 0){
				Attaques.get($scope.joueurId).success(function(response){
					for (var i in response){
						if (response[i].categorie == 'attaque'){
							$scope.attaques.defenses.push(response[i]);
						}
						else if (response[i].categorie == 'recompense'){
							$scope.attaques.recompenses.push(response[i]);
						}
						console.log($scope.attaques.defenses);
					}
					$scope.loaded.defenses = true;
					AttaquesDefenseService.startDefense($scope);
				});
			}
			else {
				$scope.loaded.defenses = true;
			}
		}
	}

	// Partie:

	Partie.getPartie().success(function(response){
		$scope.partie = {
			tour_joueur: response[0].tour_joueur,
			tour_action: response[0].tour_action,
			tour_skip: response[0].tour_skip,
			tonalite: response[0].tonalite,
			temps: response[0].temps,
			dispo: response[0].dispo
		};
		getAttaques();
	})

	$scope.resetDispos = function(){
		$scope.partie.dispo = {
			des: {
				rhombo: 0,
				paysage: 0,
				duel: 0,
				echecs: 0,
				labyrinthe: 0
			},
			pioches: {
				pioche: 0,
				questions: 0,
				humeurs: 0,
				missions: 0
			},
			cartes: {
				ouvertures: false,
				main_jeter: false,
				ouvertes_jeter: false,
				utiliser: false
			}
		}
	}

	// Jeu:

	$scope.jeu = {};

	$scope.jeu.de = -1;

	$scope.jeu.main = [];
	$scope.jeu.ouvertes = [];

	//Cartes 

	function getCartes(){
		Cartes.getCartes().success(function(response){
	    	$scope.cartes = {};
	    	for (var i in response){
	    		var carte = response[i];
	    		$scope.cartes[carte.id] = carte;
	    		// Cartes de la pioche:
	    		if (carte.pile == 'pioche'){
	    			if (carte.position == -2){
	    				$scope.defausses.pioche.push(carte);
	    			}
	    			else if (carte.position == -1) {
	    				$scope.pioches.pioche.push(carte);
	    			}
	    			else if (carte.position == $scope.joueurId){
	    				if (carte.main.ouverte){
	    					$scope.jeu.ouvertes.push(carte);
	    				}
	    				else {
	    					$scope.jeu.main.push(carte);
	    				}
	    			}
	    			else if (carte.main.ouverte){
	    				$scope.joueurs[carte.position].ouvertes.push(carte);
	    			}
	    		}
	    	}
			$scope.loaded.cartes = true;
			getAttaques();
	    }).error(function(response){
	    	console.log("Error while trying to get cartes");
	    });
	}

	// Joueurs:

	$scope.joueurs = {
		0 : {},
		1: {},
		2: {}
	};
	$scope.joueur = {};

	Joueurs.getJoueurs().success(function(response){
		var joueur = response[$scope.joueurId]
		$scope.joueur = {
			id: joueur.id,
			nom: joueur.nom,
			diable: joueur.diable,
			belette: joueur.belette,
			notes_titre: joueur.notes_titre,
			notes: joueur.notes
		}
		$scope.joueurs[0] = response[0];
		$scope.joueurs[1] = response[1];
		$scope.joueurs[2] = response[2];
		for (var i in $scope.joueurs){
			$scope.joueurs[i].ouvertes = [];
		}
		getCartes();
	})


	$scope.autresJoueurs = [($scope.joueurId + 2)%3,($scope.joueurId + 1)%3];
	$scope.joueurLeft = ($scope.joueurId + 2)%3;
	$scope.joueurRight = ($scope.joueurId + 1)%3;

	// Pioches et defausses :

	$scope.pioches = {};
	$scope.pioches.pioche = [];
	
	$scope.defausses = {};
	$scope.defausses.pioche = [];

	// Plateaux

	$scope.plateau = -1;

	$scope.plateaux = [
		{
			id: 'paysage',
			nom: 'Plateau Paysage'
		},
		{
			id: 'labyrinthe',
			nom: 'Plateau Labyrinthe'
		},
		{
			id: 'escalier',
			nom: 'Plateau Escalier'
		}
	];

	$scope.goToPlateau = function(plateauId){
		if ($scope.plateau == plateauId){
			$scope.plateau = -1;
		}
		else {
			$scope.plateau = plateauId;
		}
	}

	// Attaques:

	$scope.attaque = {};

	// Actions disponibles

	$scope.actionsDisponibles = {};

}]);
'use strict';

angular.module('partie').controller('PartieTourController', ['$scope','Partie','PartieTourService',
	function($scope,Partie,PartieTourService) {

	$scope.actionsDisponibles.nextAction = true;

	$scope.tourActionNames = {
		0: 'Defense',
		1: 'Ouverture',
		2: 'Piochement',
		3: 'Déplacement',
		4: 'Action de case',
		5: 'Duel',
		6: 'Actions'
	};

	$scope.nextAction = function(){
		PartieTourService.moveTour($scope,1,0);
	}

}]);
'use strict';

angular.module('partie').factory('Partie', ['$http','configService',
	function($http,configService) {
		return {
			// Get all the cartes:
			getPartie: function(){
				if (configService.local){
					return $http({
				        method: 'GET', 
				        url: 'modules/partie/json/partie.json'
				    });
				}
				else {
					return $http({
				        method: 'GET', 
				        url: 'modules/partie/php/partie.php',
				        headers: {
				        	'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate'
				        }
				    });
				}
			},
			changeTour: function(params){
				if (configService.local){
					return $http({
				        method: 'GET', 
				        url: 'modules/cartes/json/cartes.json'
				    });
				}
				else {
					return $http({
				        method: 'POST', 
				        url: 'modules/partie/php/partie-tour-change.php',
				        params: params,
				        headers: {
				        	'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate'
				        }
				    });
				}
			}
		}
	}
]);

'use strict';

angular.module('partie').service('PartieTourService', ['Partie',
	function(Partie) {

	var PartieTourServiceFunctions = {};

	function startAction($scope,tourJoueur,tourAction){
		// Changement de tour: reinitialiser le de et les dispos (cartes, des)
		$scope.jeu.de = -1;
		$scope.resetDispos();
		console.log('starting action : tourJoueur is '+tourJoueur);
		// Lancer la nouvelle action:
		if (tourJoueur == $scope.joueurId){
			console.log(tourAction);
			if (tourAction == 1){
				$scope.partie.dispo.cartes.ouvertures = true;
				$scope.partie.dispo.cartes.ouvertes_jeter = true;
			}
			else if (tourAction == 2){
				$scope.partie.dispo.pioches.pioche ++;
				$scope.partie.dispo.des.rhombo ++;
				$scope.partie.dispo.cartes.main_jeter = true;
			}
			else if (tourAction == 6){
				$scope.partie.dispo.cartes.utiliser = true;
			}
		}
	}

	PartieTourServiceFunctions.moveTour = function($scope,numberTours,skipTours){
		$scope.actionsDisponibles.nextAction = false;
		// Verify if data is consistent
		Partie.getPartie().success(function(response){
			// Data is consistent
			if (true || ($scope.partie.tour_joueur == response[0].tour_joueur && $scope.partie.tour_action == response[0].tour_action && $scope.partie.tour_skip == response[0].tour_skip)){
				var tourJoueur, tourAction, tourSkip;
				tourSkip = $scope.partie.tour_skip;
				tourSkip[$scope.joueurId] += skipTours;
				// changement de joueur:
				if ($scope.partie.tour_action + numberTours > 6){
					var joueurFound = false;
					tourAction = 0;
					tourJoueur = ($scope.partie.tour_joueur + 1) % 3;
					while (!joueurFound){
						if (tourSkip[tourJoueur] > 0){
							tourSkip[tourJoueur] --;
							tourJoueur = (tourJoueur + 1) % 3;
						}
						else {
							joueurFound = true;
						}
					}
				}
				// pas de changement de joueur:
				else {
					tourAction = $scope.partie.tour_action + numberTours;
					tourJoueur = $scope.partie.tour_joueur;
				}
				startAction($scope,tourJoueur,tourAction);
				Partie.changeTour({
					tour_joueur: tourJoueur,
					tour_action: tourAction,
					tour_skip: JSON.stringify(tourSkip),
					dispo: $scope.partie.dispo
				}).success(function(){
					// Changement de tour: updater variables locales
					$scope.partie.tour_joueur = tourJoueur;
					$scope.partie.tour_action = tourAction;
					$scope.actionsDisponibles.nextAction = true;
				}).error(function(){
					$scope.actionsDisponibles.nextAction = true;
				});
			}
			// Data is not consistent
			else {
				$scope.partie = {
					tour_joueur: response[0].tour_joueur,
					tour_action: response[0].tour_action,
					tour_skip: response[0].tour_skip,
					tonalite: response[0].tonalite,
					temps: response[0].temps,
					dispo: response[0].dispo
				};
				$scope.jeu.de = -1;
				$scope.actionsDisponibles.nextAction = true;
			}
		}).error(function(){
			$scope.actionsDisponibles.nextAction = true;
		});
	}

	return(PartieTourServiceFunctions);

}]);
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('plateaux');

'use strict';

angular.module('plateaux').controller('PlateauxGeneralController', ['$scope','$state',
	function($scope,$state) {



}]);
'use strict';

angular.module('plateaux').controller('PlateauxPaysageController', ['$scope','$state','$stateParams',
	function($scope,$state,$stateParams) {

		// Initialiser plateau paysage:
		$scope.plateauPaysage = [];
		
		for (var i = 0;i < 14;i ++){
			$scope.plateauPaysage.push({
				id: i,
				colonnes: []
			});
			for (var j = 0;j < 24;j ++){
				var numero = Math.floor((Math.random() * 1000) + 1);
				var question = Math.random();
				var action = Math.random();
				var achat = Math.random();
				var paysagesNoms = ['Desert','Ville','Foret','Marecage','Mer','Royaume des tenebres','Montagne','Village','Prairie'];
				var paysageIndex = Math.floor((Math.random() * 8));
				var paysage2 = Math.random();
				if (paysage2 > 0.7){
					var paysageIndex2 = Math.floor((Math.random() * 8));
					var zones = [paysagesNoms[paysageIndex],paysagesNoms[paysageIndex2]];
				}
				else {
					var zones = [paysagesNoms[paysageIndex]];
				}
				$scope.plateauPaysage[i].colonnes.push({
					id: j,
					numero: numero,
					question: question > 0.7,
					zones: zones,
					action: action > 0.75,
					achat: achat > 0.6 
				});
			}
		}

		$scope.selectedCase = {
			clicked: false,
			ligneId: -1,
			colonneId: -1
		};

		$scope.selectCase = function(ligneId,colonneId){
			if ($scope.selectedCase.ligneId == ligneId && $scope.selectedCase.colonneId == colonneId){
				$scope.selectedCase.clicked = false;
				$scope.selectedCase.ligneId = -1;
				$scope.selectedCase.colonneId = -1;
			}
			else {
				$scope.selectedCase.clicked = true;
				$scope.selectedCase.ligneId = ligneId;
				$scope.selectedCase.colonneId = colonneId;
			}
		}

}]);
'use strict';

angular.module('plateaux').directive('redPlateauxPaysage', [
	function() {
		return {
			templateUrl: 'modules/plateaux/views/plateaux-paysage.view.html',
			restrict: 'E'
		};
	}
]);

angular.module('plateaux').directive('redPlateauxLabyrinthe', [
	function() {
		return {
			templateUrl: 'modules/plateaux/views/plateaux-labyrinthe.view.html',
			restrict: 'E'
		};
	}
]);

angular.module('plateaux').directive('redPlateauxEscalier', [
	function() {
		return {
			templateUrl: 'modules/plateaux/views/plateaux-escalier.view.html',
			restrict: 'E'
		};
	}
]);