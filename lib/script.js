/*jshint esversion: 6 */
const qualityArray = ['None', 'Low', 'Normal', 'High', 'Critical'];

getAndClearAndDisplayTasks = () => {
  let taskFields = $('#title-input, #body-input');
  $('.task-box').remove();
  for (var i = 0; i < localStorage.length; i++) {
    var task = JSON.parse(localStorage.getItem(localStorage.key(i)));
    prependTasks(task);
  }
};

prependTasks = currentTask => {
  $('.task-list').prepend(
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
  };

getAndDisplayTasks = () => {
  for (i = 0; i < localStorage.length; i++) {
    let task = JSON.parse(localStorage.getItem(localStorage.key(i)));
    prependTasks(task);
  }
};

  getAndDisplayTasks();

  $('#save-button').on('click', () => {
    addNewTaskBox();
    clearInputFields();
    disableSaveButton();
    getAndClearAndDisplayTasks();
  });

  class NewTaskConstructor {
    constructor(titleText, bodyText, quality, uniqueid) {
      this.titleText = titleText;
      this.bodyText = bodyText;
      this.quality =  quality || 'Normal';
      this.uniqueid = uniqueid || Date.now();
    }
  }

  addNewTaskBox = () => {
    let titleField = $('#title-input');
    let bodyField = $('#body-input');
    let currentTask = new NewTaskConstructor(titleField.val(), bodyField.val());
    prependTasks(currentTask);
    storeNewObject(currentTask);
  };


  clearInputFields = () => {
    let titleField = $('#title-input');
    let bodyField = $('#body-input');
    return titleField.val("") && bodyField.val("") && $('#search-input').val("");
  };

  disableSaveButton = () => {
    $('#save-button').prop('disabled', true);
  };


  $('.task-list').on('click', '.delete-task', (e) => {
    let deleteButton = e.currentTarget;
    let taskId = deleteButton.closest('article').id;
    deleteButton.closest('article').remove();
    localStorage.removeItem(taskId);
  });

  $('.task-list').on('click', '.upvote', (e) => {
    let qualityStatus = $(e.currentTarget).closest('.task-box').find('.task-ranking').text();
    let taskId = e.currentTarget.closest('.task-box').id;
    if (qualityStatus === qualityArray[0]){
      qualityStatus = qualityArray[1];
    } else if (qualityStatus === qualityArray[1]){
      qualityStatus = qualityArray[2];
    } else if (qualityStatus === qualityArray[2]){
      qualityStatus = qualityArray[3];
    } else if (qualityStatus === qualityArray[3]){
      qualityStatus = qualityArray[4];
    } else if (qualityStatus === qualityArray[4]){
      return qualityStatus;
    }
    storeUpdate(taskId, 'quality', qualityStatus);
    getAndClearAndDisplayTasks();
  });

  $('.task-list').on('click', '.downvote', (e) => {
    let qualityStatus = $(e.currentTarget).closest('.task-box').find('.task-ranking').text();
    let taskId = e.currentTarget.closest('article').id;
    if (qualityStatus == qualityArray[4]){
      qualityStatus = qualityArray[3];
    } else if (qualityStatus === qualityArray[3]){
      qualityStatus = qualityArray[2];
    } else if (qualityStatus === qualityArray[2]){
      qualityStatus = qualityArray[1];
    } else if (qualityStatus === qualityArray[1]){
      qualityStatus = qualityArray[0];
    } else if (qualityStatus === qualityArray[0]){
      return qualityStatus;
    }
    storeUpdate(taskId, 'quality', qualityStatus);
    getAndClearAndDisplayTasks();
  });

  $('.task-list').on('blur', '.task-title', (event) => {
    let title = event.currentTarget.text();
    let taskId = event.currentTarget.closest('article').id;
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


  $('#title-input, #body-input').on('input', function(){
    if($('#title-input').val() && $('#body-input').val()){
      $('#save-button').prop('disabled', false);
    } else {
      $('#save-button').prop('disabled', true);
    }
  });

  $('#title-input, #body-input').keypress(function(event) {
    let taskFields = $('#title-input, #body-input');
    let titleField = $('#title-input');
    let bodyField = $('#body-input');
    if(event.which === 13) {
      event.preventDefault();
    }
    if (event.which === 13 && taskFields.val()) {
      addNewTaskBox();
      clearInputFields();
      disableSaveButton();
      getAndClearAndDisplayTasks();
    }
  });


  $('.task-list').on('click', '#completed-task', function() {
    let thing = $(this).closest('article').find('h2');
    let thing2 = $(this).closest('article').find('textarea');
    $(thing).toggleClass('strike-thru');
    $(thing2).toggleClass('strike-thru');
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

  storeNewObject = currentTask => {
    localStorage.setItem(currentTask.uniqueid, JSON.stringify(currentTask));
  };
