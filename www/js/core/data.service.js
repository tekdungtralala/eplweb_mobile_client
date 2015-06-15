(function() {
	"use strict";
	angular
		.module("app.core")
		.factory("dataservice", Dataservice);

	function Dataservice($state, $q, $http, $rootScope, $ionicLoading, $ionicPopup, 
		userhelper) {

		var ADDRESS_URL = "localhost";
		ADDRESS_URL = "162.220.10.249";
		ADDRESS_URL = "weekendmatch.info";
		var API_URL = "http://" + ADDRESS_URL;

		var userData = {};
		var service = {
			fetchPageData: fetchPageData,
			fetchRanks: fetchRanks,
			fetchMatchday: fetchMatchday,
			socialMediaSignin: socialMediaSignin,
			isUsernameAvailable: isUsernameAvailable,
			userSignIn: userSignIn,
			me: me
		};
		return service;

		function fetchPageData(page) {
			return submitRequest("GET", "/api/page/" + page);
		}

		function fetchRanks(weekNumber) {
			var path = "/api/ranks";
			if (weekNumber) path = path + "/" + weekNumber;
			return submitRequest("GET", path);
		}

		function fetchMatchday(weekNumber) {
			var path = "/api/matchday";
			if (weekNumber) path = path + "/" + weekNumber;
			return submitRequest("GET", path);
		}

		function generateUrl(path) {
			return API_URL + path;
		}

		function submitRequest(method, path, data) {
			var req = generateReqObj(method, path, data);
			showLoading();
			return $http(req).then(getResult).catch(getResult);
		}

		function generateReqObj(method, path, data) {
			var req = {
				method: method,
				url: generateUrl(path)
			};
			if (data) req.data = JSON.stringify(data);
			return req;
		}

		function socialMediaSignin(socialType) {
			if ('FACEBOOK' === socialType) {
				fbDoSignin();
			} else if ('GOOGLE' === socialType) {
				window.plugins.googleplus.login(
					{ 'iOSApiKey': '6535513912-uvpf249ak7avodois85tkjmh2lc2j952.apps.googleusercontent.com'},
					googleDoSignin,
					function (msg) {
						console.log("Error : ", msg);
					}
				);
			}
		}

		function googleDoSignin() {
			var userModel = {
				"firstName" : result.givenName,
				"lastName" : result.familyName,
				"type" : "GOOGLE",
				"userNetworkID" : result.userId,
				"email" : result.email,
				"imageUrl" : result.imageUrl
			};
			userData.userModel = userModel;

			isRegisteredUser(result.email, "GOOGLE")
				.then(checkRegisteredUser)
				.catch(checkRegisteredUser);			
		}

		function fbDoSignin() {
			facebookConnectPlugin.login(["public_profile", "email"], 
				fbGetProfilData,fbLoginError);
		}
		function fbGetProfilData(data) {
			userData.data1 = data;
			facebookConnectPlugin.api( "/me", [], fbGetImageData, fbLoginError);
		}
		function fbGetImageData(data) {
			userData.data2 = data;
			facebookConnectPlugin.api( "/me?fields=picture", [], 
				fbSuccessLogin, fbSuccessLogin);
		}
		function fbSuccessLogin(data) {
			userData.data3 = data;
			var userModel = {
				"firstName" : userData.data2.first_name,
				"lastName" : userData.data2.last_name,
				"type" : "FACEBOOK",
				"userNetworkID" : userData.data2.id,
				"email" : userData.data2.email,
				"imageUrl" : userData.data3.picture.data.url
			};
			userData.userModel = userModel;

			isRegisteredUser(userData.data2.email, "FACEBOOK")
				.then(checkRegisteredUser)
				.catch(checkRegisteredUser);

		}
		function fbLoginError(error) {
			$ionicPopup.alert({
				title: 'Error code : ' + error.errorCode,
				template: error.errorMessage
			});
		}

		function isRegisteredUser(email, networkType) {
			var model = {
				networkType: networkType,
				email: email
			};
			var req = generateReqObj('POST', '/api/user/isRegisteredUser', model);
			showLoading();
			return $http(req);
		}

		function isUsernameAvailable(username) {
			var model = {username: username};
			var req = generateReqObj('POST', '/api/user/isUsernameAvailable', model);
			showLoading();
			return $http(req).then(getResult).catch(getResult);
		}
	

		function checkRegisteredUser(result) {
			hideLoading();
			if (404 === result.status) {		
				var str = JSON.stringify(userData.userModel);
				var um = encodeURIComponent(str);
				$state.go('app.user.reg', {userModel: um});
			} else {
				userSignIn(userData.userModel).then(afterSignin);
			}
		}

		function afterSignin(result) {
			if (result && 200 === result.status)
				userhelper.saveUserLogged(result.data);
		}

		function userSignIn(userModel) {
			return submitRequest('POST', '/api/usernetwork/signin', userModel);
		}

		function me() {
			if (userhelper.get('session')) {
				var req = userhelper.getConf(null, "GET", generateUrl("/api/usernetwork/me"));
				return $http(req).then(getResult).catch(getResult);
			} else {
				return false;
			}
		}

		// hide and show loading
		function showLoading() {
			$ionicLoading.show({
				template: '<ion-spinner icon="android"></ion-spinner>'
			});
		}
		function hideLoading() {
			$ionicLoading.hide();
		}

		function getResult(result) {
			hideLoading();
			return result;
		}

	}

})();