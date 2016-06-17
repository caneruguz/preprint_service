import Ember from 'ember';
import $ from 'jquery';

export default Ember.Controller.extend({
    queryParams: ['subject'],
    subject: null,

    filteredPreprints: Ember.computed('subject', 'model', function() {
        var subject = this.get('subject');
        var preprints = this.get('model').preprints;

        var result = preprints;
        if (subject) {
            result = preprints.filterBy('subject', subject);
        }
        if (result.get('length') > 0) {
            $('#noResultsFound').css('display', 'none');
        } else {
            $('#noResultsFound').css('display', 'block');
        }

        return result;
    })
});
