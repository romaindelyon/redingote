angular.module('confrontations').service('ConfrontationsAttaqueService',
	['$mdDialog','Cartes',
	function($mdDialog,Cartes) {

	var confrontationsAttaquesFunctions = {};

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

	confrontationsAttaquesFunctions.utiliser = function(scope,carte){
		scope.attaque.active = true;
		scope.attaque.categorie = 'action';
		scope.attaque.carte = carte;
		addAttaqueDescription(scope,carte.action);
	}

	return(confrontationsAttaquesFunctions);
}]);