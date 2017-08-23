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
						cases: [{}]
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
					if (carte.info.etapes[i].cartes[j] != undefined){
						carte.info.etapes[i].cartes[j] = $scope.cartes.toutes[carte.info.etapes[i].cartes[j]].nom;
					}
				}
			}
		}
		console.log(carte);
		if (carte.pile === 'Hors Pioche' && carte.categorie === 'Objet'){
			carte.info.paiement = CartesProprietes[carte.info.paiement];
			if (carte.info.paiement === 'echange'){
				carte.info.echange = $scope.cartes.toutes[carte.info.echange].nom;
			}
			else {
				carte.info.reduction = CartesProprietes[carte.info.reduction];
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
		Cartes.getCartes({partieId: 1}).success(function(response){
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
	$scope.objetsHorsPiocheCodes = [];
	$scope.objetsHorsPiocheNoms = [];
	Cartes.getCartes({partieId: 1}).success(function(response){
		for (var i in response){
			console.log(response);
			// agreger cartes par code:
			if (response[i].pile === 'pioche' || response[i].pile === 'hors_pioche' && cartesCodes.indexOf(response[i].code < 0)){
				cartesCodes.push(response[i].code);
				$scope.cartesNoms.push(response[i].nom);
			}
			if (response[i].pile === 'hors_pioche' && response[i].categorie === 'objet' && $scope.objetsHorsPiocheCodes.indexOf(response[i].code < 0)){
				$scope.objetsHorsPiocheNoms.push(response[i].nom);
				$scope.objetsHorsPiocheCodes.push(response[i].code);
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
					paiement: textToKeyTransformation($scope.carte.info.paiement),
					consequences: [],
					contraintes: [],
					circonstances: []
				}
				if ($scope.carte.info.paiement === "Echange"){
					console.log('echange');
					var carteNom = $scope.carte.info.echange;
					console.log(carteNom);
					var carteCode = $scope.objetsHorsPiocheCodes[$scope.objetsHorsPiocheNoms.indexOf(carteNom)];
					console.log(carteCode);
					console.log($scope.objetsHorsPiocheCodes);
					console.log($scope.objetsHorsPiocheNoms);
					carte.info.echange = carteCode;
				}
				else if ($scope.carte.info.paiement === "Glutis"){
					carte.info.prix = $scope.carte.info.prix;
					carte.info.reduction = textToKeyTransformation($scope.carte.info.reduction);
				}
				populateInfo(carte.info,$scope.carte.info);
			}
		}

		else if (carte.pile === 'missions'){
			carte.info = {
				etapes: [],
				consequences: []
			}
			populateInfo(carte.info,$scope.carte.info);
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
				if ($scope.carte.info.etapes[i].cases !== undefined){
					carte.info.etapes[i].cases = [];
					for (var j in $scope.carte.info.etapes[i].cases){
						carte.info.etapes[i].cases.push($scope.carte.info.etapes[i].cases[j]);
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