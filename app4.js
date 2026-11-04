
var app = angular.module("libraryApp", []);

// PARENT CONTROLLER
app.controller("ParentController", function($scope) {

    $scope.books = [
        "HTML",
        "CSS",
        "JavaScript",
        "Python",
        "Java"
    ];

    $scope.addBook = function() {
        if ($scope.newBook) {
            $scope.books.push($scope.newBook);
            $scope.newBook = "";
        }
    };

});

// CHILD CONTROLLER
app.controller("ChildController", function($scope) {

    $scope.removeBook = function(index) {
        $scope.books.splice(index, 1);
    };

});
