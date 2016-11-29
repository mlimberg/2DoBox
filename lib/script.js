var taskList = $('.task-list');
var taskTitle = $('.task-title');
var taskBody = $('.task-body');
var saveButton = $('#save-button');
var titleField = $('#title-input');
var bodyField = $('#body-input');
var taskFields = $('#title-input, #body-input');
var taskBox = $('.task-box');
var currentTask;

getAndDisplayTasks();

function getAndDisplayTasks() {
  for (var i = 0; i < localStorage.length; i++) {
    var task = JSON.parse(localStorage.getItem(localStorage.key(i)));
    prependTasks(task);
  }
}

saveButton.on('click', function() {
  addNewTaskBox();
  clearInputFields();
  disableSaveButton();
  storeNewObject();
  getAndClearAndDisplayTasks();
});

function NewTaskConstructor(titleText, bodyText, quality, uniqueid){
  this.titleText = titleText;
  this.bodyText = bodyText;
  this.quality =  quality || "swill";
  this.uniqueid = uniqueid || Date.now();
}

function addNewTaskBox(titleText, bodyText) {
  currentTask = new NewTaskConstructor(titleField.val(), bodyField.val());
  prependTasks(currentTask);
}

function prependTasks(currentTask) {
  taskList.prepend(
    `<article id=${currentTask.uniqueid} class="task-box">
      <div class="search-field">
        <div class="task-box-header">
          <h2 class="task-title" contentEditable="true">${currentTask.titleText}</h2>
          <p class="delete-task"></p>
        </div>
        <textarea class="task-body" contentEditable="true" maxlength="125">${currentTask.bodyText}</textarea>
      </div>
      <div class="task-box-footer">
        <p class="upvote"></p>
        <p class="downvote"></p>
        <div class="task-ranking-quality">quality:</div>
        <div class="task-ranking">${currentTask.quality}</div>
        <button id="completed-task">Completed Task</button>
      </div>
    </article>`);
}

clearInputFields = () => {
  return titleField.val("") && bodyField.val("") && $('#search-input').val("");

}

function disableSaveButton() {
  saveButton.prop('disabled', true);
}

function storeNewObject(){
  localStorage.setItem(currentTask.uniqueid, JSON.stringify(currentTask));
}

$('.task-list').on('click', '.delete-task', function(){
  var taskId = this.closest('article').id;
  $(this).closest('article').remove();
  localStorage.removeItem(taskId);
});

$('.task-list').on('click', '.upvote', function(){
  var qualityStatus = $(this).closest('.task-box').find('.task-ranking');
  var quality;
  var taskId = this.closest('article').id;
  if (qualityStatus.text() == 'swill'){
    quality = 'plausible';
  } else if (qualityStatus.text() === 'plausible'){
    quality = 'genius';
  }else if (qualityStatus.text() === 'genius'){
    return false;
  }
  storeUpdate(taskId, 'quality', quality);
  getAndClearAndDisplayTasks();
});

$('.task-list').on('click', '.downvote', function(event){
  var qualityStatus = $(this).closest('.task-box').find('.task-ranking');
  var quality;
  var taskId = this.closest('article').id;
  if (qualityStatus.text() == 'genius'){
    quality = 'plausible';
  } else if (qualityStatus.text() === 'plausible'){
    quality = 'swill';
  } else if (qualityStatus.text() === 'swill'){
    return false;
  }
  storeUpdate(taskId, 'quality', quality);
  getAndClearAndDisplayTasks();
});

$('.task-list').on('blur', '.task-title', function(){
  var title = $(this).text();
  var taskId = this.closest('article').id;
  storeUpdate(taskId, 'title', title);
  getAndClearAndDisplayTasks();
});

$('.task-list').on('blur', '.task-body', function(){
  var body = $(this).text();
  var taskId = this.closest('article').id;
  storeUpdate(taskId, 'body', body);
  getAndClearAndDisplayTasks();
});

$('.task-list').on('keypress', '.task-title', function(e){
  var title = $(this).text();
  var taskId = this.closest('article').id;
  if(e.which === 13) {
    storeUpdate(taskId, 'title', title);
    getAndClearAndDisplayTasks();
}
});

$('.task-list').on('keypress', '.task-body', function(e){
  var body = $(this).text();
  var taskId = this.closest('article').id;
  if(e.which === 13) {
    storeUpdate(taskId, 'body', body);
    getAndClearAndDisplayTasks();
}
});

function storeUpdate(id, attribute, newValue) {
  for (var i = 0; i < localStorage.length; i++) {
    var task = JSON.parse(localStorage.getItem(localStorage.key(i)));
    if (id == task.uniqueid) {
      if (attribute === 'quality') {
        task.quality = newValue;
      } else if (attribute === 'title') {
        task.titleText = newValue;
      } else if (attribute === 'body') {
        task.bodyText = newValue;
      }
      localStorage.setItem(parseInt(id), JSON.stringify(task));
    }
  }
}

function getAndClearAndDisplayTasks() {
  $('.task-box').remove();
  for (var i = 0; i < localStorage.length; i++) {
    var task = JSON.parse(localStorage.getItem(localStorage.key(i)));
    prependTasks(task);
}
}

$(taskFields).on('input', function(){
  if($('#title-input').val() && $('#body-input').val()){
    $('#save-button').prop('disabled', false);
  } else {
    $('#save-button').prop('disabled', true);
  }
});

taskFields.keypress(function(event) {
  if(event.which === 13) {
    event.preventDefault();
  }
   if (event.which === 13 && titleField.val() && bodyField.val()) {
     addNewTaskBox();
     clearInputFields();
     disableSaveButton();
     storeNewObject();
   }
 });

 $("#search-input").keyup(function(){
   var filter = $(this).val();
   $(".search-field").each(function() {
     if ($(this).text().search(new RegExp(filter, "i")) < 0) {
       $(this).parent().addClass('hidden');
     } else {
       $(this).parent().removeClass('hidden');
     }
   });
 });

 $('.task-list').on('click', '#completed-task', function() {
   let thing = $(this).closest('article').find('h2');
   let thing2 = $(this).closest('article').find('textarea');
   $(thing).css('text-decoration', 'line-through');
   $(thing2).css('text-decoration', 'line-through');
 });
