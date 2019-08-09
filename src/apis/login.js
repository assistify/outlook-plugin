// Invoke the login api call.
function login(config, callback) {
    var url = config.server + '/api/v1/login';

    $.ajax({
        url: url,
        method: 'POST',
        data: {
            user: config.user,
            password: config.password,
        },
    }).done(function (response) {
        callback(response);
    }).fail(function (error) {
        callback(null, error);
    });
}