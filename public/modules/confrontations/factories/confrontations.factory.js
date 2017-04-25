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
