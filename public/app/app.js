var app = angular.module('app', []);

app.controller('mainController', ['$scope', '$http', function($scope, $http) {
  var ll;
  var numValue = 0;
  var yelpData = [];
  $scope.matches = [];
  $scope.processing = true;

  navigator.geolocation.getCurrentPosition(function(position) {
    ll = position.coords.latitude + ',' + position.coords.longitude;
    console.log(ll);
    $http.get('https://calhacks-yum.herokuapp.com/ll/' + ll)
      .then(function(data) {
        $scope.processing = false;
        console.log(data.data);
        console.log(data.data.businesses);
        yelpData = data.data;
        $scope.picture = (yelpData.businesses[numValue].image_url).substr(0, yelpData.businesses[numValue].image_url.length - 6) + 'ls.jpg';
        $scope.name = yelpData.businesses[numValue].name;
        $scope.distance = yelpData.businesses[numValue].distance;
        destLat =  yelpData.businesses[numValue].location.coordinate.latitude;
        destLong = yelpData.businesses[numValue].location.coordinate.longitude;
        $http.get('https://calhacks-yum.herokuapp.com/uber/' + ll + ',' + yelpData.businesses[numValue].location.coordinate.latitude + ',' + yelpData.businesses[numValue].location.coordinate.longitude)
          .then(function(data) {
            console.log(data.data.prices[0].estimate);
            $scope.uberPrice = data.data.prices[0].estimate;
          });
      });
  });



  $scope.dislike = function() {
    if (numValue >= 19) {
      $scope.hideStuff = true;
      $scope.showMatches = true;
    } else {
      numValue++;
      console.log(numValue + ': ' + $scope.name);
      $scope.picture = (yelpData.businesses[numValue].image_url).substr(0, yelpData.businesses[numValue].image_url.length - 6) + 'ls.jpg';
      $scope.name = yelpData.businesses[numValue].name;
      $scope.distance = yelpData.businesses[numValue].distance;
    }
    $http.get('http://localhost:5000/uber/' + ll + ',' + yelpData.businesses[numValue].location.coordinate.latitude + ',' + yelpData.businesses[numValue].location.coordinate.longitude)
      .then(function(data) {
        console.log(data.data.prices[0].estimate);
        $scope.uberPrice = data.data.prices[0].estimate;
      });
  };

  $scope.like = function() {
    console.log(yelpData.businesses[numValue].name);
    $scope.matches.push(yelpData.businesses[numValue]);
    $scope.dislike();
  }

}]);
