'use strict';

angular.module('accueil').controller('AccueilController', ['$scope','$state','$http','$mdDialog','$timeout','Joueurs','Partie','Cartes','Objets',
	function($scope,$state,$http,$mdDialog,$timeout,Joueurs,Partie,Cartes,Objets) {

	$scope.authentication = {
		mauvaisPasswordMessage: false
	};

	var MD5 = function(s){function L(k,d){return(k<<d)|(k>>>(32-d))}function K(G,k){var I,d,F,H,x;F=(G&2147483648);H=(k&2147483648);I=(G&1073741824);d=(k&1073741824);x=(G&1073741823)+(k&1073741823);if(I&d){return(x^2147483648^F^H)}if(I|d){if(x&1073741824){return(x^3221225472^F^H)}else{return(x^1073741824^F^H)}}else{return(x^F^H)}}function r(d,F,k){return(d&F)|((~d)&k)}function q(d,F,k){return(d&k)|(F&(~k))}function p(d,F,k){return(d^F^k)}function n(d,F,k){return(F^(d|(~k)))}function u(G,F,aa,Z,k,H,I){G=K(G,K(K(r(F,aa,Z),k),I));return K(L(G,H),F)}function f(G,F,aa,Z,k,H,I){G=K(G,K(K(q(F,aa,Z),k),I));return K(L(G,H),F)}function D(G,F,aa,Z,k,H,I){G=K(G,K(K(p(F,aa,Z),k),I));return K(L(G,H),F)}function t(G,F,aa,Z,k,H,I){G=K(G,K(K(n(F,aa,Z),k),I));return K(L(G,H),F)}function e(G){var Z;var F=G.length;var x=F+8;var k=(x-(x%64))/64;var I=(k+1)*16;var aa=Array(I-1);var d=0;var H=0;while(H<F){Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=(aa[Z]| (G.charCodeAt(H)<<d));H++}Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=aa[Z]|(128<<d);aa[I-2]=F<<3;aa[I-1]=F>>>29;return aa}function B(x){var k="",F="",G,d;for(d=0;d<=3;d++){G=(x>>>(d*8))&255;F="0"+G.toString(16);k=k+F.substr(F.length-2,2)}return k}function J(k){k=k.replace(/rn/g,"n");var d="";for(var F=0;F<k.length;F++){var x=k.charCodeAt(F);if(x<128){d+=String.fromCharCode(x)}else{if((x>127)&&(x<2048)){d+=String.fromCharCode((x>>6)|192);d+=String.fromCharCode((x&63)|128)}else{d+=String.fromCharCode((x>>12)|224);d+=String.fromCharCode(((x>>6)&63)|128);d+=String.fromCharCode((x&63)|128)}}}return d}var C=Array();var P,h,E,v,g,Y,X,W,V;var S=7,Q=12,N=17,M=22;var A=5,z=9,y=14,w=20;var o=4,m=11,l=16,j=23;var U=6,T=10,R=15,O=21;s=J(s);C=e(s);Y=1732584193;X=4023233417;W=2562383102;V=271733878;for(P=0;P<C.length;P+=16){h=Y;E=X;v=W;g=V;Y=u(Y,X,W,V,C[P+0],S,3614090360);V=u(V,Y,X,W,C[P+1],Q,3905402710);W=u(W,V,Y,X,C[P+2],N,606105819);X=u(X,W,V,Y,C[P+3],M,3250441966);Y=u(Y,X,W,V,C[P+4],S,4118548399);V=u(V,Y,X,W,C[P+5],Q,1200080426);W=u(W,V,Y,X,C[P+6],N,2821735955);X=u(X,W,V,Y,C[P+7],M,4249261313);Y=u(Y,X,W,V,C[P+8],S,1770035416);V=u(V,Y,X,W,C[P+9],Q,2336552879);W=u(W,V,Y,X,C[P+10],N,4294925233);X=u(X,W,V,Y,C[P+11],M,2304563134);Y=u(Y,X,W,V,C[P+12],S,1804603682);V=u(V,Y,X,W,C[P+13],Q,4254626195);W=u(W,V,Y,X,C[P+14],N,2792965006);X=u(X,W,V,Y,C[P+15],M,1236535329);Y=f(Y,X,W,V,C[P+1],A,4129170786);V=f(V,Y,X,W,C[P+6],z,3225465664);W=f(W,V,Y,X,C[P+11],y,643717713);X=f(X,W,V,Y,C[P+0],w,3921069994);Y=f(Y,X,W,V,C[P+5],A,3593408605);V=f(V,Y,X,W,C[P+10],z,38016083);W=f(W,V,Y,X,C[P+15],y,3634488961);X=f(X,W,V,Y,C[P+4],w,3889429448);Y=f(Y,X,W,V,C[P+9],A,568446438);V=f(V,Y,X,W,C[P+14],z,3275163606);W=f(W,V,Y,X,C[P+3],y,4107603335);X=f(X,W,V,Y,C[P+8],w,1163531501);Y=f(Y,X,W,V,C[P+13],A,2850285829);V=f(V,Y,X,W,C[P+2],z,4243563512);W=f(W,V,Y,X,C[P+7],y,1735328473);X=f(X,W,V,Y,C[P+12],w,2368359562);Y=D(Y,X,W,V,C[P+5],o,4294588738);V=D(V,Y,X,W,C[P+8],m,2272392833);W=D(W,V,Y,X,C[P+11],l,1839030562);X=D(X,W,V,Y,C[P+14],j,4259657740);Y=D(Y,X,W,V,C[P+1],o,2763975236);V=D(V,Y,X,W,C[P+4],m,1272893353);W=D(W,V,Y,X,C[P+7],l,4139469664);X=D(X,W,V,Y,C[P+10],j,3200236656);Y=D(Y,X,W,V,C[P+13],o,681279174);V=D(V,Y,X,W,C[P+0],m,3936430074);W=D(W,V,Y,X,C[P+3],l,3572445317);X=D(X,W,V,Y,C[P+6],j,76029189);Y=D(Y,X,W,V,C[P+9],o,3654602809);V=D(V,Y,X,W,C[P+12],m,3873151461);W=D(W,V,Y,X,C[P+15],l,530742520);X=D(X,W,V,Y,C[P+2],j,3299628645);Y=t(Y,X,W,V,C[P+0],U,4096336452);V=t(V,Y,X,W,C[P+7],T,1126891415);W=t(W,V,Y,X,C[P+14],R,2878612391);X=t(X,W,V,Y,C[P+5],O,4237533241);Y=t(Y,X,W,V,C[P+12],U,1700485571);V=t(V,Y,X,W,C[P+3],T,2399980690);W=t(W,V,Y,X,C[P+10],R,4293915773);X=t(X,W,V,Y,C[P+1],O,2240044497);Y=t(Y,X,W,V,C[P+8],U,1873313359);V=t(V,Y,X,W,C[P+15],T,4264355552);W=t(W,V,Y,X,C[P+6],R,2734768916);X=t(X,W,V,Y,C[P+13],O,1309151649);Y=t(Y,X,W,V,C[P+4],U,4149444226);V=t(V,Y,X,W,C[P+11],T,3174756917);W=t(W,V,Y,X,C[P+2],R,718787259);X=t(X,W,V,Y,C[P+9],O,3951481745);Y=K(Y,h);X=K(X,E);W=K(W,v);V=K(V,g)}var i=B(Y)+B(X)+B(W)+B(V);return i.toLowerCase()};

	$scope.goToPartie = function(partieId,joueurId){
		for (var i = 0;i < $scope.parties.length;i ++){
			$scope.parties[i].showPassword = [false,false,false];
		}
		console.log("here !!!");
		$scope.authentication.mauvaisPasswordMessage = false;
		$scope.authentication.password = "";
		for (var i = 0;i < $scope.parties.length;i ++){
			if ($scope.parties[i].id === partieId){
				console.log($scope.parties[i].passwords[joueurId]);
				if ($scope.parties[i].passwords[joueurId] === 'not_set'){
					var setPasswordPopup = $mdDialog.confirm({
			        	templateUrl: 'modules/accueil/views/accueil-password-set.view.html',
			        	clickOutsideToClose: true,
					    controller: function($scope,$mdDialog,$timeout){
					    	$scope.displayMismatchMessage = false;
					    	$scope.popupCancel = function(){
					    		$mdDialog.cancel();
					    	}
					    	$scope.popupConfirm = function(){
					    		$scope.displayMismatchMessage = false;
					    		if ($scope.authentication.password === $scope.authentication.passwordConfirmation){
					    			console.log($scope.authentication.password);
						        	console.log(MD5($scope.authentication.password));
						        	Joueurs.setPassword({partieId: partieId,joueurId: joueurId,password: MD5($scope.authentication.password)}).success(function(){
						        		console.log("password has been set");
						        		$mdDialog.hide();
						        	}).error(function(){
						        		console.log("ERROR setting password");
						        	});
					    		}
					    		else {
					    			$timeout(function(){
					    				$scope.displayMismatchMessage = true;
					    			},500);
					    		}
					    	}
			            }
			        });
			        $mdDialog.show(setPasswordPopup).then(function(){
			        	$state.go('partie',{partie: partieId,joueur: joueurId});
			        }).catch(function(){
			        	console.log("closing popup");
			        });
				}
				else {
					$scope.parties[i].showPassword[joueurId] = true;
				}
			}
		}
	}

	$scope.submitPassword = function(partieId,joueurId){
		for (var i = 0;i < $scope.parties.length;i ++){
			if ($scope.parties[i].id === partieId){
				if (MD5($scope.authentication.password) === $scope.parties[i].passwords[joueurId]){
					$state.go('partie',{partie: partieId,joueur: joueurId});
				}
				else {
					console.log("here");
					$scope.authentication.mauvaisPasswordMessage = true;
				}
			}
		}
	}

	Partie.getAllParties().success(function(response){
		console.log(response);
		$scope.parties = response;
		for (var i = 0;i < $scope.parties.length;i ++){
			var findPasswords = function(index){
				Joueurs.getJoueurs({partieId: $scope.parties[index].id}).success(function(joueurs){
					$scope.parties[index].passwords = [];
					for (var i = 0;i < joueurs.length;i ++){
						$scope.parties[index].passwords[joueurs[i].id] = joueurs[i].password;
					}
				}).error(function(){
					console.log("error getting joueurs");
				});
			}(i);
			$scope.parties[i].showPassword = [false,false,false];
		}
		console.log($scope.parties);
	});

	 function findZoneKey(zone){
		var zoneKey = zone;
		zoneKey = zoneKey.replace("é","e");
		zoneKey = zoneKey.replace("è","e");
		zoneKey = zoneKey.replace("ê","e");
		zoneKey = zoneKey.replace(" ","_");
		zoneKey = zoneKey.replace(" ","_");
		zoneKey = zoneKey.toLowerCase();
		return(zoneKey);
	}

	$scope.creerPartie = function(){
		var dispo = {
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
			action_de_case: false,
			tourDeJeu: {
				actionEnCours: false,
				notification: [0,0],
				recompense: [0,0],
				action: [0,0],
				deplacement: [0,0],
				question: [0,0],
				achat: [0,0],
				'trois-familles': [0,0],
				duel: [0,0]
			}
		};
		var nom = 'Première partie';//$scope.partie.nom;
		var tour_joueur = 0;//$scope.nouvellePartie.tour_joueur;
		Partie.createPartie({dispo: dispo,nom: nom,tour_joueur: tour_joueur}).success(function(partieId){
			// On répartit les cartes en piles piochables
			Cartes.getCartes({partieId: 0}).success(function(cartes){
				var missions = [];
				var humeurs= [];
				var pile = [];
				for (var i = 0;i < cartes.length;i ++){
					var carte = cartes[i];
					// On assigne les humeurs et les missions :
					if (carte.pile === 'humeurs'){
						humeurs.push(carte);
					}
					else if (carte.pile === 'missions' && carte.categorie !== 'copie'){// ajouter filtre par type
						missions.push(carte);
					}
					else if (carte.pile === 'pioche'){
						pile.push(carte);
					}
					cartes[i].position = -1;
					cartes[i].statut = {};
				}
				console.log(missions);
				$http({
		        	method: 'GET', 
		        	url: 'modules/plateaux/json/plateaux-paysage.json'
			    }).success(function(response){
			    	var plateauPaysage = response;
			    	Joueurs.getJoueurs({partieId: 0}).success(function(joueurs){
			    		console.log(joueurs);
			    		var missionIndices = [];
			    		var humeurIndices = [];
			    		var pileIndices = [];
			    		console.log(missions.length);
			    		console.log(humeurs.length);
			    		console.log(pile.length);
			    		if (missions.length >= 3){
							while (missionIndices.length < 3){
							    var randomnumber = Math.floor(Math.random() * missions.length)
							    if (missionIndices.indexOf(randomnumber) < 0){
							    	missionIndices.push(randomnumber);
							    }
							}
			    		}
			    		if (humeurs.length >= 3){
							while (humeurIndices.length < 3){
							    var randomnumber = Math.floor(Math.random() * humeurs.length)
							    if (humeurIndices.indexOf(randomnumber) < 0){
							    	humeurIndices.push(randomnumber);
							    }
							}
						}
						if (pile.length >= 12){
							while (pileIndices.length < 12){
							    var randomnumber = Math.floor(Math.random() * pile.length)
							    if (pileIndices.indexOf(randomnumber) < 0){
							    	pileIndices.push(randomnumber);
							    }
							}
						}
						var pileIds = [];
						for (var j = 0;j < pileIndices.length;j ++){
							pileIds.push(pile[pileIndices[j]].id);
						}
						for (var i = 0;i < joueurs.length;i ++){
							console.log("processing joueur "+ i);
							console.log(pileIds);
							var pileIdsJoueur = pileIds.slice(i*4,i*4+4);
							console.log(pileIdsJoueur);
							for (var j = 0;j < cartes.length;j ++){
								if (cartes[j].id === missions[missionIndices[i]].id){
									cartes[j].position = i;
									console.log("found mission "+i);
									cartes[j].statut = {statut: 'open', info: cartes[j].info};
								}
								else if (cartes[j].id === humeurs[humeurIndices[i]].id || pileIdsJoueur.indexOf(cartes[j].id) >= 0){
									cartes[j].position = i;
									console.log("found humeur or pile "+i);
								}
							}
							joueurs[i].notes_titre = "";
							joueurs[i].notes = {};
							var row = 0;
							var colonne = 0;
							for (var x = 0;x < plateauPaysage.length;x ++){
								for (var y = 0;y < plateauPaysage[x].colonnes.length;y ++){
									if (plateauPaysage[x].colonnes[y].numero.toString() === humeurs[humeurIndices[i]].info.maison){
										row = x;
										colonne = y;
										plateauPaysage[x].colonnes[y].zoneKey = [];
						    			for (var k = 0;k < plateauPaysage[x].colonnes[y].zones.length;k ++){
						    				plateauPaysage[x].colonnes[y].zoneKey.push(findZoneKey(plateauPaysage[x].colonnes[y].zones[k]));
						    			}
									}
								}
							}
							joueurs[i].pions = JSON.stringify([{
								plateau : 'paysage',
								case: humeurs[humeurIndices[i]].info.maison,
								position: 5,
								row: row,
								colonne: colonne,
								zone: plateauPaysage[row].colonnes[colonne].zoneKey[0]
							}]);
							joueurs[i].partie = partieId;
							joueurs[i].escalier = 1;
							joueurs[i].belette = 0;
							joueurs[i].diable = 0;
							joueurs[i].marsouin = 0;
							console.log(joueurs[i]);
							Joueurs.create(joueurs[i]).success(function(){
								console.log("created joueur");
							}).error(function(){
								console.log("error creating joueur");
							});
						}
						// on peut creer les cartes :
						for (var i = 0;i < cartes.length;i ++){
							var carte = cartes[i];
							if (carte.pile !== 'missions' || carte.categorie !== 'copie'){
								carte.partie = partieId;
								carte.utilisation = JSON.stringify(carte.utilisation);
								console.log(carte);
								Cartes.createCarte(carte).success(function(){
									console.log('carte créé');
								}).error(function(){
									console.log("error de création de carte");
								});
							}
						}
					}).error(function(error){
						console.log(error);
					});
			    });
				Objets.getObjets({partieId: 0}).success(function(objets){
					for (var i = 0;i < objets.length;i ++){
						var objet = objets[i];
						objet.partie = partieId;
						Objets.createObjet(objet).success(function(){
							console.log('objet créé');
						}).error(function(){
							console.log("error de création d'objet");
						});
					}
				}).error(function(error){
					console.log("error getting objets");
				});
			}).error(function(error){
				console.log("error getting cartes");
			});
		}).error(function(){
			console.log("error creating partie");
		});
	}

}]);
