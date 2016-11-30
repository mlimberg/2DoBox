
  $('#search-input').on('keyup', function() {
    var searchValue = $(this).val().toLowerCase();
    $('.search-field').each(function() {
      var titleText = $(this).find('.task-title').text().toLowerCase();
      var bodyText = $(this).find('.task-body').text().toLowerCase();
      titleText.indexOf(searchValue) !== -1 || bodyText.indexOf(searchValue) !== -1 ? $(this).closest('article').show() : $(this).closest('article').hide();
    });
  });
