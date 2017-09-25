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

	$scope.addUtilisation = function(){
		console.log($scope.carte.utilisation);
		$scope.carte.utilisation.push({
			action: null,
			consequences: [{}],
			circonstances: [{}],
			contraintes: []
		});
	}
	
	$scope.updateCategorie = function(){
		$scope.minUtilisations = $scope.piles[$scope.carte.pile].categories[$scope.carte.categorie].minUtilisations;
		$scope.maxUtilisations = $scope.piles[$scope.carte.pile].categories[$scope.carte.categorie].maxUtilisations;
		var utilisationsToAdd = $scope.minUtilisations - $scope.carte.utilisation.length;
		for (var i = 0;i < utilisationsToAdd;i ++){
			$scope.addUtilisation();
		}
		var utilisationsToRemove = $scope.carte.utilisation.length - $scope.maxUtilisations;
		console.log($scope.carte.utilisation);
		$scope.carte.utilisation.splice($scope.maxUtilisations,utilisationsToRemove);
		if ($scope.carte.pile === 'Pioche' && $scope.carte.categorie === 'Objet'){
			$scope.carte.utilisation[0].objet = "Objet 1";
			$scope.carte.utilisation[1].objet = "Objet 2";
		}
	}

	$scope.changeTab = function(index){
		if ($scope.focusedTab === 6 && index !== 6){
			initializeCartes();	
		}
		$scope.focusedTab = index;
		if ($scope.tabs[index].id != 'nouvelle_carte' && $scope.tabs[index].id != 'objets'){
			$scope.cartesTable = $scope.cartes[$scope.tabs[index].id];
			if ($scope.tabs[index].id == 'humeurs'){
				$scope.view = 'table_humeurs';
			}
			else {
				$scope.view = 'table_cartes';
			}
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
				utilisation: [],
				info: {
					echangeQuantite: 1,
					etapes: [{
						cartes: [{}],
						cases: [{}]
					}]
				}
			};
			$scope.addUtilisation();
			$scope.carte.nombreDeCartes = 1;
			$scope.minUtilisations = 1;
			$scope.maxUtilisations = 10;
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
		if (type === 'carte'){
			carte.pile = CartesProprietes[carte.pile];
			carte.categorie = CartesProprietes[carte.categorie];
		}
		if (carte.categorie == 'Action'){
			carte.info.action.type = CartesProprietes[carte.info.action.type];
		}
		if (carte.pile === 'Missions'){
			for (var i in carte.info.etapes){
				carte.info.etapes[i].categorie = CartesProprietes[carte.info.etapes[i].categorie]
				for (var j in carte.info.etapes[i].cartes){
					if (carte.info.etapes[i].cartes[j] != undefined){
						carte.info.etapes[i].cartes[j] = {nom: $scope.cartes.toutes[carte.info.etapes[i].cartes[j].code].nom};
					}
				}
			}
		}
		if (carte.pile === 'Hors Pioche' && carte.categorie === 'Objet'){
			carte.info.paiement = CartesProprietes[carte.info.paiement];
			if (carte.info.paiement === 'Echange'){
				for (var i = 0;i < carte.info.echange.length;i ++){
					console.log(carte.info.echange[i]);
					carte.info.echange[i] = $scope.cartes.toutes[carte.info.echange[i]].nom;
				}
				carte.info.echangeQuantite = carte.info.echange.length;
			}
			else {
				carte.info.reduction = CartesProprietes[carte.info.reduction];
			}
		}
		for (var i in carte.types){
			carte.types[CartesProprietes[i]] = carte.types[i];
		}
		for (var i = 0;i < carte.utilisation.length;i ++){
			if (carte.utilisation[i].consequences != undefined){
				var proprietes = ['consequences','contraintes','circonstances'];
				for (var j in proprietes){
					var prop = proprietes[j];
					carte[prop] = [];
					for (var k in carte.utilisation[prop]){
						carte.utilisation[i][prop][k].categorie = CartesProprietes[carte.utilisation[i][prop][k].categorie];
						carte.utilisation[i][prop][k].type = CartesProprietes[carte.utilisation[i][prop][k].type];
						carte.utilisation[i][prop][k].valeur = CartesProprietes[carte.utilisation[i][prop][k].valeur];
						carte.utilisation[i][prop][k].joueur = CartesProprietes[carte.utilisation[i][prop][k].joueur];
					}
				}
				if (carte.utilisation[i].objet !== undefined){
					carte.utilisation[i].objet = "Objet " + (carte.utilisation[i].objet + 1).toString();
				}	
			}
			else {
				carte.utilisation = [];
			}
		}
	}

	$scope.modifierCarte = function(code){
		console.log($scope.cartes.toutes);
		console.log(code);
		$scope.carte = jQuery.extend(true, {}, $scope.cartes.toutes[code]);
		console.log($scope.cartes.toutes[code]);
		if ($scope.carte.pile === 'pioche' && $scope.carte.categorie === 'objet'){
			$scope.objets = [
				{types:[]},
				{types:[]}
			];
			$scope.objets[0] = $scope.cartes.objets[$scope.carte.info[0]];
			keyToTextTransformation($scope.objets[0],'objet');
			$scope.objets[1] = $scope.cartes.objets[$scope.carte.info[1]];
			keyToTextTransformation($scope.objets[1],'objet');
		}
		else if ($scope.cartes.toutes[code].ouverture >= 0){
			$scope.carte.ouverture = true;
		}
		if ($scope.cartes.toutes[code].action.length > 0){
			console.log($scope.cartes.toutes[code].action.length);
			$scope.carte.action = true;
		}
		$scope.carte.nombreDeCartes = $scope.carte.statuts.length;
		keyToTextTransformation($scope.carte,'carte');
		$scope.view = 'modifier_carte';
		$scope.focusedTab = 6;
		$scope.updateCategorie();
	}

	// Get cartes

	function initializeCartes(){
		Cartes.getCartes({partieId: 0}).success(function(response){
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
			console.log($scope.cartesTable);
			Objets.getObjets({partieId: 0}).success(function(responseObjets){
				for (var i in responseObjets){
					// agreger objets par code:
					if ($scope.cartes.objets[responseObjets[i].code] === undefined){
						$scope.cartes.objets[responseObjets[i].code] = responseObjets[i];
					}
				}
			});
		});
	}
	initializeCartes();

	var cartesCodes = [];
	$scope.cartesNoms = [];
	$scope.objetsHorsPiocheCodes = [];
	$scope.objetsHorsPiocheNoms = [];
	Cartes.getCartes({partieId: 0}).success(function(response){
		for (var i in response){
			// agreger cartes par code:
			if (response[i].pile === 'pioche' || response[i].pile === 'hors_pioche' && cartesCodes.indexOf(response[i].code) < 0){
				cartesCodes.push(response[i].code);
				$scope.cartesNoms.push(response[i].nom);
			}
			if (response[i].pile === 'hors_pioche' && response[i].categorie === 'objet' && $scope.objetsHorsPiocheCodes.indexOf(response[i].code) < 0){
				$scope.objetsHorsPiocheNoms.push(response[i].nom);
				$scope.objetsHorsPiocheCodes.push(response[i].code);
			}
		}
	});

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
    console.log($scope.cases);
	var zones = ['Désert','ForĂŞt','Mer','Marécages','Monde onirique','Montagne','Prairie','Royaume des ténèbres','Village','Ville','Zone industrielle'];
	var typesObjets = ['Animal','Chat','Combustible','Comestible','Electrique','Insecte','Marin','Métallique','Potion bénéfique','Potion malefique','Toxique'];
	var typesActions = ['Combustible','Faim','Insecte','Nuit','Soif','Toxique'];
	$scope.typesHumeurs = ['Négative','Russe','Triste'];
	var deplacement_avantages = ["Crapauduc","Respiration sous l'eau","Vitesse doublée"];

	$scope.familles = [
		"Conducteurs de bus",
		"Jeux de tarot",
		"Cabines téléphoniques"
	];

	$scope.piles = {
		'Pioche': {
			'categories': {
				'Objet': {
					'minUtilisations': 2,
					'maxUtilisations': 10,
					'types': typesObjets
				},
				'Action': {
					'minUtilisations': 1,
					'maxUtilisations': 10,
					'info': {
						'actions': {
							'types': ['Immédiat','Piège','Test']
						}
					},
					'types': typesActions
				},
				'Combat': {
					'minUtilisations': 0,
					'maxUtilisations': 0
				},
				'Effet immédiat': {
					'minUtilisations': 0,
					'maxUtilisations': 0
				},
				'Grande carte': {
					'minUtilisations': 0,
					'maxUtilisations': 0
				},
				'Orc': {
					'minUtilisations': 0,
					'maxUtilisations': 0
				},
				'Personnage': {
					'minUtilisations': 1,
					'maxUtilisations': 10
				},
				'Pouilleux': {
					'minUtilisations': 0,
					'maxUtilisations': 0
				},
				'Trois familles': {
					'minUtilisations': 0,
					'maxUtilisations': 0
				}
			}
		},
		'Hors Pioche': {
			'categories': {
				'Objet': {
					'minUtilisations': 1,
					'maxUtilisations': 10
				},
				'Grande carte': {
					'minUtilisations': 0,
					'maxUtilisations': 0
				}
			}
		},
		'Humeurs': {
			'categories': {
				'Humeur': {
					'minUtilisations': 1,
					'maxUtilisations': 10
				}
			}
		},
		'Missions': {
			'categories': {
				'Normale': {
					'minUtilisations': 1,
					'maxUtilisations': 10
				},
				'Spéciale': {
					'minUtilisations': 1,
					'maxUtilisations': 10
				}
			}
		}
	};

    function replaceSpecialCharacters(string){
		string = string.replace(" : ", "_");
		string = string.replace(" ", "_");
		string = string.replace("-", "_");
		string = string.replace("é","e");
		string = string.replace("è","e");
		string = string.replace("ĂŞ","e");
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
				valeur: textToKeyTransformation(previousObject.consequences[i].valeur),
				joueur: textToKeyTransformation(previousObject.consequences[i].joueur)
			});
		}
		for (var i in previousObject.contraintes){
			newObject.contraintes.push({
				categorie: textToKeyTransformation(previousObject.contraintes[i].categorie),
				type: textToKeyTransformation(previousObject.contraintes[i].type),
				valeur: textToKeyTransformation(previousObject.contraintes[i].valeur),
				joueur: textToKeyTransformation(previousObject.contraintes[i].joueur)
			});
		}
		for (var i in previousObject.circonstances){
			newObject.circonstances.push({
				categorie: textToKeyTransformation(previousObject.circonstances[i].categorie),
				type: textToKeyTransformation(previousObject.circonstances[i].type),
				valeur: textToKeyTransformation(previousObject.circonstances[i].valeur),
				joueur: textToKeyTransformation(previousObject.circonstances[i].joueur)
			});
		}
    }

	$scope.submitForm = function(){
		console.log($scope.carte.nombreDeCartes);
		console.log($scope.carte);
		$scope.submitButtonDisabled = true;

		var carte = {
			nom: $scope.carte.nom,
			code: $scope.carte.code,
			pile: textToKeyTransformation($scope.carte.pile),
			categorie: textToKeyTransformation($scope.carte.categorie),
			utilisation: [],
			action: [],
			ouverture: -1,
			types: {},
			info: {},
			statut: {}
		}

		for (var i in $scope.carte.types){
			carte.types[textToKeyTransformation(i)] = $scope.carte.types[i];
		}

		// Transfer carte action :
		for (var i = 0;i < $scope.carte.utilisation.length;i ++){
			if ($scope.carte.utilisation[i].action){
				carte.action.push(i);
			}
		}
		carte.action = JSON.stringify(carte.action);

		// Transfer carte ouverture :
		console.log(carte);
		if (carte.pile === 'pioche' && carte.categorie === 'objet'){
			for (var i = 0;i < $scope.carte.utilisation.length;i ++){
				if (carte.ouverture < 2 && $scope.carte.utilisation[i].ouverture){
					if (carte.ouverture < 0){
						carte.ouverture = $scope.carte.utilisation[i].objet.substring(6,7) - 1;
					}
					else if (carte.ouverture < 2 && carte.ouverture !== $scope.carte.utilisation[i].objet.substring(6,7) - 1){
						carte.ouverture = 2;
					}
				}
			}
			console.log ("ouverture de carte is "+carte.ouverture);
		}
		else {
			for (var i = 0;i < $scope.carte.utilisation.length;i ++){
				if ($scope.carte.utilisation[i].ouverture){
					carte.ouverture = 0;
				}
			}
		}
		
		// Transfer carte utilisation :
		for (var i = 0;i < $scope.carte.utilisation.length;i ++){
			carte.utilisation.push({
				nom: $scope.carte.utilisation[i].nom,
				objet: "",
				action: $scope.carte.utilisation[i].action,
				ouverture: $scope.carte.utilisation[i].ouverture,
				consequences: [],
				contraintes: [],
				circonstances: []
			});
			populateInfo(carte.utilisation[i],$scope.carte.utilisation[i]);
			if ($scope.carte.utilisation[i].objet != undefined){
				$scope.carte.utilisation[i].objet.substring(6,7) - 1
			}
		}

		// Transfer carte info:

		if (carte.pile == 'pioche'){
			if (carte.categorie == 'action'){
				carte.info = {
					action: {
						type: textToKeyTransformation($scope.carte.info.action.type)
					},
					cible: textToKeyTransformation($scope.carte.info.cible)
				}
			}
			else if (carte.categorie == 'trois_familles'){
				carte.info = {
					famille: textToKeyTransformation($scope.carte.info.famille)
				}
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
						info: {},
						statut: {}
					});
					for (var j in $scope.objets[i].types){
						objets[i].types[textToKeyTransformation(j)] = $scope.objets[i].types[j];
					}
				}
			}
		}

		else if (carte.pile == 'humeurs'){
			carte.info = {
				maison: $scope.carte.info.maison,
				nomSims: $scope.carte.info.nomSims,
				ami: $scope.carte.info.ami,
				ennemi: $scope.carte.info.ennemi
			}
		}

		else if (carte.pile === 'hors_pioche'){
			if (carte.categorie === 'objet'){
				carte.info = {
					case: textToKeyTransformation($scope.carte.info.case),
					paiement: textToKeyTransformation($scope.carte.info.paiement)
				}
				if ($scope.carte.info.paiement === "Echange"){
					carte.info.echange = [];
					for (var i in $scope.carte.info.echange){
						var carteNom = $scope.carte.info.echange[i];
						var carteCode = $scope.objetsHorsPiocheCodes[$scope.objetsHorsPiocheNoms.indexOf(carteNom)];
						carte.info.echange[i] = carteCode;
					}
				}
				else if ($scope.carte.info.paiement === "Glutis"){
					carte.info.prix = $scope.carte.info.prix;
					carte.info.reduction = textToKeyTransformation($scope.carte.info.reduction);
				}
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
						if ($scope.carte.info.etapes[i].cartes[j].nom != undefined){
							var carteNom = $scope.carte.info.etapes[i].cartes[j].nom;
							var carteCode = $scope.objetsHorsPiocheCodes[$scope.objetsHorsPiocheNoms.indexOf(carteNom)];
							carte.info.etapes[i].cartes.push({code: carteCode});
						}
					}
				}
				if ($scope.carte.info.etapes[i].cases !== undefined){
					carte.info.etapes[i].cases = [];
					for (var j in $scope.carte.info.etapes[i].cases){
						carte.info.etapes[i].cases.push($scope.carte.info.etapes[i].cases[j]);
					}
				}				
			}
		}

		if ($scope.view === 'nouvelle_carte'){
			Cartes.createAll(carte).success(function(){
				console.log(carte);
				$scope.submitButtonDisabled = false;
				$scope.carteSubmitted = true;
				$scope.carteImageFileName = "cartes_"+carte.pile+"_"+carte.code+".png";
				if (carte.pile == 'pioche' && carte.categorie == 'objet'){
					Objets.createAll(objets[0]);
					Objets.createAll(objets[1]);
					console.log(objets);
				}
				for (var i = 1;i < $scope.carte.nombreDeCartes;i ++){
					Cartes.createAll(carte).success(function(){
						console.log("Encore une carte créée");
					}).error(function(){
						console.log("échec de création de cartes supplémentaires");
					})
				}
			}).error(function(){
				console.log('error');
				$scope.submitButtonDisabled = false;
			});
		}
		else {
			carte.id = $scope.carte.id;
			console.log(carte);
			Cartes.modifierCarte(carte).success(function(){
				if (carte.pile == 'pioche' && carte.categorie == 'objet'){
					objets[0].id = $scope.objets[0].id;
					objets[1].id = $scope.objets[1].id;
					console.log(objets);
					Objets.modifierObjet(objets[0]);
					Objets.modifierObjet(objets[1]);
					console.log(objets);
				}
				console.log($scope.carte.statuts.length);
				console.log($scope.carte.nombreDeCartes);
				for (var i = $scope.carte.statuts.length;i < $scope.carte.nombreDeCartes;i ++){
					console.log(i)
					Cartes.createAll(carte).success(function(){
						console.log("Encore une carte créée");
					}).error(function(){
						console.log("échec de création de cartes supplémentaires");
					})
				}
				$scope.changeTab(0);
				$scope.submitButtonDisabled = false;
			}).error(function(){
				console.log('error');
				$scope.submitButtonDisabled = false;
			});			
		}
	}
}]);
