'use strict';

angular.module('partie').factory('Partie', ['$http','configService',
	function($http,configService) {
		return {
			// Get specific partie:
			getPartie: function(params){
				if (configService.local){
					return $http({
				        method: 'GET', 
				        url: 'modules/partie/json/partie.json'
				    });
				}
				else {
					return $http({
				        method: 'POST', 
				        url: 'modules/partie/php/partie.php',
				        params: params,
				        headers: {
				        	'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate'
				        }
				    });
				}
			},
			// Get all the parties:
			getAllParties: function(){
				if (configService.local){
					return $http({
				        method: 'GET', 
				        url: 'modules/partie/json/partie.json'
				    });
				}
				else {
					return $http({
				        method: 'GET', 
				        url: 'modules/partie/php/partie-get-all.php',
				        headers: {
				        	'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate'
				        }
				    });
				}
			},
			// Get all the parties:
			createPartie: function(params){
				if (configService.local){
					return $http({
				        method: 'GET', 
				        url: 'modules/partie/json/partie.json'
				    });
				}
				else {
					return $http({
				        method: 'POST', 
				        url: 'modules/partie/php/partie-create.php',
				        params: params,
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
