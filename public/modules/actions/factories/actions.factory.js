'use strict';

angular.module('actions').factory('Actions', ['$http','configService',
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
				        url: 'modules/actions/php/actions-add.php',
				        params: params,
				        headers: {
				        	'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate',
				        	'Content-Type': 'application/json'
				        }
				    });
				}
			},
			update: function(params){
				if (configService.local){
					return $http({
				        method: 'GET', 
				        url: 'modules/joueurs/json/joueurs.json'
				    });
				}
				else {
					return $http({
				        method: 'POST', 
				        url: 'modules/actions/php/actions-update.php',
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
				        url: 'modules/actions/json/actions.json'
				    });
				}
				else {
					return $http({
				        method: 'GET', 
				        url: 'modules/actions/php/actions-get.php',
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
				        url: 'modules/actions/json/actions.json'
				    });
				}
				else {
					return $http({
				        method: 'POST', 
				        url: 'modules/actions/php/actions-delete.php',
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
