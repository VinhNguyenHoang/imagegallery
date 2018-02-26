var app = angular.module("imageGalleryApp", [])

.constant('API_CONFIG', {
	'URL': 'https://www.googleapis.com/customsearch/v1',
	'KEY': 'AIzaSyBxqjnu-hrNMAPWH3qLoIVaoeiSYuPP6w0',
	'CX': '001339494331939936132:pmyt7azhrdg',
	'NUM_RESULTS': 10,
	'START': 1,
	'SEARCH_TYPE': 'image',
	'IMAGE_SIZE': 'medium'
})

.factory('apiService', function($http, API_CONFIG) {
	function searchByQuery(query, offset) {
		return $http({
			method: 'GET',
			url: API_CONFIG.URL 
			+ '?q=' + query 
			+ '&num=' + API_CONFIG.NUM_RESULTS
			+ '&start=' + offset
			+ '&imgSize=' + API_CONFIG.IMAGE_SIZE
			+ '&searchType=' + API_CONFIG.SEARCH_TYPE
			+ '&key=' + API_CONFIG.KEY
			+ '&cx=' + API_CONFIG.CX
		})
		.then(function successCallback(res) {
			return res.data.items;
		})
		.then(function errorCallback(res){
			return res;
		})
	}

	return {
		searchByQuery: searchByQuery
	}
})

.controller('indexController', ['$window', 'apiService', 'API_CONFIG', function($window, apiService, API_CONFIG) {
	var ctrl = this;
	ctrl.appName = 'Image Gallery Web Application';
	ctrl.searchQuery = '';
	ctrl.listResult = Array();
	ctrl.getSearchResult = function(){
		if (ctrl.searchQuery == '')
			return;
		ctrl.listResult = [];
		ctrl.offsetCount = API_CONFIG.START;
		apiService.searchByQuery(this.searchQuery, ctrl.offsetCount).then(data => {
			data.forEach(d => {
				ctrl.listResult.push(d);
			})
		});
	};
	ctrl.loadMore = function() {
		if (ctrl.searchQuery == '')
			return;
		ctrl.offsetCount += API_CONFIG.NUM_RESULTS;
		apiService.searchByQuery(this.searchQuery, ctrl.offsetCount).then(data => {
			data.forEach(d => {
				ctrl.listResult.push(d);
			})
		});
	};
	angular.element($window).bind('scroll', function() {
		var windowHeight = 'innerHeight' in window ? window.innerHeight: document.documentElement.offsetHeight;
		var body = document.body, html = document.documentElement;
		var docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
		windowBottom = windowHeight + window.pageYOffset;
		if (windowBottom >= docHeight) {
			ctrl.loadMore();
		}
	});
}])