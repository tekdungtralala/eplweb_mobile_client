(function() {
	"use strict";

	angular.module('app.user')
		.config(routeConfig);

	function routeConfig($stateProvider) {
		$stateProvider
			.state('app.user', {
				url: "/user",
				views: {
					'menuContent': {
						templateUrl: "js/user/user.html"
					}
				}
			})
			.state('app.user.reg', {
				url: "/reg?userModel",
				views: {
					'subcontent': {
						templateUrl: "js/user/registration/registration.html",
						controller: 'UserRegCtrl as vm'
					}
				}
			})
			;
	};

})();