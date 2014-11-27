'use strict';

app.factory('Task', function($resource){
  return $resource('/api/v1/tasks/:taskId',
    {taskId: '@id'}, {
      'update': {method: 'PATCH'}
    })
  }
);

app.controller('TasksCtrl', function($scope, $modal, $log, Task){
  $scope.tasks = Task.query();
  var default_task = {
    title: "",
    content: ""
  }
  $scope.task = angular.copy(default_task);

  $scope.create = function(new_task){
    Task.save({title: new_task.title, content: new_task.content}, function(task){
      $scope.tasks.push(task);
      $scope.task = angular.copy(default_task);
      $scope.createForm.$setPristine();
      $scope.submitted = false;
    });
  };

  $scope.delete = function(task) {
    Task.delete({taskId: task.id}, function(){
      var index = $scope.tasks.indexOf(task);
      $scope.tasks.splice(index, 1);
    });
  };

  $scope.edit = function(task){
    var editedTask = angular.copy(task);
    var tasks = this.tasks;
    var taskModal = $modal.open({
      templateUrl: "modal",
      size: "lg",
      controller: "taskModalCtrl",
      resolve: {
        task: function(){
          return task;
        },
        editedTask: function(){
          return editedTask;
        }
      }
    })
  }
});

app.controller("taskModalCtrl", function($scope, $modalInstance, editedTask, task){
  $scope.editedTask = editedTask;
  $scope.update = function(editedTask){
    task.$update({title: editedTask.title, content: editedTask.content}, function(){
      $modalInstance.dismiss('cancel');
    });
  }

  $scope.cancel = function(){
    $modalInstance.dismiss('cancel');
  };
})
