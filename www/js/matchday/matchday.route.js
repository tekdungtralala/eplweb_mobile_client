(function() {
	"use strict";

	angular.module('app.matchday')
		.config(routeConfig);

	function routeConfig($stateProvider) {
		$stateProvider
			.state('app.matchday', {
				cache: false,
				url: "/matchday?week",
				views: {
					'menuContent': {
						templateUrl: "js/matchday/matchday.html",
						controller: "MatchdayCtrl as vm"
					}
				}
			})
			.state('app.rating', {
				cache: false,
				url: "/rating?match",
				views: {
					'menuContent': {
						templateUrl: "js/matchday/rating/rating.html",
						controller: "RatingCtrl as vm"
					}
				}
			})
			.state('app.voting', {
				cache: false,
				url: "/voting?match",
				views: {
					'menuContent': {
						templateUrl: "js/matchday/voting/voting.html",
						controller: "VotingCtrl as vm"
					}
				}
			})
			;
	};

})();