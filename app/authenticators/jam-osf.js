import Ember from 'ember';
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';
import OsfToken from 'ember-osf/authenticators/osf-token';

import config from 'ember-get-config';

export default OsfToken.extend({
    jamUrl: `${config.JamDB.url}/v1/auth`,

    _post: function(accessToken) {
        return Ember.$.ajax({
            method: 'POST',
            url: this.jamUrl,
            dataType: 'json',
            contentType: 'application/json',
            xhrFields: {withCredentials: true},
            data: JSON.stringify({data: {
                type: 'users',
                attributes: {
                    provider: 'osf',
                    access_token: accessToken
                }
            }})
        });
    },

    restore(data) {
        let accessToken = data.attributes.accessToken;
        return this._test(accessToken).fail(this.invalidate).then(() =>
            this._post(accessToken)
        ).then(function(res) {
            res.data.attributes.accessToken = accessToken;
            return res.data.attributes;
        }).fail(this.invalidate););
    },

    authenticate(accessToken) {
        // Adds the entire API user endpoint record to the session store as given
        return this._test(accessToken).then(() =>
            this._post(accessToken)
        ).then((res) => {
            res.data.attributes.accessToken = accessToken;
            return res.data.attributes;
        });
    }

//    restore(data) {
//        let accessToken = data.accessToken;
//        return this._post(accessToken).then(function(res) {
//            res.data.attributes.accessToken = accessToken;
//            return res.data.attributes;
//        }).fail(this.invalidate);
//    },
//    authenticate(accessToken /*, expires */) {
//        return this._post(accessToken).then(function(res) {
//            res.data.attributes.accessToken = accessToken;
//            return res.data.attributes;
//        });
//    }
});
