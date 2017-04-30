var Foodapp = angular.module('FoodApp', ['ngRoute', 'ngResource', 'ngCart', 'ngDialog']);

Foodapp.config(function($routeProvider, $locationProvider){
	$routeProvider
		//the timeline display
		.when('/', {
			templateUrl: 'views/home/home.html',
			controller: 'mainController'
		})
		
    //the user profile display
    .when('/userprofile', {
      templateUrl: 'views/user/userprofile.html',
      controller: 'profileController',
      action: 'getUser'
    })
    //the user profile display
    .when('/dashboard', {
      templateUrl: 'views/admin/dashboard.html',
      controller: 'mainController',
      
    })
    //the user history display
    .when('/history', {
      templateUrl: 'views/user/userhistory.html',
      controller: 'mainController'
    })
    //the edit menu display
    .when('/editmenu', {
      templateUrl: 'views/admin/editmenu.html',
      controller: 'editmenuController'
    })
    //the edit menu display
    .when('/cart', {
      templateUrl: 'views/cart/cart.html',
      controller: 'cartController'
    })
    //the edit menu display
    .when('/checkout', {
      templateUrl: 'views/checkout.html',
      controller: 'cartController'
    })
		.otherwise({
            redirectTo: '/'
        });

        // use the HTML5 History API
        //$locationProvider.html5Mode(true);

    });

    var Foodapp = angular.module('FoodApp');


    Foodapp.controller('mainController', ['$scope', '$http', '$location', '$routeParams', 'ngCart', 'ngDialog', function($scope, $http, $location, $routeParams, ngCart, ngDialog){
        console.log('mainController loaded...');

    function init() {
            $scope.newFooditem = {};
            $scope.clickedFooditem = {};
            

            $http.get("/api/fooditem").then(function(response) {
                $scope.fooditems = response.data;
                console.log($scope.fooditems);

            });

        }

        init();


        $scope.selectFooditem = function(fooditem) {
                console.log(fooditem);
                $scope.clickedFooditem = fooditem;
            };


        var customer = {"name": "joe bloggs" , "email": "joebloggs@gmail.com", "contact": "08698765432","order": {"meal": "fish and chips", "drink": "large coke"}, "name": "sue bloggs", "email": "suebloggs@gmail.com", "contact": "08698765432", "order": {"meal": "lasnge and chips", "drink": "large coke"}};
        $scope.customer = customer;

        

        ngCart.setTaxRate(0.0);
        ngCart.setShipping(0.00);   

        //$scope.getFoodItem = function(){
            //$http.get('/fooditem').success(function(response){
              //console.log($scope.fooditem);
               // $scope.fooditems = response;
           // });
       // };

        $scope.getFoodItembyid = function(){
            var id = $routeParams.id;
            $http.get('/api/fooditem/'+id).success(function(response){
                $scope.fooditem = response;
            });
        };

        $scope.addFoodItem = function(){
            console.log($scope.fooditem);
            $http.post('/api/fooditem/', $scope.fooditem).success(function(response){
                console.log('addFoodItem');
               
            });
        };

        $scope.updateFoodItem = function(){
            var id = $routeParams.id;
            $http.put('/api/admin/fooditem/'+id, $scope.fooditem).success(function(response){
                console.log('updateFoodItem');
               
            });
        };

        $scope.removeFoodItem = function(id){
            $http.delete('/api/admin/fooditem/'+id).success(function(response){
                console.log('removeaddFoodItem');
               
            });
        };

        //$scope.getFoodItem();
    }]);

    Foodapp.controller('cartController',['ngCart', '$log', '$scope', '$http', function (ngCart,$log, $scope, $http) {

        //ngCart.setTaxRate(7.5);
        //ngCart.setShipping(2.99); 
        $scope.cartitems = ngCart.getItems();
        console.log($scope.cartitems);

        //working on this...
        $scope.addCartItems = function(){
            console.log($scope.cartitems);
            $http.post('/api/checkeditem/', $scope.cartitems).success(function(response){
                console.log(response);
               
            });
        };

            $scope.httpSettings = {
                url:'/#/checkout'
            };

            $scope.payPalSettings ={ paypal:{
                business:'medicinalrecordings@hotmail.com',
                item_name:'Order',
                item_number:'item_number',
                currency_code:'CAD'
            }};

        $scope.showCart = function(){

            $log.info ('---Total Cost:---');
            $log.info (ngCart.totalCost());
            $log.info ('---Items in Cart:---');
            $log.info (ngCart.getItems());

        }

    }])
        .directive('rainbowBlock', function () {

        return {
            restrict: 'A',
            link: function(el) {
                Rainbow.color();
            }
        };
    });

    Foodapp.controller('editmenuController', ['$scope', '$http', '$location', '$routeParams', '$httpParamSerializerJQLike', function($scope, $http, $location, $routeParams, $httpParamSerializerJQLike){
        console.log('editController loaded...');

        function init() {
            $scope.newFooditem = {};
            $scope.clickedFooditem = {};
            $scope.message = "";

        
            $http.get('/api/fooditem').success(function(response){
              //console.log($scope.fooditem);
                $scope.fooditems = response;
                console.log($scope.fooditems);
            });
        };

        init();

        $scope.saveFooditem = function() {
            console.log($scope.newFooditem);
            $http({
                url: '/api/fooditem/',
                method: 'POST',
                data: $httpParamSerializerJQLike($scope.newFooditem),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function(response) {
                console.log(response);
                init();
                $scope.message = "Food Item Added Successfully!";
            });

            $scope.newFooditem = {};
            $scope.message = "Food Item Added Successfully!";
        };

        $scope.selectFooditem = function(fooditem) {
            console.log(fooditem);
            $scope.clickedFooditem = fooditem;
        };


        $scope.updateFooditem = function() {
            $http({
                url: '/api/update/',
                method: 'POST',
                data: $httpParamSerializerJQLike($scope.clickedFooditem),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function(response) {
                console.log(response);
                init();
                $scope.message = "Food Item Updated Successfully!";
            });
        };

        $scope.deleteFooditem = function() {
            $http({
                url: '/api/delete/',
                method: 'POST',
                data: $httpParamSerializerJQLike({ '_id': $scope.clickedFooditem._id }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function(response) {
                console.log(response);
                init();
                $scope.message = "Food Item Deleted Successfully!";
            });
        };

        $scope.clearMessage = function() {
            $scope.message = "";
        };

      }]);


    Foodapp.controller('userController', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams){
        console.log('userController loaded...');


        $scope.getUser = function(){
            $http.get('/api/user').success(function(response){
              console.log($scope.users);
                $scope.users = response;
            });
        };

        $scope.getUserbyid = function(){
            var id = $routeParams.id;
            $http.get('/api/user/'+id).success(function(response){
                $scope.user = response;
            });
        };

        $scope.addUser = function(){
            console.log($scope.user);
            $http.post('/api/user/', $scope.user).success(function(response){
                console.log('addUser');
                
            });
        };

        $scope.updateUser = function(){
            var id = $routeParams.id;
            $http.put('/api/user/'+id, $scope.user).success(function(response){
                console.log('updateUser');
                
            });
        };

        $scope.removeUser = function(id){
            $http.delete('/api/user/'+id).success(function(response){
                console.log('User Deleted ');
                
            });
        };

        $scope.getUser();
    }]);

    Foodapp.controller('profileController', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams){
        console.log('profileController loaded...');


        function profileCtrl($location) {
            var vm = this;

            vm.user = {};

            $scope.getProfile()
            .success(function(data) {
              vm.user = data;
            })
            .error(function (e) {
              console.log(e);
        });
    }

}]);



