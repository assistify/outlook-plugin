(function () {
    'use strict';
    // The initialize function must be run each time a new page is loaded.
    Office.onReady(function (reason) {

        $(document).ready(function (e) {
            var config = {};
            if (window.location.search) {
                config = JSON.parse(getParameterByName('param'));
                if (config && config.server && config.authToken && config.userId && config.channel) {
                    getJoinedChannels(config, function (response, error) {
                        if (error) {
                            showError(error);
                        } else {
                            buildChannelsList($('#room-picker'), config.channel, response.channels);
                            showView('#rooms');
                        }
                    });
                }
            }


            $('#server').on('keyup', function (e) {
                if (e.keyCode === 13) {
                    $('#navToLogin').click();
                }
            });
            $('#username').on('keyup', function (e) {
                // TO-DO
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
                            getJoinedChannels(config, function (response, error) {
                                if (error) {
                                    showError(error);
                                } else {
                                    // show the user logged in.
                                    var text = 'Eingeloggt im Team '+ config.server;
                                    $("#email").text(text);
                                    buildChannelsList($('#room-picker'), config.channel, response.channels);
                                    showView('#rooms');
                                }
                            });
                        }
                    }
                });
            });

            $('#send').on('click', function () {
                config.action = 'send';
                sendMessageToHost(JSON.stringify(config));
            });

            $('#logoff').on('click', function () {
                //Logout here..
                var url = '#url';
                showView(url);
                
                if (config.authToken && config.userId) {
                    logout(config, function (response, error) {
                        if (error) {
                            // Error handling
                        } else {
                            // clears all the configuration
                            config.action = 'loggoff';
                            sendMessageToHost(JSON.stringify(config));
                        }
                    });
                }
            });

            $('#navToLogin').on('click', function () {
                // validate existance of URL
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
                // set the channel as selected.
                config.channel = $(this).text();
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





        });
    });
})();