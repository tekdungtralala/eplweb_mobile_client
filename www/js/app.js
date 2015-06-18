(function() {
	"use strict";

	angular.module('app', [
		'ionic',
		'chart.js',

		'app.core',
		'app.home',
		'app.matchday',
		'app.ranks',
		'app.user',
		'app.controllers'
	])
	.run(appRun)
	.config(configuration);

	function appRun($ionicPlatform, $ionicSideMenuDelegate, $rootScope, dataservice) {

		$ionicPlatform.ready(function() {
			if (window.StatusBar) {
				// org.apache.cordova.statusbar required
				// StatusBar.styleDefault();
				StatusBar.hide();
			}

			document.addEventListener('touchstart', function (event) {
				if ($ionicSideMenuDelegate.isOpenLeft()) {
					event.preventDefault();
				}
			});
		});

		$rootScope.socialSignin = function (socialType) {
			dataservice.socialMediaSignin(socialType);
		}
		
	};

	function configuration($stateProvider, $urlRouterProvider, ChartJsProvider) {

    ChartJsProvider.setOptions({
      
    });

		// if none of the above states are matched, use this as the fallback
		$urlRouterProvider.otherwise('/app/home');

		$stateProvider
			.state('app', {
				url: "/app",
				abstract: true,
				templateUrl: "templates/menu.html",
				controller: 'AppCtrl as vm'
			})
			.state('app.search', {
				url: "/search",
				views: {
					'menuContent': {
						templateUrl: "templates/search.html"
					}
				}
			})
			.state('app.browse', {
				url: "/browse",
				views: {
					'menuContent': {
						templateUrl: "templates/browse.html"
					}
				}
			})
			.state('app.playlists', {
				url: "/playlists",
				views: {
					'menuContent': {
						templateUrl: "templates/playlists.html",
						controller: 'PlaylistsCtrl'
					}
				}
			})
			.state('app.single', {
				url: "/playlists/:playlistId",
				views: {
					'menuContent': {
						templateUrl: "templates/playlist.html",
						controller: 'PlaylistCtrl'
					}
				}
			});
	};

})();