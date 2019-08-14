(function () {
    'use strict';
    // The initialize function must be run each time a new page is loaded.
    Office.initialize = function (reason) {

    };

    $(document).ready(function (e) {
        var config = {};

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

            var server = $('#server').val();
            var user = $('#username').val();
            var password = $('#password').val();

            login({ server: server, user: user, password: password }, function (response, error) {
                if (error) {
                    showError(error);
                } else {
                    if (response.status === 'error') {
                        showError(error);
                    } else {
                        config.server = server;
                        config.userId = response.data.userId;
                        config.authToken = response.data.authToken;
                        getJoinedChannels(config, function (response, error) {
                            if (error) {
                                showError(error);
                            } else {
                                buildChannelsList($('#room-list-picker'), response.channels, onRoomSelected);
                                showView('#rooms');
                            }
                        });
                    }
                }
            });
        });

        function onRoomSelected(e) {
            config.channel = e.data.channel;
        }


        $('#save').on('click', function (e) {
            sendMessageToHost(JSON.stringify(config));
        });

        $('#cancel').on('click', function () {
            //Logout here..
            var url = '#url';
            showView(url);

            if (config.authToken && config.userId) {
                logout(config, function (response, error) {
                    if (error) {
                       // Error handling
                    } else {
                        console.log('Logout Success');
                    }
                });
            }
        });

        $('#navToLogin').on('click', function () {
            var login = '#login';
            showView(login);
        });

        $('#backToUrl').on('click', function () {
            var url = '#url';
            showView(url);
        });

        function showView(viewName) {
            $('.view').hide();
            $(viewName).show();
        }

        // Sends stringified response back to Host from the dialog window.
        function sendMessageToHost(message) {
            Office.context.ui.messageParent(message);
        }

        function showError(error) {
            // Handle unexpected error here...
        }

    });
})();
