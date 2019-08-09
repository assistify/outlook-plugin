function getRoom(config, roomName, callback) {
    var url = config.server + '/api/v1/channels.info';
    $.ajax({
        url: url,
        dataType: 'json',
        method: 'GET',
        headers: {
            'X-Auth-Token': config.authToken,
            'X-User-Id': config.userId,
        },
        data: {
            roomName: roomName,
        },
    }).done(function (response) {
        callback(response)
    }).fail(function (error) {
        callback(null, error)
    });
}

function createNewDiscussion(config, discussion, callback) {
    var url = config.server + '/api/v1/rooms.createDiscussion';
    $.ajax({
        url: url,
        dataType: 'json',
        method: 'POST',
        headers: {
            'X-Auth-Token': config.authToken,
            'X-User-Id': config.userId,
        },
        data: {
            prid: discussion.parentId,
            t_name: discussion.name,
            users: discussion.users
        },
    }).done(function (response) {
        callback(response)
    }).fail(function (error) {
        callback(null, error)
    });
}