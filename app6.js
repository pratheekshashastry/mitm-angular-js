
/*
Name: Your Full Name
Department: Your Department
*/

// Create AngularJS module
var app = angular.module("studentApp", []);

// Parent Controller
app.controller("CollegeController", function($scope) {

    $scope.collegeName = "ABC College of Engineering";

});

// Child Controller
app.controller("StudentController", function($scope) {

    // Array containing sample student names
    $scope.students = [
        "Rahul",
        "Priya",
        "Amit"
    ];

    // Initially hide student details
    $scope.showDetails = false;

    // Function to add a student
    $scope.addStudent = function() {

        if ($scope.studentName &&
            $scope.studentName.trim() !== "") {

            $scope.students.push($scope.studentName.trim());

            // Clear name input
            $scope.studentName = "";
        }

    };

});
