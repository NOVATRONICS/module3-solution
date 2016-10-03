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
      console.log('getMatchedMenuItems length is ', foundItems.length);
      return foundItems;
    });
  };
}

NarrowItDownController.$inject = ['MenuSearchService','$rootScope'];
function NarrowItDownController(MenuSearchService, $rootScope) {
  var ctrl = this;

  ctrl.found = [];
  ctrl.search_term = "";
  ctrl.show_message = false;

  ctrl.removeItem = function (itemIndex) {
    console.log('removeItem', itemIndex);
    ctrl.found.splice(itemIndex, 1);
  }

  ctrl.narrowItems = function () {
    var searchTerm = ctrl.search_term;
    if(searchTerm !== "") {
        $rootScope.$broadcast('searchitems:processing', {on: true});
        MenuSearchService.getMatchedMenuItems(searchTerm).then(function (result) {
          ctrl.found = result;
          if(ctrl.found.length) {
              ctrl.show_message = false;
          } else {
            ctrl.show_message = true;
          }
          $rootScope.$broadcast('searchitems:processing', {on: false});
        });
    }
    else {
        $rootScope.$broadcast('searchitems:processing', {on: false});
        ctrl.found = [];
        ctrl.show_message = true;
    }
  }

}

function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'founditems.template.html',
    scope: {
      items: '<',
      myTitle: '@title',
      badRemove: '=',
      onRemove: '&'
    },
    controller: FoundItemsDirectiveController,
    controllerAs: 'list',
    bindToController: true
  };

  return ddo;
}


function FoundItemsDirectiveController() {
  var list = this;

}



})();
