(function () {
    'use strict';
    // The initialize function must be run each time a new page is loaded.
    Office.onReady(function (reason) {

        $(document).ready(function (e) {
            var config = {};
            var rooms;
            var messageUrl;
            if (window.location.search) {
                var params = JSON.parse(getParameterByName('params'));
                if (params && params.status === 'success') {
                    messageUrl = params.server + '/group/' + params.discussion.substring(1) + '?msg=' + params.message;
                    showSuccessDialog();
                } else if (isValidConfig(params)) {
                    // Valid user preference exists, skip login screen
                    config = params;
                    showRooms(config);
                }
            }

            var connectBtn = document.getElementById('navToLogin');
            connectBtn.disabled = true;

            $('#server').keyup(function () {
                if ($('#server').val().match(/^(https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?$/)) {
                    connectBtn.disabled = false;
                    if (e.keyCode === 13) {
                        $('#navToLogin').click();
                    }
                }
                else {
                    connectBtn.disabled = true;
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
                        error.statusText = 'Ungültiger Benutzername oder Passwort';
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

            $('#close').on('click', function (event, trigger) {
                if (!trigger || trigger !== "autoClose") {
                    window.open(messageUrl, '_blank');
                }
                config.action = 'close';
                sendMessageToHost(JSON.stringify(config));
            });

            $('#logoff').on('click', function () {
                //Go back to URL page
                var url = '#url';
                showView(url);

                // Clear Room list from the UI
                $('#room-picker').empty();

                // Invalidate the user configuration stored in the outlook local storage.
                config.action = 'logoff';
                sendMessageToHost(JSON.stringify(config));

                // Also logout the user session from Rocket.Chat
                if (config.authToken && config.userId) {
                    logout(config, function (response, error) {
                        if (error) {
                            showError(error);
                        } else {
                            var message = response.data.message;
                            showSuccess(message);
                        }
                    });
                }
            });

            $('#navToLogin').on('click', function () {
                // Validate existance of URL
                var login = '#login';
                validateUrl($('#server').val(), function (response, error) {
                    if (error && error.status !== 200) {
                        error.statusText = 'Ungültige Server URL';
                        showError(error);
                    } else {
                        showView(login);
                    }
                });
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
                var x = document.getElementById("snackbar");
                x.className = "showError";
                x.textContent = error.statusText || error.responseText.message;
                setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
            }

            function showSuccess(message) {
                var x = document.getElementById("snackbar");
                x.className = "showSuccess";
                x.textContent = message;
                setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
            }

            function validateUrl(server, callback) {
                $.ajax({
                    url: server + '/api/v1/info',
                    timeout: 2000 // Timesout after 3 secs
                }).done(function (response) {
                    callback(response);
                }).fail(function (error) {
                    callback(null, error);
                });
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

            function showSuccessDialog() {
                var success = '#success';
                showView(success);
                setTimeout(function () {
                    $('#close').trigger("click", "autoClose");
                }, 25000); // Close the dialog window manually, when user forgets to close. We need to do this to make sure that the event is completed.
            }
            function isValidConfig(config) {
                return config && config.server && config.authToken && config.userId && config.channelId;
            }
        });
    });
})();