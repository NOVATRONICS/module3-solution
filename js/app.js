(function () {
'use strict';

angular.module('NarrowItDownApp', ['Spinner'])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItemsDirective)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");

MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
  var service = this;

  service.getMatchedMenuItems = function (searchTerm) {
    return $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json"),
      params: {}
    }).then(function (result) {

      var foundItems = [];
      var menuItems = result.data.menu_items;
      var search = searchTerm.toLowerCase();

      console.log('menuItems length is', menuItems.length);

      for (var i = 0; i < menuItems.length; i++) {
        var name = menuItems[i].name;
        var description = menuItems[i].description;
        var short_name = menuItems[i].short_name;
        if (description.toLowerCase().indexOf(search) !== -1) {
          foundItems.push({short_name: short_name, name: name, description: description});
        }
      }

      console.log('foundItems length is ', foundItems.length);

      return foundItems;
    });
  };
}

NarrowItDownController.$inject = ['MenuSearchService','$rootScope'];
function NarrowItDownController(MenuSearchService, $rootScope) {
  var ctrl = this;
  ctrl.found = [];
  ctrl.searchTerm = "";

  ctrl.search = function() {
		ctrl.found = []
		ctrl.error = false;
		if (ctrl.searchTerm === "") {
			ctrl.error = true;
      $rootScope.$broadcast('searchitems:processing', {on: false});
		} else {
      $rootScope.$broadcast('searchitems:processing', {on: true});
			MenuSearchService.getMatchedMenuItems(ctrl.searchTerm).then(function(result) {
				ctrl.found = result;
        $rootScope.$broadcast('searchitems:processing', {on: false});
				if (ctrl.found.length === 0) {
					ctrl.error = true;
				};
			});
		}
	};

	ctrl.removeItem = function(itemIndex) {
		ctrl.found.splice(itemIndex, 1);
	};
}

function FoundItemsDirective(){
	var ddo = {
		templateUrl: 'founditems.template.html',
		restrict: 'E',
		scope: {
			foundItems: '<',
			onRemove: '&'
		}
	};
	return ddo;
};



})();
