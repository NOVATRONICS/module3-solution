(function () {
'use strict';

angular.module('Spinner')
.component('itemsLoaderIndicator', {
  templateUrl: 'loader/loader.template.html',
  controller: SpinnerController
});


SpinnerController.$inject = ['$rootScope']
function SpinnerController($rootScope) {
  var $ctrl = this;

  var cancelListener = $rootScope.$on('searchitems:processing', function (event, data) {
    //console.log("Event: ", event);
    //console.log("Data: ", data);
    if (data.on) {
      $ctrl.showSpinner = true;
    }
    else {
      $ctrl.showSpinner = false;
    }
  });
  $ctrl.$onDestroy = function () {
    cancelListener();
  };

};

})();
