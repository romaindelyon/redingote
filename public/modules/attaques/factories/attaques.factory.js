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
