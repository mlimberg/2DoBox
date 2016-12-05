const chai = require('chai');
const assert = chai.assert;
const $ = require('jquery')

describe('testing 2dobox', function() {

  it('save button should be deactivated on page load', function() {
    var saveButton = $('.save-button');
    var saveAttribute = saveButton.getAttribute('disabled')
    assert.equal(saveAttribute, true)
  })

});
