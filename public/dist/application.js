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

angular.module(ApplicationConfiguration.applicationModuleName).config(function($mdThemingProvider, $mdIconProvider){
	// TODO: add configurations here
	$mdThemingProvider.theme('default')
		.primaryPalette('light-blue', {
		})
});

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

angular.module(ApplicationConfiguration.applicationModuleName).run(function($http, $httpBackend) {
	$http.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
	$http.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
	$http.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
});



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
ApplicationConfiguration.registerModule('cartes');

'use strict';

// Setting up route
angular.module('cartes').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider,$urlRouterProvider){
	// Home state routing
	$stateProvider.
	state('cartes', {
		url: '/cartes',
		templateUrl: 'modules/cartes/views/cartes.view.html'
	});

}]);
'use strict';

angular.module('cartes').controller('CartesCarteController', ['$scope',
	function($scope) {
}]);
'use strict';

angular.module('cartes').controller('CartesCreationCirconstancesController', ['$scope',
	function($scope) {

	$scope.retirerElement = function(type,object){
		console.log(object[type])
		if (object[type].length == 1){
			object[type] = [];
		}
		else if (object[type].length == 2){
			object[type] = [1];
		}
		else if (object[type].length == 3){
			object[type] = [1,2];
		}
	}
	$scope.ajouterElement = function(type,object){
		console.log('ajouter');
		if (object[type].length == 0){
			object[type] = [1];
		}
		else if (object[type].length == 1){
			object[type] = [1,2];
		}
		else if (object[type].length == 2){
			object[type] = [1,2,3];
		}
	}


	// Options de cartes:

	var cases = [];
	var zones = ['Désert','Forêt','Mer','Marécages','Monde onirique','Montagne','Prairie','Royaume des ténèbres','Village','Ville','Zone industrielle'];
	var typesObjets = ['Animal','Chat','Combustible','Electrique','Insecte','Marin','Métallique','Potion bénéfique','Potion malefique','Toxique'];
	var typesActions = ['Combustible','Faim','Insecte','Nuit','Soif','Toxique'];
	var typesHumeurs = ['Négative','Russe','Triste'];
	var deplacement_avantages = ["Crapauduc","Respiration sous l'eau","Vitesse doublée"];


	$scope.circonstances = {
		'Action de case': [],
		'Action': {
			'Défense': []
		},
		"Changement d'humeur": [],
		'Défausse': [],
		'Déplacement': [],
		'Duel': {
			'Attaque': [],
			'Défense': []
		},
		'Dé': {
			'Paysage': [2,3,4,5,7,12,16,73]
		},
		'Echange': [],
		'Interlude musical': [],
		'Mission': {
			'Pioche': [],
			'Réussie': []
		},
		'Montée de marche': {
			'Tentative': [],
			'Réussie': [],
			'Echouée': []
		},
		'Question': {
			'Posée': [],
			'Répondue correctement': [],
			'Répondue faussement': []
		},
		'Trois familles': [],
		"Utilisation d'objet": [],
		'Valise non matérialisée': []
	};

}]);
'use strict';

angular.module('cartes').controller('CartesCreationConsequencesController', ['$scope',
	function($scope) {

	$scope.retirerElement = function(type,object){
		console.log(object[type])
		if (object[type].length == 1){
			object[type] = [];
		}
		else if (object[type].length == 2){
			object[type] = [1];
		}
		else if (object[type].length == 3){
			object[type] = [1,2];
		}
	}
	$scope.ajouterElement = function(type,object){
		console.log('ajouter');
		if (object[type].length == 0){
			object[type] = [1];
		}
		else if (object[type].length == 1){
			object[type] = [1,2];
		}
		else if (object[type].length == 2){
			object[type] = [1,2,3];
		}
	}


	// Options de cartes:

	var cases = [];
	var zones = ['Désert','Forêt','Mer','Marécages','Monde onirique','Montagne','Prairie','Royaume des ténèbres','Village','Ville','Zone industrielle'];
	var typesObjets = ['Animal','Chat','Combustible','Electrique','Insecte','Marin','Métallique','Potion bénéfique','Potion malefique','Toxique'];
	var typesActions = ['Combustible','Faim','Feu','Insecte','Nuit','Soif','Toxique'];
	var typesHumeurs = ['Négative','Russe','Triste'];
	var deplacement_avantages = ["Crapauduc","Respiration sous l'eau","Vitesse doublée"];

	$scope.consequences = {
		'Action : contrer': {
			'Annulation': [],
			'Renvoi': ['Contre le lanceur',"Contre n'importe qui"]
		},
		'Belette': {
			"Brouiller l'ordre": [],
			'Réduire nombre requis': [1,2,3,4,5,6]
		},
		'Carte': {
			'Défausse': [1,2,3,4,5,'Moitié','Toutes'],
			'Don': [1,2,3,4,5,'Moitié','Toutes'],
			'Pioche': [1,2,3,4,5,6,7],
			'Récuperation': [1,2,3],
			'Vol': [1,2,3,4,5,'Moitié','Toutes']
		},
		'Carte ouverte': {
			'Défausse': [1,2,3,4,5,'Toutes'],
			'Don': [1,2,3,4,5,'Toutes'],
			'Vol': [1,2,3,4,5,'Toutes']
		},
		'Combat': {
			'Remporter': [],
			'Voler récompense': []
		},
		'Dé': {
			'Labyrinthe': ['Doubler','Relancer'],
			'Paysage': ['Doubler','Relancer']
		},
		'Déplacement': {
			'Avantage': deplacement_avantages,
			'Case': cases,
			'Nombre de cases': [1,2,3,4,5,6,7,8,9,10],
			'Zone': zones
		},
		'Duel': {
			'Bonus attaque': [1,2,3,4,5,6,7,8,9,10,11,12],
			'Bonus défense': [1,2,3,4,5,6,7,8,9,10,11,12],
			'Bonus attaque et défense': [1,2,3,4,5,6,7,8,9,10,11,12],
			'Changement congruence (deux joueurs)': [15,18,20],
			'Changement récompense': ['Vol'],
			'Double-tranchant': [],
			'Gagner': []
		},
		'Grande carte': {
			'Pioche': [1,2,3]
		},
		'Lecture': {
			'Princesse de Clèves': []
		},
		'Mission': {
			'Pioche': [1],
			'Remplacer objet requis': [1,2,3]
		},
		'Modulation': {
			'Modulation': ['Fi mineur','La majeur','Ré mineur']
		},
		'Montée de marche': {
			'Jeu': ['Echouer','Gagner','Rejouer']
		},
		'Objet': {
			'Création': ['Photo'],
			'Transformation': []
		},
		'Protection': {
			'Cartes': [1,2,3,4,5,'Toutes'],
			'Grandes cartes': [1,2,3,4,5,'Toutes'],
			'Type': typesActions
		},
		'Tour': {
			'Inverser': [],
			'Passer': [1,2,3],
			'Rejouer': [1,2,3]
		},
		'Trois familles': {
			'Remplacer membre requis': [1,2,3,4,5]
		}
	};

}]);
'use strict';

angular.module('cartes').controller('CartesCreationContraintesController', ['$scope',
	function($scope) {

	$scope.objets = [
		{types:[],
		consequences: [1],
		contraintes: [],
		moments: [1],
		pouvoirs: [1]},
		{types:[],
		consequences: [1],
		contraintes: [],
		moments: [1],
		pouvoirs: [1]}
	];
	console.log("in controller")
	$scope.retirerElement = function(type,object){
		console.log(object[type])
		if (object[type].length == 1){
			object[type] = [];
		}
		else if (object[type].length == 2){
			object[type] = [1];
		}
		else if (object[type].length == 3){
			object[type] = [1,2];
		}
	}
	$scope.ajouterElement = function(type,object){
		console.log('ajouter');
		if (object[type].length == 0){
			object[type] = [1];
		}
		else if (object[type].length == 1){
			object[type] = [1,2];
		}
		else if (object[type].length == 2){
			object[type] = [1,2,3];
		}
	}


	// Options de cartes:

	var cases = [];
	var zones = ['Désert','Forêt','Mer','Marécages','Monde onirique','Montagne','Prairie','Royaume des ténèbres','Village','Ville','Zone industrielle'];
	var typesObjets = ['Animal','Chat','Combustible','Electrique','Insecte','Marin','Métallique','Potion bénéfique','Potion malefique','Toxique'];
	var typesActions = ['Combustible','Faim','Insecte','Nuit','Soif','Toxique'];
	var typesHumeurs = ['Négative','Russe','Triste'];
	var deplacement_avantages = ["Crapauduc","Respiration sous l'eau","Vitesse doublée"];

	$scope.contraintes = {
		'Carte': {
			'Spécifique': []
		},
		'Carte ouverte': {
			'Chez le lanceur': [],
			"Chez n'importe qui": []
		},
		'Joueur': {
			'Adversaire': ['Julia','Marie','Romain']
		},
		'Position': {
			'Case': [],
			'Plateau': ['Escalier','Labyrinthe','Paysage'],
			'Zone': zones
		},
		"Type de carte": {
			"Action": typesActions,
			"Humeur": typesHumeurs,
			"Objet": typesObjets
		}
	};

}]);
'use strict';

angular.module('cartes').controller('CartesCreationHorsPiocheController', ['$scope',
	function($scope) {
		$scope.reductions = ['Aucune','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];
}]);
'use strict';

angular.module('cartes').controller('CartesCreationMissionController', ['$scope','Cartes',
	function($scope,Cartes) {

	$scope.retirerElement = function(type,object){
		console.log(object[type])
		object[type].splice(object[type].indexOf(object[type].length),1);
	}
	$scope.ajouterElement = function(type,object){
		console.log(object);
		object[type].push(object[type].length + 1);
		console.log(object[type]);
	}
	$scope.ajouterCarte = function(index){
		console.log(index);
		$scope.carte.info.etapes[index].cartes.push($scope.carte.info.etapes[index].cartes.length + 1);
	}
	$scope.retirerCarte = function(index){
		$scope.carte.info.etapes[index].cartes.splice($scope.carte.info.etapes[index].cartes.length-1,1);
	}
	$scope.retirerEtape = function(){
		$scope.carte.info.etapes.splice($scope.carte.info.etapes.length-1,1);
	}
	$scope.ajouterEtape = function(){
		$scope.carte.info.etapes.push({
			cartes: [1],
			cases: [1]
		});
	}

	var cartesCodes = [];
	$scope.cartesNoms = [];
	Cartes.getCartes().success(function(response){
		for (var i in response){
			// agreger cartes par code:
			if (response[i].pile === 'pioche' || response[i].pile === 'hors_pioche' && cartesCodes.indexOf(response[i].code < 0)){
				cartesCodes.push(response[i].code);
				$scope.cartesNoms.push(response[i].nom);
			}
		}
	});

	var zones = ['Désert','Forêt','Mer','Marécages','Monde onirique','Montagne','Prairie','Royaume des ténèbres','Village','Ville','Zone industrielle'];
	console.log($scope.cartes);
	$scope.missions = {
		'Apporter des cartes': {
			'Cartes': [1],
			'Case': $scope.cases
		},
		'Réunir des cartes': {
			'Cartes': [1]
		},
		'Remporter des duels': {
			'Joueurs': []
		},
		'Visiter des cases': {
			'Cases': $scope.cases
		},
		'Visiter des zones': {
			'Zones': $scope.zones
		}
	};

}]);
'use strict';

angular.module('cartes').controller('CartesJeterController', ['$scope','$rootScope',
	function($scope,$rootScope) {

	function jeterCarte(carte){
		var carteJetee = false;
		for (var i in $scope.cartes.liste){
			if ($scope.cartes.liste[i].id == carte.id){
				carteJetee = true;
			}
		}
		if (!carteJetee){
			var foundSpot = false;
			var i = 0;
			while (i < $scope.quantite && !foundSpot){
				if (!$scope.cartes.liste[i].filled){
					$scope.cartes.liste[i] = carte;
					$scope.cartes.liste[i].filled = true;
					foundSpot = true;
					$scope.cartes.filled ++;
				}
				// On a tout rempli:
				if ($scope.cartes.filled == $scope.quantite){
					console.log('full cartes');
					$scope.$emit('cartes-jeter-full',{cartes: $scope.cartes.liste});
				}
				i ++;
			}
		}
	}

	$scope.removeCarte = function(index){
		$scope.cartes.liste[index] = {};
		$scope.cartes.filled --;
		$scope.$emit('cartes-jeter-notfull', {});
	}

	$rootScope.$on('cartes-jeter-id', function(event, args) {
		jeterCarte(args.carte);
	});

	var initializeCartesObject = function(){
		$scope.cartes = {
			liste: [],
			filled: 0
		};
		for (var i = 0; i < $scope.quantite; i ++){
			$scope.cartes.liste.push({});
		}
		if ($scope.quantite === 0){
			$scope.description = "Tu n'as plus de cartes de toute façon";
			$scope.$emit('cartes-jeter-full',{cartes: []});
		}
	}
	initializeCartesObject();
	$rootScope.$on('cartes-jeter-start-callback', function(event, args) {
		if (args.nombreDeCartes < $scope.quantite){
			$scope.quantite = args.nombreDeCartes;
		}
		initializeCartesObject();
	});

	$scope.$emit('cartes-jeter-start', {boutonName: $scope.boutonName});

}]);
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

	$scope.carteMission = function(){
		$scope.piochesDisponibles = false;
		// Cas ou il reste des cartes quelque part:
		if ($scope.pioches.missions.length > 0){
			var carteOrder = Math.floor(Math.random() * $scope.pioches.missions.length);
			Cartes.moveCartes({
	    		carteIds: [$scope.pioches.missions[carteOrder].id],
	    		position: $scope.joueurId
	    	}).success(function(){
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
		        $scope.jeu.missions.push($scope.pioches.missions[carteOrder]);
		        // Retirer la carte de la pioche
				$scope.pioches.missions.splice(carteOrder,1);
				$scope.piochesDisponibles = true;
				$scope.partie.dispo.pioches.missions --;
	    	}).error(function(){
	    		$scope.piochesDisponibles = true;
	    	})
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
	        $scope.partie.dispo.pioches.missions --;
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

angular.module('cartes').controller('CartesController', ['$scope','$state','$http','Cartes','Objets','CartesProprietes',
	function($scope,$state,$http,Cartes,Objets,CartesProprietes) {

	// Tabs and navigation:

	$scope.tabs = [
		{id: 'toutes',nom: 'Toutes'},
		{id: 'pioche',nom: 'Pioche'},
		{id: 'objets',nom: 'Objets'},
		{id: 'hors_pioche',nom: 'Hors Pioche'},
		{id: 'humeurs',nom: 'Humeurs'},
		{id: 'missions',nom: 'Missions'},
		{id: 'nouvelle_carte',nom:'Nouvelle carte'}
	];

	$scope.focusedTab = 0;

	$scope.view = 'table_cartes';


	$scope.formSubmitted = false;

	$scope.changeTab = function(index){
		if ($scope.focusedTab === 6 && index !== 6){
			initializeCartes();	
		}
		$scope.focusedTab = index;
		if ($scope.tabs[index].id != 'nouvelle_carte' && $scope.tabs[index].id != 'objets'){
			$scope.cartesTable = $scope.cartes[$scope.tabs[index].id];
			$scope.view = 'table_cartes';
			$scope.formSubmitted = false;
		}
		else if ($scope.tabs[index].id === 'objets'){
			$scope.cartesTable = $scope.cartes.objets;
			$scope.view = 'table_objets';
			$scope.formSubmitted = false;			
		}
		else {
			$scope.view = 'nouvelle_carte';
			$scope.carte = {
				consequences: [1],
				contraintes: [],
				circonstances: [1],
				info: {
					etapes: [{
						cartes: [1],
						cases: [1]
					}]
				}
			};
			$scope.objets = [
				{types:[],
				consequences: [1],
				contraintes: [],
				circonstances: [1]},
				{types:[],
				consequences: [1],
				contraintes: [],
				circonstances: [1]}
			];
		}
	}

	function keyToTextTransformation(carte,type){
		console.log(carte);
		if (type === 'carte'){
			carte.pile = CartesProprietes[carte.pile];
			carte.categorie = CartesProprietes[carte.categorie];
			carte.utilisation = CartesProprietes[carte.utilisation[0]];
		}
		else if (type === 'objet'){
			carte.utilisation = CartesProprietes[carte.utilisation];
		}
		if (carte.categorie == 'Action'){
			carte.info.action.type = CartesProprietes[carte.info.action.type];
			carte.info.cible = CartesProprietes[carte.info.cible];
		}
		if (carte.pile === 'Missions'){
			for (var i in carte.info.etapes){
				carte.info.etapes[i].categorie = CartesProprietes[carte.info.etapes[i].categorie]
				for (var j in carte.info.etapes[i].cartes){
					carte.info.etapes[i].cartes[j] = $scope.cartes.toutes[carte.info.etapes[i].cartes[j]].nom;
				}
			}
		}
		for (var i in carte.types){
			carte.types[CartesProprietes[i]] = carte.types[i];
		}
		console.log(carte.types);
		var proprietes = ['consequences','contraintes','circonstances'];
		for (var i in proprietes){
			var prop = proprietes[i];
			carte[prop] = [];
			if (carte.info[prop] !== undefined){
				for (var i in carte.info[prop]){
					carte[prop].push(i+1);
					carte.info[prop][0].categorie = CartesProprietes[carte.info[prop][0].categorie];
					carte.info[prop][0].type = CartesProprietes[carte.info[prop][0].type];
					carte.info[prop][0].valeur = CartesProprietes[carte.info[prop][0].valeur];
				}
			}
			if (carte.info.exclusivite !== undefined && carte.info.exclusivite[prop] !== undefined){
				if (carte.info.exclusivite[prop]){
					carte.info.exclusivite[prop] = 'Exclusives';
				}
				else {
					carte.info.exclusivite[prop] = 'Non exclusives';
				}
			}
		}
	}

	$scope.modifierCarte = function(code){
		console.log(code);
		$scope.carte = {
			consequences: [1],
			contraintes: [],
			circonstances: [1]
		};
		$scope.carte = $scope.cartes.toutes[code];
		if ($scope.carte.pile === 'pioche' && $scope.carte.categorie === 'objet'){
			$scope.objets = [
				{types:[],
				consequences: [1],
				contraintes: [],
				circonstances: [1]},
				{types:[],
				consequences: [1],
				contraintes: [],
				circonstances: [1]}
			];
			$scope.objets[0] = $scope.cartes.objets[$scope.carte.info[0]];
			keyToTextTransformation($scope.objets[0],'objet');
			$scope.objets[1] = $scope.cartes.objets[$scope.carte.info[1]];
			keyToTextTransformation($scope.objets[1],'objet');
		}
		console.log($scope.carte);
		keyToTextTransformation($scope.carte,'carte');
		$scope.view = 'modifier_carte';
		$scope.focusedTab = 6;
	}

	// Get cartes

	function initializeCartes(){
		Cartes.getCartes().success(function(response){
			$scope.cartes = {
				'toutes': {},
				'pioche': {},
				'objets': {},
				'hors_pioche': {},
				'humeurs': {},
				'missions': {}
			};
			for (var i in response){
				// agreger cartes par code:
				if ($scope.cartes.toutes[response[i].code] === undefined){
					$scope.cartes.toutes[response[i].code] = response[i];
					$scope.cartes.toutes[response[i].code].statuts = [response[i].statut];
					$scope.cartes[response[i].pile][response[i].code] = response[i];
				}
				else {
					$scope.cartes.toutes[response[i].code].statuts.push([response[i].statut]);
				} 
			}
			$scope.cartesTable = $scope.cartes.toutes;
			Objets.getObjets().success(function(responseObjets){
				for (var i in responseObjets){
					// agreger objets par code:
					if ($scope.cartes.objets[responseObjets[i].code] === undefined){
						$scope.cartes.objets[responseObjets[i].code] = responseObjets[i];
					}
				}
				console.log($scope.cartesTable);
			});
		});
	}
	initializeCartes();

	var cartesCodes = [];
	$scope.cartesNoms = [];
	Cartes.getCartes().success(function(response){
		for (var i in response){
			// agreger cartes par code:
			if (response[i].pile === 'pioche' || response[i].pile === 'hors_pioche' && cartesCodes.indexOf(response[i].code < 0)){
				cartesCodes.push(response[i].code);
				$scope.cartesNoms.push(response[i].nom);
			}
		}
	});

	$scope.retirerElement = function(type,object){
		console.log(object[type])
		if (object[type].length == 1){
			object[type] = [];
		}
		else if (object[type].length == 2){
			object[type] = [1];
		}
		else if (object[type].length == 3){
			object[type] = [1,2];
		}
	}
	$scope.ajouterElement = function(type,object){
		if (object[type].length == 0){
			object[type] = [1];
		}
		else if (object[type].length == 1){
			object[type] = [1,2];
		}
		else if (object[type].length == 2){
			object[type] = [1,2,3];
		}
	}


	// Options de cartes:

	var cases = [];
	$scope.cases = [];
	$http({
        method: 'GET', 
        url: 'modules/plateaux/json/plateaux-paysage.json'
    }).success(function(response){
    	for (var i in response){
    		for (var j in response[i].colonnes){
    			if ($scope.cases.indexOf(response[i].colonnes[j].numero) < 0){
    				$scope.cases.push(response[i].colonnes[j].numero);
    			}
    		}
    	}
    });
	var zones = ['Désert','Forêt','Mer','Marécages','Monde onirique','Montagne','Prairie','Royaume des ténèbres','Village','Ville','Zone industrielle'];
	var typesObjets = ['Animal','Chat','Combustible','Comestible','Electrique','Insecte','Marin','Métallique','Potion bénéfique','Potion malefique','Toxique'];
	var typesActions = ['Combustible','Faim','Insecte','Nuit','Soif','Toxique'];
	var typesHumeurs = ['Négative','Russe','Triste'];
	var deplacement_avantages = ["Crapauduc","Respiration sous l'eau","Vitesse doublée"];

	$scope.piles = {
		'Pioche': {
			'categories': {
				'Objet': {
					'utilisations': [
						'Action',
						'Réaction',
						'Ouverture'
					],
					'types': typesObjets
				},
				'Action': {
					'utilisations': [
						'Action'
					],
					'info': {
						'actions': {
							'types': ['Immédiat','Piège','Test']
						},
						'cibles': ['Lanceur','Adversaire','Tout le monde','Deux joueurs']
					},
					'types': typesActions
				},
				'Combat': {
					'utilisations': [
						'Ouverture'
					]
				},
				'Effet immédiat': {
					'utilisations': [
						'Immédiat'
					]
				},
				'Grande carte': {
					'utilisations': [
						'Ouverture'
					]
				},
				'Orc': {
					'utilisations': [
						'Ouverture'
					]
				},
				'Personnage': {
					'utilisations': [
						'Ouverture',
						'Action'
					]
				},		
			}
		},
		'Hors Pioche': {
			'categories': {
				'Objet': {
					'utilisations': [
						'Action',
						'Réaction',
						'Ouverture'
					]
				},
				'Grande carte': {}
			}
		},
		'Humeurs': {
			'categories': {
				'Humeur': {}
			}
		},
		'Missions': {
			'categories': {
				'Normale': {},
				'Spéciale': {}
			}
		}
	};

    function replaceSpecialCharacters(string){
		string = string.replace(" : ", "_");
		string = string.replace(" ", "_");
		string = string.replace("-", "_");
		string = string.replace("é","e");
		string = string.replace("è","e");
		string = string.replace("ê","e");
		string = string.replace("'","_");
		string = string.replace("(","");
		string = string.replace(")","");
		return(string);    	
    }

    function textToKeyTransformation(string){
    	if (typeof string == 'string'){
    		for (var i = 0;i < 6;i ++){
	    		string = replaceSpecialCharacters(string);
    		}
    		string = string.toLowerCase();
    	}
    	return(string);
    	
    }

    $scope.submitButtonDisabled = false;
    $scope.carteSubmitted = false;

    function populateInfo(newObject,previousObject){
    	console.log(newObject);
		for (var i in previousObject.consequences){
			newObject.consequences.push({
				categorie: textToKeyTransformation(previousObject.consequences[i].categorie),
				type: textToKeyTransformation(previousObject.consequences[i].type),
				valeur: textToKeyTransformation(previousObject.consequences[i].valeur)
			});
		}
		for (var i in previousObject.contraintes){
			newObject.contraintes.push({
				categorie: textToKeyTransformation(previousObject.contraintes[i].categorie),
				type: textToKeyTransformation(previousObject.contraintes[i].type),
				valeur: textToKeyTransformation(previousObject.contraintes[i].valeur)
			});
		}
		for (var i in previousObject.circonstances){
			newObject.circonstances.push({
				categorie: textToKeyTransformation(previousObject.circonstances[i].categorie),
				type: textToKeyTransformation(previousObject.circonstances[i].type),
				valeur: textToKeyTransformation(previousObject.circonstances[i].valeur)
			});
		}
		if (previousObject.exclusivite !== undefined){
			newObject.exclusivite = {
				contrainte: previousObject.exclusivite.contraintes === 'Exclusives',
				consequence: previousObject.exclusivite.consequences === 'Exclusives',
				circonstance: previousObject.exclusivite.circonstances === 'Exclusives'
			};
		}
    }

	$scope.submitForm = function(){
		console.log($scope.carte);
		$scope.submitButtonDisabled = true;
		// Transfer objet info:
		if ($scope.carte.pile == 'Pioche' && $scope.carte.categorie == 'Objet'){
			var utilisation = [textToKeyTransformation($scope.objets[0].utilisation),textToKeyTransformation($scope.objets[1].utilisation)];
			console.log(utilisation);
		}
		else {
			var utilisation = [textToKeyTransformation($scope.carte.utilisation)];
		}

		var carte = {
			nom: $scope.carte.nom,
			code: $scope.carte.code,
			pile: textToKeyTransformation($scope.carte.pile),
			categorie: textToKeyTransformation($scope.carte.categorie),
			utilisation: JSON.stringify(utilisation),
			types: {},
			info: {},
			statut: {}
		}

		for (var i in $scope.carte.types){
			carte.types[textToKeyTransformation(i)] = $scope.carte.types[i];
		}

		// Transfer carte info:

		if (carte.pile == 'pioche'){
			if (carte.categorie == 'action'){
				carte.info = {
					action: {
						type: textToKeyTransformation($scope.carte.info.action.type)
					},
					cible: textToKeyTransformation($scope.carte.info.cible),
					consequences: [],
					contraintes: [],
					circonstances: []
				}
				populateInfo(carte.info,$scope.carte.info);
			}
			else if (carte.categorie == 'objet'){
				carte.info = {
					0: $scope.objets[0].code,
					1: $scope.objets[1].code
				}
				var objets = [];
				for (var i in $scope.objets){
					objets.push({
						nom: $scope.objets[i].nom,
						code: $scope.objets[i].code,
						types: {},
						description: $scope.objets[i].description,
						utilisation: textToKeyTransformation($scope.objets[i].utilisation),
						info: {
							consequences: [],
							contraintes: [],
							circonstances: []
						},
						statut: {}
					});
					populateInfo(objets[i].info,$scope.objets[i].info);
					for (var j in $scope.objets[i].types){
						objets[i].types[textToKeyTransformation(j)] = $scope.objets[i].types[j];
					}
				}
			}
		}

		else if (carte.pile === 'hors_pioche'){
			if (carte.categorie === 'objet'){
				carte.info = {
					case: textToKeyTransformation($scope.carte.info.case),
					prix: textToKeyTransformation($scope.carte.info.prix),
					reduction: textToKeyTransformation($scope.carte.info.reduction),
					consequences: [],
					contraintes: [],
					circonstances: []
				}
				populateInfo(carte.info,$scope.carte.info);
			}
		}

		else if (carte.pile === 'missions'){
			carte.info = {
				etapes: []
			}
			for (var i in $scope.carte.info.etapes){
				carte.info.etapes.push({
					categorie: textToKeyTransformation($scope.carte.info.etapes[i].categorie),
					case: $scope.carte.info.etapes[i].case,
					cartes: []
				});
				if ($scope.carte.info.etapes[i].cartes !== undefined){
					for (var j in $scope.carte.info.etapes[i].cartes){
						var carteNom = $scope.carte.info.etapes[i].cartes[j];
						var carteCode = cartesCodes[$scope.cartesNoms.indexOf(carteNom)];
						carte.info.etapes[i].cartes.push(carteCode);
					}
				}
			}
		}

		console.log($scope.view);
		if ($scope.view === 'nouvelle_carte'){
			Cartes.createCarte(carte).success(function(){
				console.log(carte);
				$scope.submitButtonDisabled = false;
				$scope.carteSubmitted = true;
				$scope.carteImageFileName = "cartes_"+carte.pile+"_"+carte.code+".png";
				if (carte.pile == 'pioche' && carte.categorie == 'objet'){
					Objets.createObjet(objets[0]);
					Objets.createObjet(objets[1]);
					console.log(objets);
				}
			}).error(function(){
				console.log('error');
				$scope.submitButtonDisabled = false;
			});
		}
		else {
			console.log('here')
			carte.id = $scope.carte.id;
			Cartes.modifierCarte(carte).success(function(){
				if (carte.pile == 'pioche' && carte.categorie == 'objet'){
					objets[0].id = $scope.objets[0].id;
					objets[1].id = $scope.objets[1].id;
					console.log(objets);
					Objets.modifierObjet(objets[0]);
					Objets.modifierObjet(objets[1]);
					console.log(objets);
				}
				$scope.changeTab(0);
				$scope.submitButtonDisabled = false;
			}).error(function(){
				console.log('error');
				$scope.submitButtonDisabled = false;
			});			
		}
	}

	$scope.carteSupplementaire = function(){
		$scope.carte = {};

		$scope.objets = [
			{types:[]},
			{types:[]}
		];
		$scope.carteSubmitted = false;
	}

}]);
'use strict';

angular.module('cartes').directive('redCartesCreationConsequences', [
	function() {
		return {
			templateUrl: 'modules/cartes/views/cartes-creation-consequences.view.html',
			restrict: 'E',
		    scope: {
		      carte:"="
		    }
		};
	}
]);

angular.module('cartes').directive('redCartesCreationContraintes', [
	function() {
		return {
			templateUrl: 'modules/cartes/views/cartes-creation-contraintes.view.html',
			restrict: 'E',
		    scope: {
		      carte:"="
		    }
		};
	}
]);

angular.module('cartes').directive('redCartesCreationCirconstances', [
	function() {
		return {
			templateUrl: 'modules/cartes/views/cartes-creation-circonstances.view.html',
			restrict: 'E',
		    scope: {
		      carte:"="
		    }
		};
	}
]);

angular.module('cartes').directive('redCartesCreationMission', [
	function() {
		return {
			templateUrl: 'modules/cartes/views/cartes-creation-mission.view.html',
			restrict: 'E'
		};
	}
]);

angular.module('cartes').directive('redCartesCreationHorsPioche', [
	function() {
		return {
			templateUrl: 'modules/cartes/views/cartes-creation-hors-pioche.view.html',
			restrict: 'E'
		};
	}
]);

angular.module('cartes').directive('redCarte', [
	function() {
		return {
			templateUrl: 'modules/cartes/views/cartes-carte.view.html',
			restrict: 'E',
		    scope: {
		      carte: "=",
		      focused: "=",
		      focusCarte: "&",
		      index: "="
		    }
		};
	}
]);

angular.module('cartes').directive('redCartesJeter', [
	function() {
		return {
			templateUrl: 'modules/cartes/views/cartes-jeter.view.html',
			restrict: 'E',
		    scope: {
		      quantite: "=",
		      description: "=",
		      boutonName: "="
		    }
		};
	}
]);
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
			createCarte: function(params){
				if (configService.local){
					return $http({
				        method: 'GET', 
				        url: 'modules/cartes/json/cartes.json'
				    });
				}
				else {
					return $http({
				        method: 'POST', 
				        url: 'modules/cartes/php/cartes-create.php',
			        	params: params,
			        	statut: {},
				        headers: {
				        	'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate'
				        }
				    });
				}				
			},
			modifierCarte: function(params){
				if (configService.local){
					return $http({
				        method: 'GET', 
				        url: 'modules/cartes/json/cartes.json'
				    });
				}
				else {
					return $http({
				        method: 'POST', 
				        url: 'modules/cartes/php/cartes-modifier.php',
			        	params: params,
			        	statut: {},
				        headers: {
				        	'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate'
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
		        			statut: params.statut
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

'use strict';

angular.module('cartes').factory('Objets', ['$http','configService',
	function($http,configService) {
		return {
			// Get all the objets:
			getObjets: function(){
				if (configService.local){
					return $http({
				        method: 'GET', 
				        url: 'modules/cartes/json/objets.json'
				    });
				}
				else {
					return $http({
				        method: 'GET', 
				        url: 'modules/cartes/php/objets.php',
				        headers: {
				        	'Cache-Control': 'no-cache'
				        }
				    });
				}
			},
			createObjet: function(params){
				if (configService.local){
					return $http({
				        method: 'GET', 
				        url: 'modules/cartes/json/cartes.json'
				    });
				}
				else {
					return $http({
				        method: 'POST', 
				        url: 'modules/cartes/php/cartes-objets-create.php',
			        	params: params,
			        	statut: {},
				        headers: {
				        	'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate'
				        }
				    });
				}				
			},
			modifierObjet: function(params){
				if (configService.local){
					return $http({
				        method: 'GET', 
				        url: 'modules/cartes/json/cartes.json'
				    });
				}
				else {
					return $http({
				        method: 'POST', 
				        url: 'modules/cartes/php/cartes-objets-modifier.php',
			        	params: params,
			        	statut: {},
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
angular.module('cartes').value('CartesProprietes', {
	// Piles:
	'pioche': 'Pioche',
	'hors_pioche': 'Hors Pioche',
	'humeurs': 'Humeurs',
	'missions': 'Missions',
	// Categories:
	'objet': 'Objet',
	'action': ' Action',
	'combat': 'Combat',
	'effet_immediat': 'Effet immédiat',
	'grande_carte': 'Grande carte',
	'orc': 'Orc',
	'personnage': 'Personnage',
	'normale': 'Normale',
	'speciale': 'Spéciale',
	// Utilisations:
	'action': 'Action',
	'reaction': 'Réaction',
	'ouverture': 'Ouverture',
	// Types d'actions:
	'immediat': 'Immédiat',
	'test': 'Test',
	'piege': 'Piège',
	// Types de missions:
	'apporter_des_cartes': 'Apporter des cartes',
	'reunir_des_cartes': 'Réunir des cartes',
	'remporter_des_duels': 'Remporter des duels',
	'visiter_des_cases': 'Visiter des cases',
	'visiter_des_zones': 'Visiter des zones',
	// Cibles:
	'lanceur': 'Lanceur',
	'adversaire': 'Adversaire',
	'tout_le_monde': 'Tout le monde',
	'deux_joueurs': 'Deux joueurs',
	// Consequences - categories:
	'action_contrer': 'Action : contrer',
	'belette': 'Belette',
	'carte': 'Carte',
	'carte_ouverte': 'Carte ouverte',
	'combat': 'Combat',
	'de': 'Dé',
	'deplacement': 'Déplacement',
	'duel': 'Duel',
	'grande_carte': 'Grande carte',
	'lecture': 'Lecture',
	'mission': 'Mission',
	'modulation': 'Modulation',
	'objet': 'Objet',
	'protection': 'Protection',
	'tour': 'Tour',
	'trois_familles': 'Trois familles',
	// Contraintes - categories
	'joueur': 'Joueur',
	'position': 'Position',
	'type_de_carte': 'Type de carte',
	// Circonstances - categories
	'action_de_case': 'Action de case',
	'changement_d_humeur': "Changement d'humeur",
	'defausse': 'Défausse',
	'echange': 'Echange',
	'interlude_musical': 'Interlude musical',
	'montee_de_marche': 'Montée de marche',
	'question': 'Question',
	'utilisation_d_objet': "Utilisation d'objet",
	'valise_non_materialisee': 'Valise non matérialisée',
	// Types consequences/contraintes/circonstances
	'annulation': 'Annulation',
	'adversaire': 'Adversaire',
	'avantage': 'Avantage',
	'bonus_attaque': 'Bonus attaque',
	'bonus_attaque_et_defense': 'Bonus attaque et défense',
	'bonus_defense': 'Bonus défense',
	'brouiller_l_ordre': "Brouiller l'ordre",
	'cartes': 'Cartes',
	'case': 'Case',
	'changement_congruence_deux_joueurs': 'Changement congruence (deux joueurs)',
	'changement_recompense': 'Changement récompense',
	'chez_le_lanceur': 'Chez le lanceur',
	'chez_n_importe_qui': "Chez n'importe qui",
	'creation': 'Création',
	'defense': 'Défense',
	'don': 'Don',
	'double_tranchant': 'Double-tranchant',
	'echouee': 'Echouée',
	'echouer': 'Echouer',
	'escalier': 'Escalier',
	'gagner': 'Gagner',
	'grandes_cartes': 'Grandes cartes',
	'humeur': 'Humeur',
	'inverser': 'Inverser',
	'jeu': 'Jeu',
	'labyrinthe': 'Labyrinthe',
	'nombre_de_cases': 'Nombre de cases',
	'passer': 'Passer',
	'paysage': 'Paysage',
	'plateau': 'Plateau',
	'posee': 'Posée',
	'princesse_de_cleves': 'Princesse de Clèves',
	'recuperation': 'Récuperation',
	'reduire_nombre_requis': 'Réduire nombre requis',
	'rejouer': 'Rejouer',
	'remplacer_membre_requis': 'Remplacer membre requis',
	'remplacer_objet_requis': 'Remplacer objet requis',
	'remporter': 'Remporter',
	'renvoi': 'Renvoi',
	'repondue_correctement': 'Répondue correctement',
	'repondue_faussement': 'Répondue faussement',
	'reussie': 'Réussie',
	'specifique': 'Spécifique',
	'tentative': 'Tentative',
	'transformation': 'Transformation',
	'type': 'Type',
	'vol': 'Vol',
	'voler_recompense': 'Voler récompense',
	'zone': 'Zone',
	// Valeurs:
	'0': '0',
	'1': '1',
	'2': '2',
	'3': '3',
	'4': '4',
	'5': '5',
	'6': '6',
	'7': '7',
	'8': '8',
	'9': '9',
	'10': '10',
	'11': '11',
	'12': '12',
	'16': '16',
	'73': '73',
	'moitie': 'Moitié',
	'toutes': 'Toutes',
	'julia': 'Julia',
	'marie': 'Marie',
	'romain': 'Romain',
	'contre_le_lanceur': 'Contre le lanceur',
	'contre_n_importe_qui': "Contre n'importe qui",
	'doubler': 'Doubler',
	'relancer': 'Relancer',
	'fi_mineur': 'Fi mineur',
	'la_majeur': 'La majeur',
	're_mineur': 'Ré mineur',
	// Types de cartes
	'animal': 'Animal',
	'chat': 'Chat',
	'combustible': 'Combustible',
	'crapauduc': 'Crapauduc',
	'electrique': 'Electrique',
	'faim': 'Faim',
	'insecte': 'Insecte',
	'marin': 'Marin',
	'metallique': 'Métallique',
	'negative': 'Négative',
	'nuit': 'Nuit',
	'potion_benefique': 'Potion bénéfique',
	'potion_benefique': 'Potion malefique',
	'respiration_sous_l_eau': "Respiration sous l'eau",
	'russe': 'Russe',
	'soif': 'Soif',
	'toxique': 'Toxique',
	'triste': 'Triste',
	'vitesse_doublee': 'Vitesse doublée',
	// Zones
	'desert': 'Désert',
	'foret': 'Forêt',
	'mer':'Mer',
	'marecages': 'Marécages',
	'monde_onirique': 'Monde onirique',
	'montagne': 'Montagne',
	'prairie': 'Prairie',
	'royaume_des_tenebres': 'Royaume des ténèbres',
	'village': 'Village',
	'ville': 'Ville',
	'zone_industrielle': 'Zone industrielle'
});
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('confrontations');

'use strict';

angular.module('confrontations').controller('ConfrontationsController', ['$scope','$rootScope','Cartes','Confrontations',
	function($scope,$rootScope,Cartes,Confrontations) {

	console.log('running confrontations controller');

	// *** STARTING FUNCTIONS ***

	function startCartePerte(valeur){
		$scope.confrontation.display.cartes_perte = true;
		var cartesJetables = 0;
		for (var i in $scope.jeu.main){
			if (!$scope.jeu.main[i].injetable){
				cartesJetables ++;
			}
		}
		$scope.confrontation.cartes.total = Math.min(cartesJetables,valeur);
		if ($scope.confrontation.cartes.total == 0){
			$scope.confrontation.ready = true;
		}
		for (var i = 0; i < $scope.confrontation.cartes.total; i ++){
			$scope.confrontation.cartes.liste.push({});
		}
		$scope.partie.dispo.cartes.main_jeter_attaque = true;
	}

	// Start function

	function startConfrontation(categorie,type,info,carteIndex,source,cible,id) {

		// build confrontation object:
		$scope.confrontation.active = true;
		$scope.confrontation.id = id;
		$scope.confrontation.categorie = categorie;
		$scope.confrontation.type = type;
		$scope.confrontation.info = info;
		$scope.confrontation.carteIndex = carteIndex;
		$scope.confrontation.source = source;
		$scope.confrontation.cible = cible;
		$scope.confrontation.ready = false;
		$scope.confrontation.display = {};
		$scope.confrontation.cartes = {
			liste: [],
			filled: 0,
			total: 0
		};

		// fill confrontation content:
		var description = "";
		var titre = "";
		if (type == 'action'){
			var consequence = $scope.cartes[info].info.consequences[0];
			var action = $scope.cartes[info].info.action.type;
			$scope.confrontation.code = $scope.cartes[info].code;
			console.log(action);
			console.log(consequence);
		}

		if (categorie === 'attaque' && type === 'action'){
			$scope.confrontation.ready = true;
			$scope.confrontation.display.carte_image = true;
			$scope.confrontation.display.joueur_selection = true;
			$scope.confrontation.display.description = true;
			$scope.confrontation.display.description_type = 'cible_left';
			console.log(consequence);
			// titre:
			titre = "Action : " + $scope.cartes[info].nom;
			// description:
			if (action === "immediat" && consequence.categorie === 'carte' && consequence.type === 'defausse'){
				description = " perd " + consequence.valeur + " cartes !";
			}
			else if (action === "immediat" && consequence.categorie === 'tour' && consequence.type === 'passer'){
				description = " passe " + consequence.valeur + " tour !";
			}
			else if (action === "test" && consequence.categorie === 'carte' && consequence.type === 'vol'){
				description = " risque de perdre " + consequence.valeur + " cartes !";
			}
		}

		else if (categorie == 'attaque' && type == 'duel'){
			titre = "Lancer un duel";
			$scope.confrontation.display.joueur_selection = true;
			$scope.confrontation.display.duel_results = true;
		}

		else if (categorie === 'defense'){
			if (type === 'action'){
				titre = $scope.joueurs[source].nom + " t'attaque !";
				if (action === "immediat" && consequence.categorie === 'carte' && consequence.type === 'defausse'){
					$scope.confrontation.display.carte_image = true;
					startCartePerte(consequence.valeur);
					if (consequence.valeur == 1){
						$scope.confrontation.description = "Choisis " + consequence.valeur + " carte à défausser :";
					}
					else {
						$scope.confrontation.description = "Choisis " + consequence.valeur + " cartes à défausser :";
					}
				}
				else if (action === "test" && consequence.categorie === 'carte' && consequence.type === 'vol'){
					$scope.confrontation.display.test = true;
					$scope.confrontation.ready = true;
					$scope.confrontation.test = {
						values: {},
						correct: false
					};
					description = "Quelle heure est-il ?";
				}
				else if (action === "immediat" && consequence.categorie === 'tour' && consequence.type === 'passer'){
					$scope.confrontation.display.carte_image = true;
					$scope.confrontation.display.description = true;
					$scope.confrontation.display.description_type = 'text_only';
					$scope.confrontation.ready = true;
					if (consequence.valeur == 1){
						description = "Tu passes " + consequence.valeur + " tour";
					}
					else {
						description = "Tu passes " + consequence.valeur + " tour";
					}
				}
			}
			else if (type == 'duel'){
				titre = "Duel lancé par " + $scope.joueurs[$scope.confrontation.source].nom;
				$scope.confrontation.display.duel_results = true;
				$scope.confrontation.display.joueur_images = true;
				$scope.confrontation.info.results_cible = [];
				$scope.confrontation.info.result_cible = 0;
				$scope.partie.dispo.des.duel = 3;
			}
		}

		else if (categorie === 'combat'){
			$scope.confrontation.code = $scope.cartes[info].code;
			titre = $scope.cartes[info].nom;
			$scope.confrontation.display.carte_image = true;
			$scope.confrontation.display.joueur_selection = true;
			$scope.confrontation.display.joueur_selection_type = 'all';
		}

		$scope.confrontation.titre = titre;
		$scope.confrontation.description = description;
	}

	// Event listeners from other controllers:

	// Start attaque action
	$rootScope.$on('confrontations-attaque-action-start', function(event, args) {
		startConfrontation('attaque','action',args.carte.id,args.carteIndex,$scope.joueurId);
	});

	// Start defense
	function startDefense(){
		if($scope.attaques.defenses.length > 0 && $scope.partie.tour_joueur == $scope.joueurId && $scope.partie.tour_action == 0){
			console.log($scope.attaques.defenses);
			$scope.attaques.defenses[0];
			startConfrontation('defense',
				$scope.attaques.defenses[0].type,
				$scope.attaques.defenses[0].info,
				-1,
				$scope.attaques.defenses[0].source,
				$scope.attaques.defenses[0].cible,
				$scope.attaques.defenses[0].id);
			$scope.attaques.defenses.splice(0,1);
		}
	}
	$rootScope.$on('confrontations-defense-start', function(event, args) {
		startDefense();
	});

	$rootScope.$on('confrontations-combat-start', function(event, args) {
		startConfrontation('combat','combat',args.carte.id,args.carteIndex,$scope.joueurId);
	});

	// Start attaque duel:
	$rootScope.$on('confrontations-attaque-duel-start', function(event, args) {
		console.log('receiving');
		if($scope.partie.tour_joueur == $scope.joueurId && $scope.partie.tour_action == 5){
			var duel = {
				results_source: [],
				result_source: 0,
				bonus_source: 0,
				modulo: 18
			};
			console.log('here');
			startConfrontation('attaque','duel',duel,-1,$scope.joueurId);			
		}
	});

	// *** GENERAL USE FUNCTIONS ***

	$scope.selectCible = function(id){
		$scope.confrontation.cible = id;
		if ($scope.confrontation.categorie == 'attaque' && $scope.confrontation.type == 'duel'){
			$scope.confrontation.titre = "Lancer un duel sur " + $scope.joueurs[id].nom;
			if ($scope.confrontation.info.results_source.length == 3){
				$scope.confrontation.ready = true;
			}
		}
	}

	function jeterCarte(carte){
		var carteJetee = false;
		for (var i in $scope.confrontation.cartes.liste){
			if ($scope.confrontation.cartes.liste[i].id == carte.id){
				carteJetee = true;
			}
		}
		if (!carteJetee){
			var foundSpot = false;
			var i = 0;
			var cartesAJeter = $scope.confrontation.cartes.liste.length;
			while (i < cartesAJeter && !foundSpot){
				if (!$scope.confrontation.cartes.liste[i].filled){
					$scope.confrontation.cartes.liste[i] = carte;
					$scope.confrontation.cartes.liste[i].filled = true;
					foundSpot = true;
					$scope.confrontation.cartes.filled ++;
				}
				// On a tout rempli:
				if ($scope.confrontation.cartes.filled == $scope.confrontation.cartes.total){
					$scope.confrontation.ready = true;
				}
				i ++;
			}
		}
	}
	$scope.removeCarte = function(index){
		$scope.confrontation.cartes.liste[index] = {};
		$scope.confrontation.cartes.filled --;
		$scope.confrontation.ready = false;
	}
	$rootScope.$on('confrontations-defense-jeter-carte', function(event, args) {
		var carte = $scope.jeu.main[args.index];
		jeterCarte(carte);
	});

	function updateResult(){
		if ($scope.confrontation.categorie == 'attaque'){
			var result = 0;
			for (var i in $scope.confrontation.info.results_source){
				result += $scope.confrontation.info.results_source[i];
			}
			$scope.confrontation.info.result_source = result % $scope.confrontation.info.modulo;
			console.log($scope.confrontation.info.result_source);
		}
		else {
			var result = 0;
			for (var i in $scope.confrontation.info.results_cible){
				result += $scope.confrontation.info.results_cible[i];
			}
			$scope.confrontation.info.result_cible = result % $scope.confrontation.info.modulo;
			console.log($scope.confrontation.info.result_cible);			
		}
	}

	function lanceDeDuel(result){
		console.log($scope.confrontation.categorie);
		if ($scope.confrontation.categorie == 'attaque'){
			if ($scope.confrontation.info.results_source.length < 3){
				$scope.confrontation.info.results_source.push(result);
				updateResult();
				if ($scope.confrontation.info.results_source.length == 3 && $scope.confrontation.cible >= 0){
					$scope.confrontation.ready = true;
				}
			}
		}
		else {
			if ($scope.confrontation.info.results_cible.length < 3){
				$scope.confrontation.info.results_cible.push(result);
				updateResult();
				if ($scope.confrontation.info.results_cible.length == 3){
					$scope.confrontation.ready = true;
				}
			}
		}
	}
	$rootScope.$on('confrontations-duel-de', function(event, args) {
		lanceDeDuel(args.result);
	});


	// *** FINAL FUNCTIONS ***

	$scope.cancelConfrontation = function(){
		$scope.confrontation.active = false;
		$scope.confrontation.cible = -1;
		$scope.confrontation.info = -1;
		$scope.confrontation.display = {};
	}
	$rootScope.$on('confrontations-attaque-duel-cancel', function(event, args) {
		$scope.cancelConfrontation();
	});

	$scope.toursToSkip = 0;

	function deplacerCartes(newPosition){
		for (var i in $scope.confrontation.cartes.liste){
			if ($scope.confrontation.cartes.liste[i].filled){
				var result = function(id){
					console.log(id);
					Cartes.moveCartes({
			    		carteIds: [id],
			    		position: newPosition
			    	}).success(function(){
			    		console.log(id);
						var index = -1;
						var j = 0;
						while (index < 0 && j < $scope.jeu.main.length){
							if ($scope.jeu.main[j].id == id){
								index = j;
							}
							j ++;
						}
						console.log(index);
			    		var carte = $scope.jeu.main[index];
			    		carte.statut = {};
			    		delete carte.filled;
						$scope.defausses.pioche.push(carte);
						$scope.jeu.main.splice(index,1);
						$scope.focusIndex = -2;
			    	}).error(function(){

			    	})
			    }($scope.confrontation.cartes.liste[i].id);
			}
		}
	}

	$scope.lanceConfrontation = function(){
		var confrontation = $scope.confrontation;
		if (confrontation.categorie == 'attaque' && confrontation.type == 'action'){
			// retirer la carte de la main:
			Cartes.moveCartes({
	    		carteIds: [confrontation.info],
	    		position: -2
	        }).success(function(){
	        	console.log($scope.confrontation);
	        	// send attaque !
	        	Confrontations.add({
	        		categorie: confrontation.categorie,
	        		type: confrontation.type,
	        		info: confrontation.info,
	        		cible: confrontation.cible,
	        		source: confrontation.source
	        	});
	    		$scope.defausses.pioche.push($scope.cartes[confrontation.info]);
	    		$scope.cancelConfrontation();
	    		console.log($scope.confrontation.carteIndex);
				$scope.jeu.main.splice($scope.confrontation.carteIndex,1);
	    	}).error(function(){

	    	})
		}
		else if (confrontation.categorie == 'attaque' && confrontation.type == 'duel'){
	    	Confrontations.add({
	    		categorie: 'attaque',
	    		type: 'duel',
	    		info: $scope.confrontation.info,
	    		cible: $scope.confrontation.cible,
	    		source: $scope.joueurId
	    	}).success(function(){
	    		$scope.partie.dispo.duel = false;
	    		$scope.cancelConfrontation();
	    	}).error(function(){
	    		console.log('Sending duel did not work');
	    	})
		}
		else if (confrontation.categorie == 'defense'){
			var defenseFinished = false; // is it the last step of this defense activity?
			if (confrontation.type == 'action'){
				var consequence = $scope.cartes[confrontation.info].info.consequences[0];
				var action = $scope.cartes[confrontation.info].info.action.type;
				if (action == 'immediat' && consequence.categorie === 'tour' && consequence.type === 'passer'){
					$scope.toursToSkip ++;
					defenseFinished = true;
				}
				else if (action == 'immediat' && consequence.categorie === 'carte' && consequence.type === 'defausse'){
					deplacerCartes(-2);
					defenseFinished = true;
				}
				else if (action === "test" && consequence.categorie === 'carte' && consequence.type === 'vol'){
					if ($scope.confrontation.test.completed){
						defenseFinished = true;
					}
					else {
						if ($scope.cartes[confrontation.info].code == "quelle_heure_est_il"){
							if ($scope.confrontation.test.values.hours == "19" && $scope.confrontation.test.values.minutes == "42"){
								$scope.confrontation.test.correct = true;
								$scope.confrontation.description = "Bonne réponse !";
							}
							else {
								$scope.confrontation.test.correct = false;
								$scope.confrontation.description = "Mauvaise réponse. " + $scope.joueurs[$scope.confrontation.source].nom + " te chipera une carte à son tour.";
							}
						}
						$scope.confrontation.display.carte_image = true;
						$scope.confrontation.display.description = true;
						$scope.confrontation.display.test = false;
						$scope.confrontation.display.description_type = 'text_only';
						$scope.confrontation.test.completed = true;
					}
				}
			}
			else if (confrontation.type == 'duel'){
				if (confrontation.info.completed){
					deplacerCartes(confrontation.source);
					defenseFinished = true;
				}
				else {
					if (confrontation.info.result_cible > confrontation.info.result_source){
						console.log('ici !');
						$scope.confrontation.display.description = true;
						$scope.confrontation.display.description_type = 'text_only';
						$scope.confrontation.description = "Tu as gagné ! " + $scope.joueurs[confrontation.source].nom + " te donnera 2 cartes";
					}
					else if (confrontation.info.result_cible < confrontation.info.result_source){
						$scope.confrontation.ready = false;
						startCartePerte(2);
						$scope.confrontation.description = "Tu as perdu. Choisis 2 cartes à donner à " + $scope.joueurs[$scope.confrontation.source].nom + " :";
					}
					else {
						$scope.confrontation.ready = false;
						startCartePerte(1);
						$scope.confrontation.description = "Egalité. Choisis 1 carte à donner à " + $scope.joueurs[$scope.confrontation.source].nom + " :";
					}
					$scope.confrontation.display.duel_results = false;
					$scope.confrontation.info.completed = true;
				}
			}
			// Si la defense en question est bien finie:
			if (defenseFinished){
				// On la vire:
				Confrontations.delete({id: $scope.confrontation.id});
				$scope.confrontation.active = false;
				// On enchaine avec les eventuelles defenses suivantes:
				if ($scope.attaques.defenses.length > 0){
					startDefense();
				}
				// On skippe les tours eventuellement:
				else {
					if ($scope.toursToSkip > 0){
						console.log($scope.toursToSkip);
						$scope.$emit('partie-tours-move', {numberTours: 7,toursToSkip: $scope.toursToSkip - 1});
					}
				}
			}
		}
		var carte = $scope.confrontation.info;
	}

	// Controller loaded:
	$scope.loaded.confrontationsController = true;
	$scope.initiateConfrontations()

}]);
'use strict';

angular.module('confrontations').directive('redConfrontationsAttaque', [
	function() {
		return {
			templateUrl: 'modules/confrontations/views/confrontations-attaque.view.html',
			restrict: 'E'
		};
	}
]);

angular.module('confrontations').directive('redConfrontationsDefense', [
	function() {
		return {
			templateUrl: 'modules/confrontations/views/confrontations-defense.view.html',
			restrict: 'E'
		};
	}
]);

angular.module('confrontations').directive('redConfrontationsDefenseAction', [
	function() {
		return {
			templateUrl: 'modules/confrontations/views/confrontations-defense-action.view.html',
			restrict: 'E'
		};
	}
]);

angular.module('confrontations').directive('redConfrontationsDefenseDuel', [
	function() {
		return {
			templateUrl: 'modules/confrontations/views/confrontations-defense-duel.view.html',
			restrict: 'E'
		};
	}
]);

angular.module('confrontations').directive('redConfrontationsAttaqueDuel', [
	function() {
		return {
			templateUrl: 'modules/confrontations/views/confrontations-attaque-duel.view.html',
			restrict: 'E'
		};
	}
]);

angular.module('confrontations').directive('redConfrontations', [
	function() {
		return {
			templateUrl: 'modules/confrontations/views/confrontations.view.html',
			restrict: 'E'
		};
	}
]);
'use strict';

angular.module('confrontations').factory('Confrontations', ['$http','configService',
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
				        url: 'modules/confrontations/php/confrontations-add.php',
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
				        url: 'modules/confrontations/json/confrontations.json'
				    });
				}
				else {
					return $http({
				        method: 'GET', 
				        url: 'modules/confrontations/php/confrontations-get.php',
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
				        url: 'modules/confrontations/json/confrontations.json'
				    });
				}
				else {
					return $http({
				        method: 'POST', 
				        url: 'modules/confrontations/php/confrontations-delete.php',
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

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('core');

'use strict';

angular.module('core').controller('CoreMenuController', ['$scope','$state',
	function($scope,$state) {

	$scope.goTo = function(state){
		$state.go(state);
	}

}]);
'use strict';

angular.module('core').directive('redCoreToolbar', [
	function() {
		return {
			templateUrl: 'modules/core/views/red-core-toolbar.view.html',
			restrict: 'E'
		};
	}
]);
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
			if (de === 'rhombo'){
				$scope.partie.dispo.pioches.pioche += result;
			}
			else if (de === 'paysage'){
				$scope.partie.dispo.plateaux.paysage = 1;
			}
			else if (de === 'labyrinthe'){
				$scope.$emit('plateaux-labyrinthe-de', {result: result});
			}
			else if (de === 'duel'){
				$scope.$emit('confrontations-duel-de', {result: result});
			}
		}

		$scope.lanceDe = function(de){
			var rand = Math.floor((Math.random() * des_size[de]));
			$scope.jeu.de = des_options[de][rand];
			$scope.partie.dispo.des[de] --;
			translateResult(de,des_options[de][rand]);
		}

		$scope.add100DeLabyrinthe = function(){
			$scope.partie.dispo.des.labyrinthe += 100;
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
ApplicationConfiguration.registerModule('historique');

'use strict';

// Setting up route
angular.module('historique').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider,$urlRouterProvider){
	// Home state routing
	$stateProvider.
	state('historique', {
		url: '/historique',
		templateUrl: 'modules/historique/views/historique.view.html'
	});

}]);
'use strict';

angular.module('historique').controller('HistoriqueController', ['$scope','Joueurs',
	function($scope,Joueurs) {

	$scope.joueurs = [];
	Joueurs.getJoueurs().success(function(response){
		$scope.joueurs = response;
		grouperHistorique();
	});

	var date = new Date();

	var eventLog = [
		{
			id: 1,
			stamp: date,
			joueur: 0,
			categorie: 'deplacement',
			type: 'plateau-paysage',
			info: {
				de: 2,
				depart: '10',
				arrivee: '10B2',
				mode: 'normal'
			}
		},
		{
			id: 3,
			stamp: date,
			joueur: 0,
			categorie: 'duel',
			type: 'attaque',
			info: {
				cible: 2
			}
		},
		{
			id: 2,
			stamp: date,
			joueur: 1,
			categorie: 'carte',
			type: 'defausse',
			info: {
				cartes: ['fumee_de_cigarettes','orque_casque_anti_bruit']
			}
		},
		{
			id: 6,
			stamp: date,
			joueur: 1,
			categorie: 'carte',
			type: 'defausse',
			info: {
				cartes: ['quart_de_singe']
			}
		},
		{
			id: 4,
			stamp: date,
			joueur: 2,
			categorie: 'duel',
			type: 'defense',
			info: {
				source: 0,
				results_source: [14,4,18],
				results_cible: [1,6,19],
				result_source: 14,
				result_cible: 5,
				modulo: 18
			}
		}
	];

	$scope.historique = [];
	var lastIndex = -1;

	// Grouper par joueur:
	function grouperHistorique(){
		for (var i in eventLog){
			// Ajouter information d'expandabilite
			if (eventLog[i].categorie === 'duel' && eventLog[i].type === 'defense' ||
				eventLog[i].categorie === 'carte' && eventLog[i].type === 'defausse'){
				eventLog[i].expandable = true;
			}
			// Creer nouvel intervalle
			if ($scope.historique[lastIndex] === undefined || $scope.historique[lastIndex].joueur !== eventLog[i].joueur){
				$scope.historique.push({
					joueur: eventLog[i].joueur,
					style: "{'background-color': '" + $scope.joueurs[eventLog[i].joueur].backgroundColor + "'}",
					events: [eventLog[i]]
				});
				lastIndex ++;
			}
			// Ajouter element a intervalle existant
			else {
				var lastEvent = $scope.historique[lastIndex].events.length - 1;
				// Agreger plusieurs elements ensemble:
				if ($scope.historique[lastIndex].events[lastEvent].categorie === 'carte' && eventLog[i].categorie === 'carte' &&
					$scope.historique[lastIndex].events[lastEvent].type === eventLog[i].type){
					if ($scope.historique[lastIndex].events[lastEvent].type === 'defausse' && eventLog[i].categorie === 'defausse'){
						$scope.historique[lastIndex].events[lastEvent].info.cartes.push(eventLog[i].info.cartes);
					}
				}
				else {
					$scope.historique[lastIndex].events.push(eventLog[i]);
				}
			}
			console.log($scope.historique);
		}
	}

	$scope.expand = function(groupeIndex,eventIndex,direction){
		$scope.historique[groupeIndex].events[eventIndex].expanded = direction;
	}

}]);
'use strict';

angular.module('historique').factory('Historique', ['$http','configService',
	function($http,configService) {
		return {
			// Get all the joueurs:
			logEvent: function(params){
				params.stamp = new Date(); // ajouter la date
				if (configService.local){
					return $http({
				        method: 'GET', 
				        url: 'modules/joueurs/json/joueurs.json'
				    });
				}
				else {
					return $http({
				        method: 'POST', 
				        url: 'modules/historique/php/historique.php',
				        params: params,
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
ApplicationConfiguration.registerModule('jeu');

'use strict';

angular.module('jeu').controller('JeuContainerController', ['$scope',
	function($scope) {

	$scope.actionsDisponibles = {
		action: true,
		nextAction: true
	}

	$scope.focusedTab = 0;

	$scope.tabs = [
		{id: 'cartes_ouvertes',nom: 'Cartes ouvertes',style: "{'background-color':'#fff8e8'}"},
		{id: 'objets_hors_pioche',nom: 'Objets hors pioche',style: "{'background-color':'#fff5f5'}"},
		{id: 'humeurs',nom: 'Humeurs',style: "{'background-color':'#fff0ff'}"},
		{id: 'missions',nom: 'Missions',style: "{'background-color':'#e8fbff'}"},
		{id: 'grande_cartes',nom: 'Grandes cartes',style: "{'background-color':'#efe8ff'}"}
	];
	
	$scope.changeTab = function(index){
		$scope.focusedTab = index;
		console.log($scope.tabStyles);
	}

	$scope.view = 'cartes';

	$scope.changeView = function(index){
		$scope.view = index;
	}

	$scope.ecrireNotes = function(){
		if ($scope.view !== 'notes'){
			$scope.view = 'notes';
		}
		else {
			// ajouter truc pour sauver les notes
			$scope.view = 'cartes';
		}
	}

}]);
'use strict';

angular.module('jeu').controller('JeuGrandesCartesController', ['$scope',
	function($scope) {

	$scope.grandesCartes = [
		{code: 'quart_de_singe'},
		{code: 'interlude_musical'},
		{code: 'orque_casque_anti_bruit'},
		{code: 'elephant_parapluie'},
		{code: 'crachat_de_lama'},
		{code: 'fumee_de_cigarettes'}
	];

}]);
'use strict';

angular.module('jeu').controller('JeuHorsPiocheController', ['$scope',
	function($scope) {

}]);
'use strict';

angular.module('jeu').controller('JeuMainController', ['$scope','$rootScope','$timeout','Cartes',
	function($scope,$rootScope,$timeout,Cartes) {

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
			$scope.$emit('confrontations-attaque-action-start', {carte: carte,carteIndex: index});
		}
	}

	$scope.ouvrirCarte = function(index){
		var carte = $scope.jeu.main[index];
		carte.statut.ouverte = true;
		Cartes.changementMain({
    		carteId: $scope.jeu.main[index].id,
    		statut: carte.statut
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
    		carte.statut = {};
			$scope.defausses.pioche.push(carte);
			$scope.jeu.main.splice(index,1);
			$scope.focusIndex = -2;
    	}).error(function(){

    	})
	}

	$scope.jeterAttaqueCarte = function(index){
		$scope.$emit('confrontations-defense-jeter-carte', {index: index});
	}

	$scope.jeterCarteInterface = function(index){
		$scope.$emit('cartes-jeter-id', {carte: $scope.jeu.main[index]});
	}

	// Défausse de multiples cartes
	$rootScope.$on('jeu-main-jeter', function(event, args) {
		console.log(args.cartes);
		var carteIds = [];
		for (var i in args.cartes){
			carteIds.push(args.cartes[i].id);
		}
		console.log(carteIds);
		Cartes.moveCartes({
    		carteIds: carteIds,
    		position: -2
        }).success(function(){
        	$scope.$emit('jeu-main-jeter-callback', {success: true});
        	for (var i in args.cartes){
        		var id = args.cartes[i].id;
				var index = -1;
				var j = 0;
				while (index < 0 && j < $scope.jeu.main.length){
					if ($scope.jeu.main[j].id == id){
						index = j;
					}
					j ++;
				}
	    		var carte = $scope.jeu.main[index];
	    		carte.statut = {};
				$scope.defausses.pioche.push(carte);
				$scope.jeu.main.splice(index,1);
        	}
        	$scope.focusIndex = -2;
    	}).error(function(){
    		$scope.$emit('jeu-main-jeter-callback', {success: false});
    	});
	});


	// Interface de défausse de cartes:
	$rootScope.$on('cartes-jeter-start', function(event, args) {
		$scope.jeterDispo = true;
		$scope.jeterBoutonTitre = args.boutonName;
		var nombreDeCartes = $scope.jeu.main.length;
		$scope.$emit('cartes-jeter-start-callback', {nombreDeCartes: nombreDeCartes});
	});
	$rootScope.$on('cartes-jeter-notfull', function(event, args) {
		$scope.jeterDispo = true;
	});
	$rootScope.$on('cartes-jeter-full', function(event, args) {
		$scope.jeterDispo = false;
	});

}]);
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

    $scope.utiliserCarte = function(index){
    	var carte = $scope.jeu.ouvertes[index];
		console.log(index);
		if (carte.categorie == 'combat'){
			$scope.$emit('confrontations-combat-start', {carte: carte,carteIndex: index});
		}
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

angular.module('jeu').directive('redJeuMission', [
	function() {
		return {
			templateUrl: 'modules/jeu/views/jeu-mission.view.html',
			restrict: 'E'
		};
	}
]);

angular.module('jeu').directive('redJeuGrandesCartes', [
	function() {
		return {
			templateUrl: 'modules/jeu/views/jeu-grandes-cartes.view.html',
			restrict: 'E'
		};
	}
]);

angular.module('jeu').directive('redJeuHorsPioche', [
	function() {
		return {
			templateUrl: 'modules/jeu/views/jeu-hors-pioche.view.html',
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
	$scope.joueurLeftStyle = "{'background-color': '"+$scope.joueurs[$scope.autresJoueurs[0]].backgroundColor+"'}";
	$scope.joueurRightStyle = "{'background-color': '"+$scope.joueurs[$scope.autresJoueurs[1]].backgroundColor+"'}";
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
			},
			// Update pion
			movePion: function(params){
				if (configService.local){
					return $http({
				        method: 'GET', 
				        url: 'modules/joueurs/json/joueurs.json'
				    });
				}
				else {
					return $http({
				        method: 'POST', 
				        url: 'modules/joueurs/php/joueurs-pion-move.php',
				        params: params,
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

angular.module('partie').controller('PartieGeneralController', ['$scope','$state','$stateParams','Cartes','Objets','Partie','Joueurs','Confrontations',
	function($scope,$state,$stateParams,Cartes,Objets,Partie,Joueurs,Confrontations) {

	// Tracking if all information has been well retrieved:
	$scope.loaded = {
		partie: false,
		cartes: false,
		joueurs: false,
		defenses: false, // integrated
		confrontationsController: false
	};

	// Get param:

	$scope.joueurId = parseInt($stateParams.joueur);

	// Attaques:

	$scope.attaques = {
		defenses: [],
		recompenses: []
	};

	$scope.defense = {};

	$scope.duel = {};

	$scope.initiateConfrontations = function(){
		if ($scope.loaded.partie && $scope.loaded.cartes && $scope.loaded.confrontationsController){
			console.log('inside');
			if ($scope.partie.tour_joueur == $scope.joueurId && $scope.partie.tour_action == 0){
				Confrontations.get({joueurId: $scope.joueurId}).success(function(response){
					for (var i in response){
						if (response[i].categorie == 'attaque'){
							$scope.attaques.defenses.push(response[i]);
						}
						else if (response[i].categorie == 'recompense'){
							$scope.attaques.recompenses.push(response[i]);
						}
					}
					$scope.loaded.defenses = true;
					$scope.$emit('confrontations-defense-start', {});
				});
			}
			else if ($scope.partie.tour_joueur == $scope.joueurId && $scope.partie.tour_action == 5){
				console.log('emitting');
				$scope.$emit('confrontations-attaque-duel-start', {});
			}
			$scope.loaded.defenses = true;
		}
	}

	// Partie:

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
			},
			plateaux: {
				paysage: 0,
				layrinthe: 0
			},
			duel: false,
			action_de_case: false
		}
	}

	
	Partie.getPartie().success(function(response){
		$scope.partie = {
			tour_joueur: response[0].tour_joueur,
			tour_action: response[0].tour_action,
			tour_skip: response[0].tour_skip,
			tonalite: response[0].tonalite,
			temps: response[0].temps,
			dispo: response[0].dispo,
			positionCouronnes: response[0].positionCouronnes,
			valiseNonMaterialisee: response[0].valiseNonMaterialisee
		};
		if ($scope.partie.tour_joueur !== $scope.joueurId){
			$scope.resetDispos();
		}
		$scope.loaded.partie = true;
		$scope.initiateConfrontations();
		$scope.$emit('partie-general-partie-loaded', {});
	})

	// Jeu:

	$scope.jeu = {};

	$scope.jeu.de = -1;

	$scope.jeu.main = [];
	$scope.jeu.ouvertes = [];
	$scope.jeu.missions = [];

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
	    				if (carte.statut.ouverte){
	    					$scope.jeu.ouvertes.push(carte);
	    				}
	    				else {
	    					$scope.jeu.main.push(carte);
	    				}
	    			}
	    			else if (carte.statut.ouverte){
	    				$scope.joueurs[carte.position].ouvertes.push(carte);
	    			}
	    		}
	    		else if (carte.pile == 'missions'){
	    			if (carte.position == -1) {
	    				$scope.pioches.missions.push(carte);
	    			}
	    			if (carte.position == $scope.joueurId){
	    				console.log('and joueur');
	    				$scope.jeu.missions.push(carte);
	    			}
	    		}
	    	}
			$scope.loaded.cartes = true;
			$scope.initiateConfrontations();
	    }).error(function(response){
	    	console.log("Error while trying to get cartes");
	    });
	}

	// Objets:
	$scope.objets = {};
	Objets.getObjets().success(function(responseObjets){
		for (var i in responseObjets){
			// agreger objets par code:
			if ($scope.objets[responseObjets[i].code] === undefined){
				$scope.objets[responseObjets[i].code] = responseObjets[i];
			}
		}
		console.log($scope.cartesTable);
	});

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
		$scope.$emit('partie-general-joueurs-loaded');
	})


	$scope.autresJoueurs = [($scope.joueurId + 2)%3,($scope.joueurId + 1)%3];
	$scope.joueurLeft = ($scope.joueurId + 2)%3;
	$scope.joueurRight = ($scope.joueurId + 1)%3;

	// Pioches et defausses :

	$scope.pioches = {};
	$scope.pioches.pioche = [];
	$scope.pioches.missions = [];
	
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
	$scope.confrontation = {};
	
	// Actions disponibles

	$scope.actionsDisponibles = {};

}]);
'use strict';

angular.module('partie').controller('PartieTourController', ['$scope','$rootScope','Partie',
	function($scope,$rootScope,Partie) {

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

	function startAction(tourJoueur,tourAction){
		// Changement de tour: reinitialiser le de et les dispos (cartes, des)
		$scope.jeu.de = -1;
		$scope.resetDispos();
		// Lancer la nouvelle action:
		if (tourJoueur == $scope.joueurId){
			if (tourAction == 1){
				$scope.partie.dispo.cartes.ouvertures = true;
				$scope.partie.dispo.cartes.ouvertes_jeter = true;
			}
			else if (tourAction == 2){
				$scope.partie.dispo.pioches.pioche ++;
				$scope.partie.dispo.des.rhombo ++;
				$scope.partie.dispo.cartes.main_jeter = true;
			}
			else if (tourAction == 3){
				if ($scope.joueurs[$scope.joueurId].pions[0].plateau === 'paysage'){
					$scope.partie.dispo.des.paysage = 1;
				}
				else if ($scope.joueurs[$scope.joueurId].pions[0].plateau === 'labyrinthe'){
					$scope.partie.dispo.des.labyrinthe = 4;
				}
				console.log($scope.joueurs)


			}
			else if (tourAction == 4){
				$scope.partie.dispo.action_de_case = true;
			}
			else if (tourAction == 5){
				$scope.partie.dispo.duel = true;
				$scope.partie.dispo.des.duel = 3;
			}
			else if (tourAction == 6){
				$scope.partie.dispo.cartes.utiliser = true;
				$scope.$emit('confrontations-attaque-duel-cancel', {});
				if ($scope.jeu.missions.length === 0){
					$scope.partie.dispo.pioches.missions = 1;
				}
			}
		}
	}

	function moveTour(numberTours,skipTours){
		$scope.actionsDisponibles.nextAction = false;
		// Verify if data is consistent
		Partie.getPartie().success(function(response){
			// Data is consistent;
			if ($scope.partie.tour_joueur == response[0].tour_joueur && $scope.partie.tour_action == response[0].tour_action){
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
				startAction(tourJoueur,tourAction);
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
					if ($scope.partie.tour_joueur == $scope.joueurId && $scope.partie.tour_action == 5){
						$scope.$emit('action-case-start', {});
					}
					if ($scope.partie.tour_joueur == $scope.joueurId && $scope.partie.tour_action == 5){
						$scope.$emit('confrontations-attaque-duel-start', {});
					}
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

	$scope.nextAction = function(){
		moveTour(1,0);
	}

	$rootScope.$on('partie-tours-move', function(event, args) {
		moveTour(args.numberTours,args.toursToSkip);
	});

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
			},
			changeCouronnes: function(params){
				if (configService.local){
					return $http({
				        method: 'GET', 
				        url: 'modules/cartes/json/cartes.json'
				    });
				}
				else {
					return $http({
				        method: 'POST', 
				        url: 'modules/partie/php/partie-couronnes-change.php',
				        params: params,
				        headers: {
				        	'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate'
				        }
				    });
				}
			},
			ajouterObjetValise: function(params){
				if (configService.local){
					return $http({
				        method: 'GET', 
				        url: 'modules/cartes/json/cartes.json'
				    });
				}
				else {
					return $http({
				        method: 'POST', 
				        url: 'modules/partie/php/partie-ajouter-objet-valise.php',
				        params: params,
				        headers: {
				        	'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate'
				        }
				    });
				}
			},
		}
	}
]);

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('plateaux');

'use strict';

angular.module('plateaux').controller('PlateauxActionCaseController', ['$scope','$rootScope','$http','$timeout','Partie','Cartes','Objets','Confrontations',
	function($scope,$rootScope,$http,$timeout,Partie,Cartes,Objets,Confrontations) {

	$scope.startActionCase = function(categorie,numero){
		$scope.actionCase.categorie = categorie;
		$scope.actionCase.numero = $scope.joueurs[$scope.joueurId].pions[0].case;
		$scope.actionCaseDisplay = {description: true,image: false, perteCartes: false};
		$scope.actionCase.phase ++;
		console.log(numero);
		if ($scope.actionCase.phase === 1){
			if (numero === 'Hub'){
				var origine = $scope.joueurs[$scope.joueurId].pions[0].plateau;
				if (origine === 'labyrinthe'){
					$scope.actionCase.destination = 'paysage';
				}
				else if (origine === 'paysage'){
					$scope.actionCase.destination = 'labyrinthe';
				}
				$scope.actionCase.description = "Veux-tu prendre l'avion vers le plateau-" + $scope.actionCase.destination + " ?"
				$scope.bouton1 = "Oui";
				$scope.bouton2 = "Non";
				console.log('ici');
			}
		}
		else if ($scope.actionCase.phase === 2){
			if (numero === 'Hub'){
				$scope.actionCase.description = "Il te faut un passeport";
				$scope.bouton1 = "OK";
				$scope.bouton2 = "Annuler";
			}
		}
		else if ($scope.actionCase.phase === 3){
			if (numero === 'Hub'){
				$scope.okButtonDisabled = true;
				$scope.valiseNonMaterialiseeIndex = 0;
				$scope.actionCaseDisplay.description = false;
				// Valise non materialisee
				$scope.valiseNonMaterialisee = $scope.partie.valiseNonMaterialisee;
				if ($scope.valiseNonMaterialisee.length === 0){
					$scope.actionCase.vnmCorrect = true;
				}
				$scope.actionCase.valiseNonMaterialisee = [];
				$scope.actionCase.description = "Bon voyage ! N'oublie pas de correctement préparer ta valise non-matérialisée."
				$scope.bouton1 = "OK";
				$scope.bouton2 = "";
			}
		}
		else if ($scope.actionCase.phase === 4){
			console.log("starting phase 4")
			if (numero === 'Hub' && $scope.actionCase.vnmCorrect){
				// Ajouter nouvel objet :
				var valiseNonMaterialisee = $scope.partie.valiseNonMaterialisee;
				valiseNonMaterialisee.push($scope.actionCase.nouvelObjet);
				console.log(valiseNonMaterialisee);
				Partie.ajouterObjetValise({valiseNonMaterialisee: JSON.stringify(valiseNonMaterialisee)}).success(function(){
					$scope.partie.valiseNonMaterialisee = valiseNonMaterialisee;
					// add News event for other players:
					for (var i in $scope.autresJoueurs){
						Confrontations.add({
			        		categorie: "news",
			        		type: "valiseNonMaterialiseeSuccess",
			        		info: $scope.partie.valiseNonMaterialisee.length - 1,
			        		cible: $scope.autresJoueurs[i],
			        		source: $scope.joueurId
		        		});
					}
				}).error(function(){
					console.log("error trying to save valise non matérialisée");
				});
				$scope.actionCase.valiseNonMaterialisee = undefined;
				$scope.actionCase.description = "Tu pioches deux cartes.";
				$scope.partie.dispo.pioches.pioche += 2;
				$scope.bouton1 = "OK";
				$scope.bouton2 = "";
			}
			else {
				// add News event for other players:
				for (var i in $scope.autresJoueurs){
					Confrontations.add({
		        		categorie: "news",
		        		type: "valiseNonMaterialiseeFailure",
		        		info: $scope.actionCase.valiseNonMaterialisee.length - 1,
		        		cible: $scope.autresJoueurs[i],
		        		source: $scope.joueurId
	        		});
				}
				$scope.okButtonDisabled = true;
				$rootScope.$on('cartes-jeter-full', function(event, args) {
					$scope.okButtonDisabled = false;
					$scope.actionCase.cartesDefausse = args.cartes;
				});
				$scope.actionCaseDisplay.description = false;
				$scope.actionCaseDisplay.perteCartes = true;
				$scope.actionCase.valiseNonMaterialisee = undefined;
				$scope.bouton1 = "OK";
				$scope.bouton2 = "";
				$rootScope.$on('cartes-jeter-notfull', function(event, args) {
					$scope.okButtonDisabled = true;
				});
			}
		}
		else if ($scope.actionCase.phase === 5){
			if (numero === 'Hub'){
				var startHubPhase5 = function(){
					$scope.buttonsHidden = true;
					$scope.actionCaseDisplay.description = false;
					$scope.actionCaseDisplay.image = true;
					$scope.actionCase.description = "Bon vol vers le plateau-" + $scope.actionCase.destination + " !";
					$scope.actionCase.image = "modules/plateaux/img/avion.png";
					$timeout(function(){
						$scope.actionCase.phase = 0;
						$scope.actionsCase.action = false;
						$scope.$emit('plateaux-move-pion',{plateau: $scope.actionCase.destination,case: 'Hub'});
						if ($scope.actionCase.destination === 'labyrinthe' && $scope.plateau !== 1){
							$scope.goToPlateau(1);
						}
						else if ($scope.actionCase.destination === 'paysage' && $scope.plateau !== 0){
							$scope.goToPlateau(0);
						}
					},2000);
				}
				if ($scope.actionCase.cartesDefausse !== undefined && $scope.actionCase.cartesDefausse.length !== 0){
					console.log($scope.actionCase.cartesDefausse);
					$scope.$emit('jeu-main-jeter', {cartes: $scope.actionCase.cartesDefausse});
					$rootScope.$on('jeu-main-jeter-callback', function(event, args) {
						if (args.success){
							startHubPhase5();
						}
						else {
							$scope.actionCase.phase -= 2;
							$scope.startActionCase('action','Hub');
						}
					});
				}
				else {
					startHubPhase5();
				}
			}
		}
	}

	$scope.actionCase = {
		phase: 0
	};
	var cases = {};
	$http({
        method: 'GET', 
        url: 'modules/plateaux/json/plateaux-paysage.json'
    }).success(function(response){
    	for (var i in response){
    		for (var j in response[i].colonnes){
    			if (cases[response[i].colonnes[j].numero] === undefined){
    				cases[response[i].colonnes[j].numero] = response[i].colonnes[j];
    			}
    		}
    	}
    	$scope.actionsCase = {
    		achat: cases[$scope.joueurs[$scope.joueurId].pions[0].case].achat,
    		action: cases[$scope.joueurs[$scope.joueurId].pions[0].case].action,
    		question: cases[$scope.joueurs[$scope.joueurId].pions[0].case].question
    	};
	 //  	if (cases[$scope.joueurs[$scope.joueurId].pions[0].case].action){
		// 	$scope.actionCase.categorie = 'action';
		// 	$scope.actionCase.numero = $scope.joueurs[$scope.joueurId].pions[0].case;
		// 	$scope.startActionCase($scope.actionCase.numero);
		// }
    });

    $scope.cancelActionCase = function(){
    	$scope.actionCase.phase = 0;
    }

    $scope.nouvelObjet = function(){
    	$scope.okButtonDisabled = false;
    }

    $scope.ajouteValise = function(index){
    	if ($scope.valiseNonMaterialisee.length === $scope.actionCase.valiseNonMaterialisee.length &&
    		$scope.valiseNonMaterialisee[$scope.valiseNonMaterialiseeIndex] == $scope.actionCase.valiseNonMaterialisee[$scope.valiseNonMaterialiseeIndex]){
    		$scope.actionCase.vnmCorrect = true;
    	}
    	else if ($scope.valiseNonMaterialisee[$scope.valiseNonMaterialiseeIndex] !== $scope.actionCase.valiseNonMaterialisee[$scope.valiseNonMaterialiseeIndex]) {
    		$scope.actionCase.vnmCorrect = false;
    		$scope.okButtonDisabled = false;
    	}
    	$scope.valiseNonMaterialiseeIndex ++;
    }

}]);
'use strict';

angular.module('plateaux').controller('PlateauxGeneralController', ['$scope','$rootScope','$state','Joueurs',
	function($scope,$rootScope,$state,Joueurs) {

	function movePion(numero,plateau){
		var previousCase = $scope.joueurs[$scope.joueurId].pions[0].case;
		var previousPlateau = $scope.joueurs[$scope.joueurId].pions[0].plateau;
		var newPions = [];
		$.each($scope.joueurs[$scope.joueurId].pions,function(i,obj) {
		    newPions.push($.extend(true,{},obj)); 
		});
		newPions[0].case = numero;
		newPions[0].plateau = plateau;
		Joueurs.movePion({
			pions: JSON.stringify(newPions),
			joueurId: $scope.joueurId
		}).success(function(){
			$scope.joueurs[$scope.joueurId].pions[0].case = numero;
			$scope.joueurs[$scope.joueurId].pions[0].plateau = plateau;
			$scope.$emit('plateaux-move-pion-callback',{plateau: plateau,previousPlateau: previousPlateau,case: numero,previousCase: previousCase});
		}).error(function(error){
			console.log("napapu sauver pion");
			console.log(error);
		});
	}

	$rootScope.$on('plateaux-move-pion', function(event, args) {
		movePion(args.case,args.plateau);
	});

}]);
'use strict';

angular.module('plateaux').controller('PlateauxLabyrintheController', ['$scope','$rootScope','$timeout','$http','Partie','Joueurs',
	function($scope,$rootScope,$timeout,$http,Partie,Joueurs) {

	$scope.plateauLabyrinthe = [
		// Couronne 0
		[{
			numero: 'Hub interplanetaire',
			cle: 'jaune',
			position: 0
		}],
		// Couronne 1
		[{
			numero: 56,
			cle: 'jaune',
			position: 0
		},
		{
			numero: 57,
			cle: 'rouge_fonce',
			position: 1
		},
		{
			numero: 58,
			cle: 'bleu',
			position: 2
		},
		{
			numero: 59,
			cle: 'orange',
			position: 3
		}],
		// Couronne 2
		[{
			numero: 48,
			cle: 'bleu',
			position: 0
		},
		{
			numero: 49,
			cle: 'bleu_fonce',
			position: 1
		},
		{
			numero: 50,
			cle: 'rose_pale',
			position: 2
		},
		{
			numero: 51,
			cle: 'vert',
			position: 3
		},
		{
			numero: 52,
			cle: 'orange',
			position: 4
		},
		{
			numero: 53,
			cle: 'rouge_fonce',
			position: 5
		},
		{
			numero: 54,
			cle: 'rose_fonce',
			position: 6
		},
		{
			numero: 55,
			cle: 'violet',
			position: 7
		}],
		// Couronne 3
		[{
			numero: 32,
			cle: 'rose',
			position: 0
		},
		{
			numero: 33,
			cle: 'rose_pale',
			position: 1
		},
		{
			numero: 34,
			cle: 'jaune_fonce',
			position: 2
		},
		{
			numero: 35,
			position: 3
		},
		{
			numero: 36,
			cle: 'marron',
			position: 4
		},
		{
			numero: 37,
			cle: 'vert_pale',
			position: 5
		},
		{
			numero: 38,
			cle: 'rose_fonce',
			position: 6
		},
		{
			numero: 39,
			cle: 'vert',
			position: 7
		},
		{
			numero: 40,
			position: 8
		},
		{
			numero: 41,
			cle: 'gris',
			position: 9
		},
		{
			numero: 42,
			cle: 'bleu_fonce',
			position: 10
		},
		{
			numero: 43,
			position: 11
		},
		{
			numero: 44,
			cle: 'vert_fonce',
			position: 12
		},
		{
			numero: 45,
			cle: 'rouge',
			position: 13
		},
		{
			numero: 46,
			position: 14
		},
		{
			numero: 47,
			cle: 'violet',
			position: 15
		}],
		// Couronne 4
		[{
			numero: 'Hub',
			position: 0,
			action: 'Hub'
		},
		{
			numero: 1,
			position: 1
		},
		{
			numero: 2,
			position: 2
		},
		{
			numero: 3,
			position: 3
		},
		{
			numero: 4,
			position: 4
		},
		{
			numero: 5,
			position: 5
		},
		{
			numero: 6,
			position: 6
		},
		{
			numero: 7,
			cle: 'jaune_fonce',
			position: 7
		},
		{
			numero: 8,
			cle: 'vert_pale',
			position: 8
		},
		{
			numero: 9,
			position: 9
		},
		{
			numero: 10,
			position: 10
		},
		{
			numero: 11,
			position: 11
		},
		{
			numero: 12,
			position: 12
		},
		{
			numero: 13,
			position: 13
		},
		{
			numero: 14,
			position: 14
		},
		{
			numero: 15,
			cle: 'rose',
			position: 15
		},
		{
			numero: 16,
			cle: 'rouge',
			position: 16
		},
		{
			numero: 17,
			position: 17
		},
		{
			numero: 18,
			position: 18
		},
		{
			numero: 19,
			position: 19
		},
		{
			numero: 20,
			position: 20
		},
		{
			numero: 21,
			position: 21
		},
		{
			numero: 22,
			position: 22
		},
		{
			numero: 23,
			cle: 'gris',
			position: 23
		},
		{
			numero: 24,
			cle: 'marron',
			position: 24
		},
		{
			numero: 25,
			position: 25
		},
		{
			numero: 26,
			position: 26
		},
		{
			numero: 27,
			position: 27
		},
		{
			numero: 28,
			position: 28
		},
		{
			numero: 29,
			position: 29
		},
		{
			numero: 30,
			position: 30
		},
		{
			numero: 31,
			cle: 'vert_fonce',
			position: 31
		}]
	];

	for (var i in $scope.plateauLabyrinthe){
		for (var j in $scope.plateauLabyrinthe[i]){
			$scope.plateauLabyrinthe[i][j].joueurs = [];
			$scope.plateauLabyrinthe[i][j].pionsStyles = [];
			$scope.plateauLabyrinthe[i][j].joueursNumber = 0;
		}
	}

	function setStyle(angle,positionX,positionY){
		var style =	"{'transform': 'rotate(" + angle + "deg)','margin-left': '" + positionX + "px','margin-top': '" + positionY + "px'}"
		return style;
	}

	var positionsCases = [
		[],
		// Couronne 1
		[
			{x: -85,y: -85},
			{x: 0,y: -85},
			{x: 0,y: 0},
			{x: -85,y: 0}
		],
		// Couronne 2
		[
			{x: -133,y: -89},
			{x: -70,y: -145},
			{x: 11,y: -141},
			{x: 66,y: -79},
			{x: 62,y: 0},
			{x: 0,y: 57},
			{x: -79,y: 53},
			{x: -137,y: -9}
		],
		// Couronne 3
		[
			{x: -191,y: -69},
			{x: -166,y: -126},
			{x: -118,y: -171},
			{x: -60,y: -193},
			{x: 3,y: -191},
			{x: 61,y: -166},
			{x: 104,y: -118},
			{x: 126,y: -59},
			{x: 124,y: 0},
			{x: 100,y: 57},
			{x: 51,y: 103},
			{x: -7,y: 125},
			{x: -68,y: 124},
			{x: -126,y: 99},
			{x: -171,y: 49},
			{x: -193,y: -9}
		],
		// Couronne 4
		[
			{x: -133,y: -89},
			{x: -70,y: -145},
			{x: 11,y: -140},
			{x: 66,y: -79},
			{x: 62,y: 0},
			{x: 0,y: 57},
			{x: -79,y: 53},
			{x: -137,y: -9},
			{x: -133,y: -89},
			{x: -70,y: -145},
			{x: 11,y: -140},
			{x: 66,y: -79},
			{x: 62,y: 0},
			{x: 0,y: 57},
			{x: -79,y: 53},
			{x: -137,y: -9},
			{x: -133,y: -89},
			{x: -70,y: -145},
			{x: 11,y: -140},
			{x: 66,y: -79},
			{x: 62,y: 0},
			{x: 0,y: 57},
			{x: -79,y: 53},
			{x: -137,y: -9},
			{x: -133,y: -89},
			{x: -70,y: -145},
			{x: 11,y: -140},
			{x: 66,y: -79},
			{x: 62,y: 0},
			{x: 0,y: 57},
			{x: -79,y: 53},
			{x: -137,y: -9}
		]
	];

	var positionsCases2 = [
		[],
		// Couronne 1
		[
			{x: -120,y: -120},
			{x: 0,y: -120},
			{x: 0,y: 0},
			{x: -120,y: 0}
		],
		// Couronne 2
		[
			{x: -184.5,y: -130},
			{x: -100,y: -207},
			{x: 15,y: -200},
			{x: 92,y: -115},
			{x: 85,y: 0},
			{x: 0,y: 75},
			{x: -116,y: 68.5},
			{x: -191,y: -15.5}
		],
		// Couronne 3
		[
			// Premier quadrant
			{x: -249,y: -94},
			{x: -215,y: -171},
			{x: -155,y: -229.5},
			{x: -78,y: -259.5},
			// Deuxieme quadrant
			{x: 6,y: -257.5},
			{x: 84,y: -224},
			{x: 142.5,y: -163.5},
			{x: 173,y: -85},
			// Troisieme quadrant
			{x: 171,y: 0},
			{x: 137,y: 76.5},
			{x: 76,y: 134.5},
			{x: -1.5,y: 164.5	},
			// Dernier quadrant
			{x: -87,y: 162},
			{x: -164,y: 128},
			{x: -221.5,y: 67},
			{x: -251.5,y: -10}
		],
		// Couronne 4
		[
			// Premier quadrant
			{x: -316,y: -59},
			{x: -305,y: -113},
			{x: -283,y: -165},
			{x: -251.5,y: -211},
			{x: -213,y: -250},
			{x: -167,y: -280},
			{x: -117,y: -301},
			{x: -63.5,y: -311},
			// Deuxieme quadrant
			{x: -8,y: -311},
			{x: 47,y: -299.5},
			{x: 99,y: -278},
			{x: 144,y: -247},
			{x: 184,y: -208},
			{x: 214,y: -162},
			{x: 235,y: -111},
			{x: 246,y: -56},
			// Troisieme quadrant
			{x: 245,y: 0},
			{x: 234,y: 54},
			{x: 212.5,y: 104.5},
			{x: 181,y: 150.5},
			{x: 141.5,y: 189},
			{x: 96,y: 219},
			{x: 45,y: 240},
			{x: -9,y: 250.5},
			// Quatrieme quadrant
			{x: -65,y: 250},
			{x: -119,y: 238.5},
			{x: -170,y: 216.5},
			{x: -216,y: 186},
			{x: -255,y: 147},
			{x: -285,y: 101},
			{x: -306,y: 51},
			{x: -317,y: -3.5}
		]
	];

	positionsCases = positionsCases2;

	function setPositionCouronne(i){
		var sectionsCouronne = $scope.plateauLabyrinthe[i].length;
		var angleBase = 360 / sectionsCouronne;
		for (var j in $scope.plateauLabyrinthe[i]){
			var position = (($scope.plateauLabyrinthe[i][j].position + $scope.positionCouronnes[i]) % sectionsCouronne + sectionsCouronne) % sectionsCouronne;
			var angle = angleBase * position;
			$scope.plateauLabyrinthe[i][j].angle = angleBase * ($scope.plateauLabyrinthe[i][j].position + $scope.positionCouronnes[i]);
			$scope.plateauLabyrinthe[i][j].x = positionsCases[i][position].x;
			$scope.plateauLabyrinthe[i][j].y = positionsCases[i][position].y;
			$scope.plateauLabyrinthe[i][j].opacity = 1;
		}
	}

	// Initiate couronnes
	$rootScope.$on('partie-general-partie-loaded', function(event, args) {
		$scope.positionCouronnes = $scope.partie.positionCouronnes;
		for (var i in $scope.plateauLabyrinthe){
			if (i > 0){
				setPositionCouronne(i);
			}
		}
	});

	function getCoordinates(numero){
		var coordinates = {
			couronne: -1,
			position: -1
		}
		for (var i = 0;i < $scope.plateauLabyrinthe.length;i ++){
			for (var j = 0;j < $scope.plateauLabyrinthe[i].length;j ++){
				if ($scope.plateauLabyrinthe[i][j].numero == numero){
					coordinates = {
						couronne: i,
						position: j
					}
				}
			}
		}
		return coordinates;
	}

	// Tourner les couronnes :

	function highlightCase(i,j){
		$timeout(function(){
			$scope.plateauLabyrinthe[i][j].opacity = 0.3;
			$timeout(function(){
				$scope.plateauLabyrinthe[i][j].opacity = 1;
				$timeout(function(){
					$scope.plateauLabyrinthe[i][j].opacity = 0.3;
					$timeout(function(){
						$scope.plateauLabyrinthe[i][j].opacity = 1;
					},500);
				},500);
			},500);
		},500);
	}

	$scope.updatePositionCouronne = function(index,direction){
		var increment = -1;
		if (direction == 'down'){
			var increment = 1;
		}
		var newPositionCouronnes = $scope.positionCouronnes;
		newPositionCouronnes[index] += increment;
		Partie.changeCouronnes({
			positionCouronnes: JSON.stringify(newPositionCouronnes)
		}).success(function(){
			$scope.positionCouronnes = newPositionCouronnes;
			setPositionCouronne(index);
			for (var i = Math.max(2,index);i < Math.min(index + 2,4);i ++){
				var sectionsCouronne = $scope.plateauLabyrinthe[i].length;
				var sectionsCouronneSuperieure = $scope.plateauLabyrinthe[i-1].length;
				for (var j in $scope.plateauLabyrinthe[i]){
					var position = (($scope.plateauLabyrinthe[i][j].position + $scope.positionCouronnes[i]) % sectionsCouronne + sectionsCouronne) % sectionsCouronne;
					var positionSuperieure = ((Math.floor(position/2) - $scope.positionCouronnes[i-1]) % sectionsCouronneSuperieure + sectionsCouronneSuperieure) % sectionsCouronneSuperieure;
					if ($scope.plateauLabyrinthe[i][j].cle !== undefined && $scope.plateauLabyrinthe[i][j].cle === $scope.plateauLabyrinthe[i-1][positionSuperieure].cle){
						highlightCase(i,j);
						highlightCase(i-1,positionSuperieure);
					}
				}
			}

			// Update informations de tour de jeu :
			$scope.plateauLabyrintheTourDeJeu.de --;
			$scope.plateauLabyrintheTourDeJeu.type = 'couronnes';
			$scope.plateauLabyrintheTourDeJeu.couronne = index;
			$scope.plateauLabyrintheTourDeJeu.casesDisponibles = [];
		}).error(function(error){
			console.log('impossible de sauver la nouvelle position des couronnes');
			console.log(error);
		});
	}

	$scope.hoveredCouronne = 0;

	function couronneBlink(couronne){
		$scope.hoveredCouronne = couronne;
		$timeout(function(){
			if ($scope.hoveredCouronne === couronne){
				$scope.hoveredCouronne = - couronne;
				$timeout(function(){
					if (Math.abs($scope.hoveredCouronne) === couronne){
						$scope.hoveredCouronne = couronne;
					}
				},500);
			}
		},500);
	}

	$scope.hoverCouronne = function(couronne){
		if (couronne === 0){
			$scope.hoveredCouronne = 0;
		}
		else {
			$scope.hoveredCouronne = couronne;
			$timeout(function(){
				if ($scope.hoveredCouronne === couronne){
					$scope.hoveredCouronne = - couronne;
					// $timeout(function(){
					// 	if (Math.abs($scope.hoveredCouronne) === couronne){
					// 		$scope.hoverCouronne(couronne);
					// 	}
					// },800);
				}
			},800);
		}
	}

	$scope.flechesPositions = {
		down: [
			{},
			{left: -50,height: 50,top: 0},
			{left: -25,height: 80,top: 0},
			{left: 10,height: 110,top: 0},
			{left: 40,height: 150,top: 0}
		],
		up: [
			{},
			{left: -50,height: 50,top: -50},
			{left: -25,height: 80,top: -79},
			{left: 10,height: 110,top: -107},
			{left: 40,height: 150,top: -150}
		]
	}

	// Pions:

	// function to calculate position (and size?) of pions in case
	function updatePionsStyles(couronne,position){
		var positionsPions = [
			// Couronne 0
			[
				// 1 pion
				[{left: 46,top:46}],
				// 2 pions
				[{left: 22,top:45},{left: 65,top:24}],
				// 3 pions
				[{left: 22,top:45},{left: 65,top:24},{left: 57,top:69}]
			],
			// Couronne 1
			[
				// 1 pion
				[{left: 42,top:46}],
				// 2 pions
				[{left: 78,top:21},{left: 19,top:80}],
				// 3 pions
				[{left: 78,top:21},{left: 19,top:80},{left: 42,top:46}]
			],
			// Couronne 2
			[
				// 1 pion
				[{left: 32,top:57}],
				// 2 pions
				[{left: 50,top:23},{left: 19,top:80}],
				// 3 pions
				[{left: 32,top:57},{left: 50,top:23},{left: 23,top:94}]
			],	
			// Couronne 3
			[
				// 1 pion
				[{left: 24,top:38}],
				// 2 pions
				[{left: 29,top:18},{left: 19,top:56}],
				// 3 pions
				[{left: 32,top:57},{left: 42,top:19},{left: 9,top:32}]
			],
			// Couronne 4
			[
				// 1 pion
				[{left: 19,top:18}],
				// 2 pions
				[{left: 37,top:11},{left: 5,top:25}],
				// 3 pions
				[{left: 13,top:27},{left: 37,top:19},{left: 4,top:4}]
			]
		];
		var nombrePions = $scope.plateauLabyrinthe[couronne][position].joueurs.length;
		$scope.plateauLabyrinthe[couronne][position].pionsStyles = positionsPions[couronne][nombrePions - 1];
	}

	function addPionToCase(caseId,joueurId){
		for (var i = 0;i < $scope.plateauLabyrinthe.length;i ++){
			for (var j = 0;j < $scope.plateauLabyrinthe[i].length;j ++){
				if ($scope.plateauLabyrinthe[i][j].numero == caseId){
					$scope.plateauLabyrinthe[i][j].joueurs.push(joueurId);
					$scope.plateauLabyrinthe[i][j].joueursNumber ++;
					updatePionsStyles(i,j);
				}
			}
		}
	}

	function removePionFromCase(caseId,joueurId){
		console.log(caseId)
		for (var i = 0;i < $scope.plateauLabyrinthe.length;i ++){
			for (var j = 0;j < $scope.plateauLabyrinthe[i].length;j ++){
				if ($scope.plateauLabyrinthe[i][j].numero == caseId){
					var index = $scope.plateauLabyrinthe[i][j].joueurs.indexOf(joueurId);
					if (index >= 0){
						$scope.plateauLabyrinthe[i][j].joueurs.splice(index,1);
						$scope.plateauLabyrinthe[i][j].joueursNumber --;
						updatePionsStyles(i,j);
					}
				}
			}
		}
	}

	$rootScope.$on('partie-general-joueurs-loaded', function(event, args) {
		for (var i in $scope.joueurs){
			if ($scope.joueurs[i].pions[0].plateau === 'labyrinthe'){
				addPionToCase($scope.joueurs[i].pions[0].case,$scope.joueurs[i].id);
			}
		}
	});

	// $rootScope.$on('plateaux-labyrinthe-move-pion', function(event, args) {
	// 	$scope.joueurs[$scope.joueurId].pions[0].plateau = 'labyrinthe';
	// 	addPionToCase(args.case,$scope.joueurId);
	// 	$scope.goToPlateau(1);
	// });

	$rootScope.$on('plateaux-move-pion-callback', function(event, args) {
		if (args.plateau === 'labyrinthe'){
			addPionToCase(args.case,$scope.joueurId);
		}
		if (args.previousPlateau === 'labyrinthe'){
			removePionFromCase(args.previousCase,$scope.joueurId);
		}		
	});

	// Tour de Jeu:

	$scope.plateauLabyrintheTourDeJeu = {
		casesDisponibles: [],
		monteeDisponible: []
	};

	// Retrouver l'appartenance d'un pion à une zone d'une couronne
	function findSection(position,couronne){
		// La couronne 3 est la seule irrégulière
		if (couronne !== 3){
			var sectionsCouronne = [0,2,2,3,8];
			var sectionCouronne = sectionsCouronne[couronne];
			if (couronne !== 4){
				position = (position + 1) % $scope.plateauLabyrinthe[couronne].length; 
			}
			return(Math.floor(position / sectionCouronne));
		}
		else {
			if (position < 2){
				return(0);
			}
			else if (position < 5){
				return(1);
			}
			else if (position < 7){
				return(2);
			}
			else if (position < 10){
				return(3);
			}
			else if (position < 13){
				return(4);
			}
			else {
				return(5);
			}
		}
	}

	function rechercheCasesDisponibles(position,couronne){
		$scope.plateauLabyrintheTourDeJeu.casesDisponibles = [];
		if (couronne > 0){
			var currentSection = findSection(position,couronne);
			// recherche des cases disponibles:
			// sur la meme couronne:
			for (var i = position - $scope.plateauLabyrintheTourDeJeu.de;i <= position + $scope.plateauLabyrintheTourDeJeu.de;i ++){
				var i2 = (i + $scope.plateauLabyrinthe[couronne].length) % $scope.plateauLabyrinthe[couronne].length;
				if (findSection(i2,couronne) === currentSection){
					$scope.plateauLabyrintheTourDeJeu.casesDisponibles.push($scope.plateauLabyrinthe[couronne][i2].numero);
				}
			}
		}
	}

	function rechercheMonteeDisponible(position,couronne){
		$scope.plateauLabyrintheTourDeJeu.monteeDisponible = [];
		// recherche une possibilite de montee:
		var sectionsCouronne = $scope.plateauLabyrinthe[couronne].length;
		var positionReelle = ((position + $scope.positionCouronnes[couronne]) % sectionsCouronne + sectionsCouronne) % sectionsCouronne;
		var cle = $scope.plateauLabyrinthe[couronne][position].cle;
		if (cle !== undefined){
			if (couronne !== 0) {
				var sectionsCouronneSuperieure = $scope.plateauLabyrinthe[couronne-1].length;
				var positionSuperieure = ((Math.floor(positionReelle/2) - $scope.positionCouronnes[couronne-1]) % sectionsCouronneSuperieure + sectionsCouronneSuperieure) % sectionsCouronneSuperieure;
				if (cle === $scope.plateauLabyrinthe[couronne-1][positionSuperieure].cle){
					$scope.plateauLabyrintheTourDeJeu.monteeDisponible.push($scope.joueurs[$scope.joueurId].pions[0].case);
				}
			}
			// recherche une possibilite de descente:
			if (couronne !== 4){	
				var sectionsCouronneInferieure = $scope.plateauLabyrinthe[couronne+1].length; 
				var positionInferieure1 = ((positionReelle * 2 - $scope.positionCouronnes[couronne + 1]) % sectionsCouronneInferieure + sectionsCouronneInferieure) % sectionsCouronneInferieure;
				var positionInferieure2 = (positionInferieure1 + 1) % sectionsCouronneInferieure;
				if (cle === $scope.plateauLabyrinthe[couronne+1][positionInferieure1].cle){
					$scope.plateauLabyrintheTourDeJeu.monteeDisponible.push($scope.plateauLabyrinthe[couronne + 1][positionInferieure1].numero);
				}
				else if (cle === $scope.plateauLabyrinthe[couronne+1][positionInferieure2].cle){
					$scope.plateauLabyrintheTourDeJeu.monteeDisponible.push($scope.plateauLabyrinthe[couronne + 1][positionInferieure2].numero);
				}
			}
		}
	}

	$rootScope.$on('plateaux-labyrinthe-de', function(event, args) {
		$scope.plateauLabyrintheTourDeJeu = {
			casesDisponibles: [],
			monteeDisponible: []
		};
		var deResult = args.result;
		$scope.plateauLabyrintheTourDeJeu.de = deResult;
		var couronne = -1;
		var position = -1;
		for (var i = 0;i < $scope.plateauLabyrinthe.length;i ++){
			for (var j = 0;j < $scope.plateauLabyrinthe[i].length;j ++){
				if ($scope.plateauLabyrinthe[i][j].numero == $scope.joueurs[$scope.joueurId].pions[0].case){
					couronne = i;
					position = j;
				}
			}
		}
		rechercheCasesDisponibles(position,couronne);
		rechercheMonteeDisponible(position,couronne);
	});	

	$scope.movePion = function(numero){
		var previousCoordinates = getCoordinates($scope.joueurs[$scope.joueurId].pions[0].case);
		var newCoordinates = getCoordinates(numero);
		var newPions = [];
		$.each($scope.joueurs[$scope.joueurId].pions,function(i,obj) {
		    newPions.push($.extend(true,{},obj)); 
		});
		newPions[0].case = numero;
		Joueurs.movePion({
			pions: JSON.stringify(newPions),
			joueurId: $scope.joueurId
		}).success(function(){
			removePionFromCase($scope.joueurs[$scope.joueurId].pions[0].case,$scope.joueurId);
			$scope.joueurs[$scope.joueurId].pions[0].case = numero;
			addPionToCase(numero,$scope.joueurId);
			// Update tour de jeu :
			if (previousCoordinates.couronne === newCoordinates.couronne){
				// find shortest distance
				var sectionsCouronne = $scope.plateauLabyrinthe[previousCoordinates.couronne].length;
				var distance1 = (previousCoordinates.position - newCoordinates.position + sectionsCouronne) % sectionsCouronne;
				var distance2 = (newCoordinates.position - previousCoordinates.position + sectionsCouronne) % sectionsCouronne;
				$scope.plateauLabyrintheTourDeJeu.de -= Math.min(distance1,distance2);
			}
			$scope.plateauLabyrintheTourDeJeu.type = 'deplacement';
			if ($scope.plateauLabyrintheTourDeJeu.de === 0){
				$scope.plateauLabyrintheTourDeJeu = {
					casesDisponibles: [],
					monteeDisponible: []
				}
			}
			rechercheCasesDisponibles(newCoordinates.position,newCoordinates.couronne);
			rechercheMonteeDisponible(newCoordinates.position,newCoordinates.couronne);
		}).error(function(error){
			console.log("napapu sauver pion");
			console.log(error);
		});
	}

	$scope.monteeCouronne = function(){
		var previousCoordinates = getCoordinates($scope.joueurs[$scope.joueurId].pions[0].case);
		var position = previousCoordinates.position;
		var couronne = previousCoordinates.couronne;
		var sectionsCouronne = $scope.plateauLabyrinthe[couronne].length;
		var positionReelle = ((position + $scope.positionCouronnes[couronne]) % sectionsCouronne + sectionsCouronne) % sectionsCouronne;
		var cle = $scope.plateauLabyrinthe[couronne][position].cle;
		// Montée supérieure
		var monteeSuperieure = false;
		if (couronne !== 0){
			var sectionsCouronneSuperieure = $scope.plateauLabyrinthe[couronne-1].length;
			var positionSuperieure = ((Math.floor(positionReelle/2) - $scope.positionCouronnes[couronne-1]) % sectionsCouronneSuperieure + sectionsCouronneSuperieure) % sectionsCouronneSuperieure;
			if (couronne === 4 || cle === $scope.plateauLabyrinthe[couronne - 1][positionSuperieure].cle){
				$scope.movePion($scope.plateauLabyrinthe[couronne - 1][positionSuperieure].numero);
				rechercheCasesDisponibles(positionSuperieure,couronne - 1);
				monteeSuperieure = true;
			}
		}
		// Montée inférieure
		if (couronne !== 4 && !monteeSuperieure){
			var sectionsCouronneInferieure = $scope.plateauLabyrinthe[couronne+1].length; 
			var positionInferieure1 = ((positionReelle * 2 - $scope.positionCouronnes[couronne + 1]) % sectionsCouronneInferieure + sectionsCouronneInferieure) % sectionsCouronneInferieure;
			var positionInferieure2 = (positionInferieure1 + 1) % sectionsCouronneInferieure;
			if (cle === $scope.plateauLabyrinthe[couronne + 1][positionInferieure1].cle){
				$scope.movePion($scope.plateauLabyrinthe[couronne + 1][positionInferieure1].numero);
				rechercheCasesDisponibles(positionInferieure1,couronne + 1);
			}
			else if (cle === $scope.plateauLabyrinthe[couronne + 1][positionInferieure2].cle){
				$scope.movePion($scope.plateauLabyrinthe[couronne + 1][positionInferieure2].numero);
				rechercheCasesDisponibles(positionInferieure2,couronne + 1);
			}
		}
	}

}]);
'use strict';

angular.module('plateaux').controller('PlateauxPaysageController', ['$scope','$rootScope','$http',
	function($scope,$rootScope,$http) {

		$scope.plateauPaysage = [];

		// Usability functions

		function getCoordinates(numero){
			var coordinates = {
				col: -1,
				row: -1
			}
			for (var i = 0;i < 14;i ++){
				for (var j = 0;j < 24;j ++){
					if ($scope.plateauPaysage[i].colonnes[j].numero == numero){
						coordinates = {
							row: i,
							col: j
						}
					}
				}
			}
			return coordinates;
		}

		// Initialiser plateau paysage:
		

		function addPionToCase(coordinates,joueurId){
			if ($scope.plateauPaysage[coordinates.row].colonnes[coordinates.col].joueurs != undefined &&
				$scope.plateauPaysage[coordinates.row].colonnes[coordinates.col].joueurs.length > 0){
    			$scope.plateauPaysage[coordinates.row].colonnes[coordinates.col].joueurs.push(joueurId);
    			$scope.plateauPaysage[coordinates.row].colonnes[coordinates.col].joueursNumber ++;
    			
    		}
    		else {
    			$scope.plateauPaysage[coordinates.row].colonnes[coordinates.col].joueurs = [joueurId];
    			$scope.plateauPaysage[coordinates.row].colonnes[coordinates.col].joueursNumber = 1;
    		}
    		console.log($scope.plateauPaysage[coordinates.row].colonnes[coordinates.col]);
    	}
		
		function removePionFromCase(coordinates,joueurId){
			var index = $scope.plateauPaysage[coordinates.row].colonnes[coordinates.col].joueurs.indexOf(joueurId.toString());
			if (index >= 0){
				$scope.plateauPaysage[coordinates.row].colonnes[coordinates.col].joueurs.splice(index,1);
				$scope.plateauPaysage[coordinates.row].colonnes[coordinates.col].joueursNumber --;
			}
		}

		$rootScope.$on('partie-general-joueurs-loaded', function(event, args) {
			$http({
		        method: 'GET', 
		        url: 'modules/plateaux/json/plateaux-paysage.json'
		    }).success(function(response){
		    	$scope.plateauPaysage = response;
		    	for (var i in $scope.joueurs){
		    		if ($scope.joueurs[i].pions[0].plateau === 'paysage'){
		    			var coordinates = getCoordinates($scope.joueurs[i].pions[0].case);
		    			addPionToCase(coordinates,i);
		    		}
		    	}
		    });
		});

	    $scope.movePion = function(numero){
	    	var previousCoordinates = getCoordinates($scope.joueurs[$scope.joueurId].pions[0].case);
	    	removePionFromCase(previousCoordinates,$scope.joueurId);
	    	var coordinates = getCoordinates(numero);
	    	$scope.joueurs[$scope.joueurId].pions[0].case = numero;
	    	addPionToCase(coordinates,$scope.joueurId);
	    	$scope.partie.dispo.plateaux.paysage --;
	    	//Joueurs.movePion({numero: numero})
	    }

		$rootScope.$on('plateaux-move-pion-callback', function(event, args) {
			if (args.plateau === 'paysage'){
				addPionToCase(getCoordinates(args.case),$scope.joueurId);
			}
			if (args.previousPlateau === 'paysage'){
				removePionFromCase(getCoordinates(args.previousCase),$scope.joueurId);
			}		
		});

		$scope.selectedCase = {
			clicked: false,
			numero: -1
		};

		$scope.hoveredCase = -1;

		$scope.hoverCase = function(numero){
			$scope.hoveredCase = numero;
		}

		$scope.selectCase = function(numero){
			if ($scope.selectedCase.numero == numero){
				$scope.selectedCase.clicked = false;
				$scope.selectedCase.numero = -1;
			}
			else {
				$scope.selectedCase.clicked = true;
				$scope.selectedCase.numero = numero;
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


angular.module('plateaux').directive('redPlateauxActionCase', [
	function() {
		return {
			templateUrl: 'modules/plateaux/views/plateaux-action-case.view.html',
			restrict: 'E'
		};
	}
]);
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('regles');

'use strict';

// Setting up route
angular.module('regles').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider,$urlRouterProvider){
	// Home state routing
	$stateProvider.
	state('regles', {
		url: '/regles',
		templateUrl: 'modules/regles/views/regles.view.html'
	});

}]);