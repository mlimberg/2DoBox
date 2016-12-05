/*jshint esversion: 6 */
require('./functions')
const qualityArray = ['None', 'Low', 'Normal', 'High', 'Critical'];
let completedStatus = 'hide';

toggleCompletedButton(completedStatus);
getTasksFromStorage(qualityArray);
hideMoreThanTen();

$('#title-input').on('keyup', () => {
  verifyInputs();
});

$('#body-input').on('keyup', () => {
  let characterCount = 120 - $('#body-input').val().length;
  $('.remaining-characters').text(characterCount);
  verifyInputs(characterCount);
  changeTextRed(characterCount);
});

$('#save-button').on('click', () => {
  displayAndStoreTask();
});

$('.task-list').on('click', '.delete-task', (e) => {
  let deleteButton = e.currentTarget;
  let taskId = deleteButton.closest('article').id;
  deleteButton.closest('article').remove();
  localStorage.removeItem(taskId);
  toggleCompletedButton(completedStatus);
});

$('.task-list').on('click', '.upvote', (e) => {
  let upVote = e.currentTarget;
  let qualityStatus = $(upVote).closest('.task-box').find('.task-ranking').text();
  let taskId = upVote.closest('.task-box').id;
  let upButton = $(upVote).closest('article').find('.upvote');
  let downButton = $(upVote).closest('article').find('.downvote');
  if (qualityStatus === qualityArray[0]){
    qualityStatus = qualityArray[1];
    upButton.prop('disabled', false);
    downButton.prop('disabled', false);
  } else if (qualityStatus === qualityArray[1]){
    qualityStatus = qualityArray[2];
  } else if (qualityStatus === qualityArray[2]){
    qualityStatus = qualityArray[3];
  } else if (qualityStatus === qualityArray[3]){
    qualityStatus = qualityArray[4];
    upButton.prop('disabled', true);
  } else if (qualityStatus === qualityArray[4]){
    return qualityStatus;
  }
  storeUpdate(taskId, 'quality', qualityStatus);
  displayUpdate(upVote, 'ranking', qualityStatus);
});

$('.task-list').on('click', '.downvote', (e) => {
  let downVote = e.currentTarget;
  let qualityStatus = $(downVote).closest('.task-box').find('.task-ranking').text();
  let taskId = downVote.closest('article').id;
  let downButton = $(downVote).closest('article').find('.downvote');
  let upButton = $(downVote).closest('article').find('.upvote');
  if (qualityStatus == qualityArray[4]){
    qualityStatus = qualityArray[3];
    upButton.prop('disabled', false);
  } else if (qualityStatus === qualityArray[3]){
    qualityStatus = qualityArray[2];
  } else if (qualityStatus === qualityArray[2]){
    qualityStatus = qualityArray[1];
  } else if (qualityStatus === qualityArray[1]){
    qualityStatus = qualityArray[0];
    downButton.prop('disabled', true);
    upButton.prop('disabled', false);
  } else if (qualityStatus === qualityArray[0]){
    return qualityStatus;
  }
  storeUpdate(taskId, 'quality', qualityStatus);
  displayUpdate(downVote, 'ranking', qualityStatus);
});

$('.task-list').on('blur', '.task-title', (e) => {
  let taskTitle = e.currentTarget;
  let title = $(taskTitle).text();
  let taskId = taskTitle.closest('article').id;
  storeUpdate(taskId, 'title', title);
  displayUpdate(taskTitle, 'textUpdate', title);
});

$('.task-list').on('blur', '.task-body', (e) => {
  let taskBody = e.currentTarget;
  let body = $(taskBody).val();
  let taskId = taskBody.closest('article').id;
  storeUpdate(taskId, 'body', body);
  displayUpdate(taskBody, 'textUpdate', body);
});

$('.task-list').on('keypress', '.task-title', function(e){
  let taskTitle = e.currentTarget;
  let title = $(taskTitle).text();
  let taskId = taskTitle.closest('article').id;
  if(e.which === 13) {
    storeUpdate(taskId, 'title', title);
    displayUpdate(taskTitle, 'textUpdate', title);
    taskTitle.blur();
    e.preventDefault();
  }
});

$('.task-list').on('keypress', '.task-body', function(e){
  let taskBody = e.currentTarget;
  let body = $(taskBody).val();
  let taskId = taskBody.closest('article').id;
  if(e.which === 13) {
    storeUpdate(taskId, 'body', body);
    displayUpdate(taskBody, 'textUpdate', body);
  }
});

$('#title-input, #body-input').keypress((e) => {
  let taskFields = $('#title-input, #body-input');
  let titleField = $('#title-input');
  let bodyField = $('#body-input');
  if(e.which === 13) {
    e.preventDefault();
}
  if (e.which === 13 && taskFields.val()) {
    displayAndStoreTask();
  }
});

$('.task-list').on('click', '.completed-task', (e) => {
  let complete = e.currentTarget;
  let title = $(complete).closest('article').find('h2');
  let body = $(complete).closest('article').find('textarea');
  let taskId = complete.closest('article').id;
  let upvote = $(complete).closest('article').find('.upvote');
  let downvote = $(complete).closest('article').find('.downvote');
  let quality = $(complete).closest('article').find('.task-ranking').text();
  title.toggleClass('strike-thru');
  body.toggleClass('strike-thru');
  if(title.hasClass('strike-thru')) {
    upvote.prop('disabled', true);
    downvote.prop('disabled', true);
    storeUpdate(taskId, 'completed', true);
  } else {
    if(quality === qualityArray[0]) {
      upvote.prop('disabled', false);
      downvote.prop('disabled', true);
    } else if (quality === qualityArray[4]) {
      upvote.prop('disabled', true);
      downvote.prop('disabled', false);
    } else {
      upvote.prop('disabled', false);
      downvote.prop('disabled', false);
    }
    storeUpdate(taskId, 'completed', false);
  }
});

$('#show-completed').on('click', (e) => {
  let button = e.currentTarget;
  for (let i = 0; i < localStorage.length; i++) {
    let task = JSON.parse(localStorage.getItem(localStorage.key(i)));
    if(task.completed && completedStatus === 'hide') {
      displayOnPage(task, qualityArray);
    }
  }
  completedStatus = 'show';
  disableShowCompletedButton();
});

$('.quality-btns').on('click', (e) => {
  $('.task-box').remove();
  let quality = $(e.currentTarget).text();
  let tasksArray = [];
  for (let i = 0; i < localStorage.length; i++) {
    let task = JSON.parse(localStorage.getItem(localStorage.key(i)));
    if(quality === 'All' && !task.completed) {
      tasksArray.push(task);
    } else if(!task.completed && task.quality === quality) {
      tasksArray.push(task);
    }
  }
  tasksArray.forEach(function(task, index, tasksArray) {
    displayOnPage(task, qualityArray);
    hideMoreThanTen();
  });
  if(tasksArray.length > 10) {
    enableShowMoreButton();
  } else {
    disableShowMoreButton();
  }
});

$('#show-more').on('click', () => {
  showMoreTasks();
  disableShowMoreButton();
});
