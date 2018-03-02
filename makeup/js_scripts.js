var app = angular.module("imageGalleryApp", [])

.constant('API_CONFIG', {
	'URL': 'https://www.googleapis.com/customsearch/v1',
	'KEY': ' AIzaSyCmSp7fO3vYEupmPANvmrCisVk0ml3ArUQ',
	'CX': '001339494331939936132:pmyt7azhrdg',
	'NUM_RESULTS': 10,
	'START': 1,
	'SEARCH_TYPE': 'image',
	'IMAGE_SIZE': 'medium'
})

.factory('ImgItem', function(){
	function ImgItem(width, height, imgSrc, ctxLink){
		this.width = width;
		this.height = height;
		this.imgSrc = imgSrc;
		this.ctxLink = ctxLink;
	}

	return ImgItem;
})

.factory('apiService', function($http, API_CONFIG, ImgItem) {
	function searchByQuery(query, offset) {
		var items = Array();
		console.log(API_CONFIG.URL 
			+ '?q=' + query 
			+ '&num=' + API_CONFIG.NUM_RESULTS
			+ '&start=' + offset
			+ '&imgSize=' + API_CONFIG.IMAGE_SIZE
			+ '&searchType=' + API_CONFIG.SEARCH_TYPE
			+ '&key=' + API_CONFIG.KEY
			+ '&cx=' + API_CONFIG.CX);
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
			res.data.items.forEach(item => {
				var imgItem = new ImgItem(item.image.width, item.image.height, item.link, item.image.contextLink);
				items.push(imgItem);
			});

			return items;
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
	ctrl.showLoadMore = false;
	ctrl.listResult = Array();
	ctrl.getSearchResult = function(){
		if (ctrl.searchQuery == '')
			return;
		ctrl.listResult = [];
		ctrl.showLoadMore = false;
		ctrl.offsetCount = API_CONFIG.START;
		apiService.searchByQuery(this.searchQuery, ctrl.offsetCount).then(data => {
			data.forEach(d => {
				ctrl.listResult.push(d);
			});
			ctrl.showLoadMore = true;
		});
	};
	ctrl.loadMore = function() {
		if (ctrl.searchQuery == '')
			return;
		ctrl.offsetCount += API_CONFIG.NUM_RESULTS;
		apiService.searchByQuery(this.searchQuery, ctrl.offsetCount).then(data => {
			data.forEach(d => {
				ctrl.listResult.push(d);
			});
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