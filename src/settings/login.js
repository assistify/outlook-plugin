(function () {
    'use strict';
    // The initialize function must be run each time a new page is loaded.
    Office.onReady(function (reason) {

        $(document).ready(function (e) {
            var config = {};
            var rooms;
            if (window.location.search) {
                var params = JSON.parse(getParameterByName('param'));
                if (params && params.status === 'success') {
                    showSuccess();
                } else if (isValidConfig(params)) {
                    // Valid user preference exists, skip login screen
                    config = params;
                    showRooms(config);
                }
            }

            $('#server').on('keyup', function (e) {
                if (e.keyCode === 13) {
                    $('#navToLogin').click();
                }
            });
            $('#password').on('keyup', function (e) {
                if (e.keyCode === 13) {
                    $('#connect').click();
                }
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
                            // Allow user to select a room to post the email
                            showRooms(config);
                        }
                    }
                });
            });

            $('#send').on('click', function () {
                config.action = 'send';
                sendMessageToHost(JSON.stringify(config));
            });

            $('#close').on('click', function () {
                config.action = 'close';
                sendMessageToHost(JSON.stringify(config));
            });

            $('#logoff').on('click', function () {
                //Go back to URL page
                var url = '#url';
                showView(url);

                // Also logout the user session from Rocket.Chat
                if (config.authToken && config.userId) {
                    logout(config, function (response, error) {
                        if (error) {
                            // Error handling
                        } else {
                            // Clear all the user preference at this point
                            config.action = 'loggoff';
                            sendMessageToHost(JSON.stringify(config));
                        }
                    });
                }
            });

            $('#navToLogin').on('click', function () {
                // Validate existance of URL
                var login = '#login';
                showView(login);
            });

            $('#backToUrl').on('click', function () {
                var url = '#url';
                showView(url);
            });

            $('#room-picker').on('click', 'li', function () {
                $(this)
                    .addClass('ui-selected')
                    .siblings()
                    .removeClass('ui-selected');
                // Read additional info from the selected channel.
                config.channelId = $(this).attr('id');
                var selectedRoom = rooms.find(function (room) {
                    return (room._id === config.channelId);
                });
                config.channelType = selectedRoom.t;
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

            function getParameterByName(name, url) {
                if (!url) {
                    url = window.location.href;
                }
                name = name.replace(/[\[\]]/g, "\\$&");
                var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                    results = regex.exec(url);
                if (!results) return null;
                if (!results[2]) return '';
                return decodeURIComponent(results[2].replace(/\+/g, " "));
            }

            function showRooms(config) {
                // Show the user info when the login is success.
                var text = 'Eingeloggt im Team ' + config.server;
                $("#email").text(text);
                showView('#rooms');

                // Modify the DOM with the user's joined channels(both private and public).
                getJoinedChannels(config, function (response, error) {
                    if (error) {
                        showError(error);
                    } else {
                        //Assign rooms to local variable
                        rooms = response;
                        buildChannelsList($('#room-picker'), config.channelId, rooms);
                    }
                });
            }

            function showSuccess() {
                var success = '#success';
                showView(success);
            }
            function isValidConfig(config) {
                return config && config.server && config.authToken && config.userId && config.channelId;
            }
        });
    });
})();