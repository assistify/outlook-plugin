

(function () {
    'use strict';

    function sendMessage(config, callback) {
        // Get the room in which the mail will posted.
        getRoom(config, 'general', function (response, error) {
            if (error) {
                showError(error)
            } else {
                var discussion = {
                    parentId: response.channel._id,
                    name: 'Test',
                    members: []
                };
                //Create a new channel
                createNewDiscussion(config, discussion, function (response, error) {
                    if (error) {

                    } else {
                        console.log(response);
                        callback(response);
                    }
                });
            }
        });
    }


})();