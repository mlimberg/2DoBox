var ideaList = $('.idea-list');
var ideaTitle = $('.idea-title');
var ideaBody = $('.idea-body');
var saveButton = $('#save-button');
var titleField = $('#title-input');
var bodyField = $('#body-input');
var ideaFields = $('#title-input, #body-input');
var count = 0;
var storageArray = [];

saveButton.on('click', function() {
  count++;
  addNewIdeaBox();
  clearInputFields();
  disableSaveButton();
  createArray();
  stringifyArray();
});


$(ideaFields).on('input', function(){
  if($('#title-input').val() && $('#body-input').val()){
    $('#save-button').prop('disabled', false);
  } else {
    $('#save-button').prop('disabled', true);
  }
});

// $('#body-input').on('input', function(){
//   if($('#title-input').val() && $('#body-input').val()){
//     $('#save-button').prop('disabled', false);
//   }
// });

ideaFields.keypress(function(event){
  if (event.which == 13) {
    $('#save-button').click();
  }
});

function NewIdeaConstructor(titleText, bodyText) {
  this.titleText = titleField.val();
  this.bodyText = bodyField.val();
  this.quality = "swill";
  this.idcount = count;
}

function clearInputFields() {
  return titleField.val("") && bodyField.val("");
}

function disableSaveButton() {
  saveButton.prop('disabled', true);
}
var currentIdea;

function addNewIdeaBox(titleText, bodyText) {
  currentIdea = new NewIdeaConstructor();
  var title = currentIdea.titleText;
  var body = currentIdea.bodyText;
  ideaList.prepend(
    `<article class="idea-box">
      <div class="idea-box-header">
        <h2 class="idea-title" contentEditable="true">${title}</h2>
        <p class="delete-idea"></p>
      </div>
      <p class="idea-body" contentEditable="true">${body}</p>
      <div class="idea-box-footer">
        <p class="upvote-img"></p>
        <p class="downvote-img"></p>
        <div class="idea-ranking-quality">quality:</div>
        <div class="idea-ranking">Swill</div>
      </div>
    </article>`);

    // $('.delete-idea').on('click', function(){
    //   $(this).parent().parent().remove();
    // });

    // $('upvote-img').on('click', function(){
    //   $(this).parent().parent().
    // })
    //
    // $('downvote-img').on('click', function(){
    //   $(this).parent().parent().
    // })
}

function createArray(){
  storageArray.push(currentIdea);
  // console.log(storageArray);
}

function stringifyArray(){
  localStorage.setItem("storageArray", JSON.stringify(storageArray));
}

$('.idea-list').on('click', '.delete-idea', function(){
  $(this).parent().parent().remove();
});
