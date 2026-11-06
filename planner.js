var app = angular.module('taskApp', []);

app.controller('TaskController', function($scope, $interval) {

    // Load saved tasks or initialize realistic multi-category default items
    var savedTasks = localStorage.getItem('bloom_life_planner_tasks');
    $scope.tasks = savedTasks ? JSON.parse(savedTasks) : [
        { id: 1, title: 'Buy groceries & weekend essentials', priority: 'High', category: 'Shopping', completed: false, dueDate: '' },
        { id: 2, title: 'Submit weekly team status report', priority: 'High', category: 'Work', completed: false, dueDate: '' },
        { id: 3, title: 'Complete 30-minute cardio workout', priority: 'Medium', category: 'Fitness', completed: true, dueDate: '' },
        { id: 4, title: 'Review AngularJS module directives', priority: 'Medium', category: 'Academics', completed: false, dueDate: '' },
        { id: 5, title: 'Organize workspace & clean desk', priority: 'Low', category: 'Personal', completed: true, dueDate: '' }
    ];

    // Category Filter State
    $scope.selectedCategory = 'All';
    $scope.searchQuery = '';

    $scope.setCategory = function(cat) {
        $scope.selectedCategory = cat;
    };

    $scope.categoryFilter = function(task) {
        if ($scope.selectedCategory === 'All') return true;
        return task.category === $scope.selectedCategory;
    };

    // Load saved habits
    var savedHabits = localStorage.getItem('bloom_life_habits');
    $scope.habits = savedHabits ? JSON.parse(savedHabits) : [
        { id: 1, name: 'Drink 2L water daily' },
        { id: 2, name: 'Read 15 pages of a book' },
        { id: 3, name: '30 mins focus work/study' }
    ];

    // Quick notes
    $scope.quickNotes = localStorage.getItem('bloom_life_notes') || 'Remember to review pending tasks every evening!';

    // Smart Suggestion Text
    $scope.smartSuggestion = "Prioritize high-impact tasks early in the morning for maximum productivity!";

    // Form inputs
    $scope.newTaskTitle = '';
    $scope.newTaskPriority = 'Medium';
    $scope.newTaskCategory = 'Personal';
    $scope.newTaskDueDate = null;
    $scope.newHabitName = '';

    // Task Handlers
    $scope.addTask = function() {
        if (!$scope.newTaskTitle || $scope.newTaskTitle.trim() === '') return;

        $scope.tasks.push({
            id: Date.now(),
            title: $scope.newTaskTitle.trim(),
            priority: $scope.newTaskPriority,
            category: $scope.newTaskCategory,
            completed: false,
            dueDate: $scope.newTaskDueDate ? $scope.newTaskDueDate : ''
        });

        $scope.newTaskTitle = '';
        $scope.saveTasks();
    };

    $scope.deleteTask = function(id) {
        $scope.tasks = $scope.tasks.filter(function(t) { return t.id !== id; });
        $scope.saveTasks();
    };

    $scope.markAllDone = function() {
        angular.forEach($scope.tasks, function(task) { task.completed = true; });
        $scope.saveTasks();
    };

    $scope.clearCompleted = function() {
        $scope.tasks = $scope.tasks.filter(function(t) { return !t.completed; });
        $scope.saveTasks();
    };

    // Notification helper for pending tasks count
    $scope.getPendingCount = function() {
        return $scope.tasks.filter(function(t) { return !t.completed; }).length;
    };

    // Habit Handlers
    $scope.addHabit = function() {
        if (!$scope.newHabitName) return;
        $scope.habits.push({ id: Date.now(), name: $scope.newHabitName });
        $scope.newHabitName = '';
        $scope.saveTasks();
    };

    $scope.deleteHabit = function(id) {
        $scope.habits = $scope.habits.filter(function(h) { return h.id !== id; });
        $scope.saveTasks();
    };

    // Focus Timer Logic (25-minute default)
    $scope.timerSeconds = 25 * 60;
    $scope.timerRunning = false;
    var timerPromise = null;

    $scope.formatTime = function(sec) {
        var m = Math.floor(sec / 60);
        var s = sec % 60;
        return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    };

    $scope.startTimer = function() {
        if (!$scope.timerRunning) {
            $scope.timerRunning = true;
            timerPromise = $interval(function() {
                if ($scope.timerSeconds > 0) {
                    $scope.timerSeconds--;
                } else {
                    $scope.pauseTimer();
                    alert('Focus session finished! Time for your Active Recall test 🎉');
                    $scope.openRecallQuiz();
                }
            }, 1000);
        }
    };

    $scope.pauseTimer = function() {
        $scope.timerRunning = false;
        if (timerPromise) $interval.cancel(timerPromise);
    };

    $scope.resetTimer = function() {
        $scope.pauseTimer();
        $scope.timerSeconds = 25 * 60;
    };

    // Active Recall Quiz Modal Logic
    $scope.isQuizOpen = false;
    $scope.quizQuestions = [
        { question: "What directive is used in AngularJS for two-way data binding?", options: ["ng-bind", "ng-model", "ng-repeat", "ng-controller"], correct: 1 },
        { question: "Which scope object property manages the execution context?", options: ["$rootScope", "$scope", "$watch", "$digest"], correct: 1 },
        { question: "What is the primary benefit of active recall over passive reading?", options: ["Takes less time", "Strengthens neural pathways through testing", "Requires no focus", "None of these"], correct: 1 }
    ];
    $scope.currentQuiz = {};

    $scope.openRecallQuiz = function() {
        var randomIndex = Math.floor(Math.random() * $scope.quizQuestions.length);
        $scope.currentQuiz = $scope.quizQuestions[randomIndex];
        $scope.isQuizOpen = true;
    };

    $scope.closeRecallQuiz = function() {
        $scope.isQuizOpen = false;
    };

    $scope.answerQuiz = function(index) {
        if (index === $scope.currentQuiz.correct) {
            alert('Correct! Excellent active recall retention 🎉');
        } else {
            alert('Incorrect. Review your notes and try again!');
        }
        $scope.isQuizOpen = false;
    };

    // Metric Calculations
    $scope.getCompletedCount = function() {
        return $scope.tasks.filter(function(t) { return t.completed; }).length;
    };

    $scope.getProgressPercent = function() {
        if ($scope.tasks.length === 0) return 0;
        return Math.round(($scope.getCompletedCount() / $scope.tasks.length) * 100);
    };

    // Save to LocalStorage
    $scope.saveTasks = function() {
        localStorage.setItem('bloom_life_planner_tasks', JSON.stringify($scope.tasks));
        localStorage.setItem('bloom_life_habits', JSON.stringify($scope.habits));
        localStorage.setItem('bloom_life_notes', $scope.quickNotes);
    };
});