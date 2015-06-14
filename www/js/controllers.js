(function() {
	"use strict";

	angular.module('app.controllers', [])

	.controller('AppCtrl', AppCtrl)
	.controller('PlaylistsCtrl', function($scope) {
		$scope.playlists = [
			{ title: 'Reggae', id: 1 },
			{ title: 'Chill', id: 2 },
			{ title: 'Dubstep', id: 3 },
			{ title: 'Indie', id: 4 },
			{ title: 'Rap', id: 5 },
			{ title: 'Cowbell', id: 6 }
		];
	})
	.controller('PlaylistCtrl', function($scope, $stateParams) {
	});

	function AppCtrl(userhelper, dataservice, $rootScope) {
		var vm = this;

		vm.logout = logout;

		activate();
		function activate() {
			dataservice.me().then(processData);
		}

		function logout() {
			$rootScope.loggedUser = false;
			userhelper.remove('sesion');
		}

		function processData(result) {
			if (result && 200 === result.status) {
				$rootScope.loggedUser = result.data;
			}
		}

	};

})();