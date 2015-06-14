(function() {
	"use strict";

	angular
		.module("app.core")
		.factory("userhelper", UserHelper);

	function UserHelper($rootScope, $window) {
		var EPL_AUTH_HEADER = "epl-authentication";

		var service = {
			saveUserLogged: saveUserLogged,
			set: set,
			get: get,
			remove: remove,
			getConf: getConf
		};
		return service;

		function saveUserLogged(data) {
			$rootScope.loggedUser = data.userNetwork.user;
			set('session', data.session);
			/*
				data is json with structure below
				id,loginTime,role(2),session,
				userNetwork {
					email, id, type, userNetworkId, 
					user {
						firstName, id, imageUrl, lastName, username
					}
				}
			*/
		}

		function getConf(o, method, url) {
			var req = {
				method: method,
				url: url,
				headers: {
					"Content-Type": "application/json"
				}
			}

			if (o) {
				req.data = JSON.stringify(o);
			}

			var userSession = get('session');
			if (userSession)
				req.headers[EPL_AUTH_HEADER] = userSession;

			return req;
		}

		function remove(key) {
			$window.localStorage.removeItem(key);
		}

		function set(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
		}

		function get(key) {
      return JSON.parse($window.localStorage[key] || '{}');
		}
	}
})();