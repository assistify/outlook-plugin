(function () {
    'use strict';

    // The initialize function must be run each time a new page is loaded.
    Office.initialize = function (reason) {
        $('#server').on('change', function () {
            // TO-DO
        });
        $('#username').on('change', function () {
            // TO-DO
        });
        $('#password').on('change', function () {
            // TO-DO
        });

        // Handle the connect action on the dialog window.
        $('#connect').on('click', function () {
            var server = $('#server').val() || 'https://ee144085.ngrok.io';
            var user = $('#username').val() || 'admin';
            var password = $('#password').val() || '1234';

            login({ server: server, user: user, password: password }, function (response, error) {
                if (error) {
                    showError(error);
                } else {
                    if (response.status === 'error') {
                        showError(response);
                    } else {
                        console.log(response);
                        sendMessageToHost(JSON.stringify({ server: server, userId: response.data.userId, authToken: response.data.authToken }));
                    }
                }
            });
        })


        // Sends stringified response back to Host from the dialog window.
        function sendMessageToHost(message) {
            Office.context.ui.messageParent(message);
        }

        function showError(error) {
            // Handle unexpected error here...
        }

    };

})();
