(function () {
    'use strict';
    var config;
    // The initialize function must be run each time a new page is loaded.
    Office.onReady(function (reason) {

        $(document).ready(function (e) {
            if (window.location.search) {
                config = JSON.parse(getParameterByName('param'));
                if (config && config.server && config.authToken && config.userId && config.channel) {
                    getJoinedChannels(config, function (response, error) {
                        if (error) {
                            showError(error);
                        } else {
                            buildChannelsList($('#room-picker'), config.channel, response.channels, onRoomSelected);
                            showView('#rooms');
                        }
                    });
                }
            }

            const connectBtn = document.getElementById('navToLogin');
            connectBtn.style.visibility = "hidden";

            $('#server').keyup(function () {
                const urlCheck = '^(https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$';
                if ($('#server').val().match(urlCheck)) {                    
                    connectBtn.style.visibility = "visible";
                }
                else {
                    connectBtn.style.visibility = "hidden";
                }
                
            });
            $('#username').on('change', function () {
                // TO-DO
            });
            $('#password').on('change', function () {
                // TO-DO
            });

            var server = $('#server').val();
            var user = $('#username').val();
            var password = $('#password').val();

            // Handle the connect action on the dialog window.
            $('#connect').on('click', function () {

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
                                    buildChannelsList($('#room-picker'), config.channel, response.channels, onRoomSelected);
                                    showView('#rooms');
                                }
                            });
                        }
                    }
                });
            });

            function onRoomSelected() {
                config.channel = $("#room-picker option:selected").text();

                // Send configuration to the host.
                sendMessageToHost(JSON.stringify(config));
            }

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
                            resetConfiguration();
                        }
                    });
                }
            });

            $('#navToLogin').on('click', function () {
                var login = '#login';
                if (validateUrl($('#server').val()).status != 200) {
                    const error = {};
                    error.statusText = 'Ungültige Server URL';
                    showError(error)
                    return;
                }
                else {
                    showView(login);
                }
                
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
                var x = document.getElementById("snackbar");
                x.className = "show";
                x.textContent = error.statusText;
                setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
            }

            function validateUrl(server) {
                const res =  $.ajax({
                    url: server+'/api/v1/info',
                    async: false                 
                  })
                return res;
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