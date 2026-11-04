var app = angular.module('myApp', []);

//parent controller

app.controller('CollegeController', function($scope) {
    $scope.collegeName = "MIT college";
});

//child controller

app.controller(
    "StudentController", function($scope) {
        $scope.name = "Darshan S";
        $scope.department = "Electorics Science";
        $scope.semester = 3;

        //aray
        $scope.students =[
            "MANVITHA",
        ];
    }
);