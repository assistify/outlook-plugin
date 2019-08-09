


/* function getRoom(baseUrl, name, { userId, authToken }) {
    let response = $.ajax({
      url: baseUrl + '/api/v1/channels.info',
      dataType: 'json',
      method: 'GET',
      headers: {
        'X-Auth-Token': authToken,
        'X-User-Id': userId,
        'Accept': 'application/json'
      },
      data: {
        'roomName': name || 'general'
      }
    });

    if (response.responseJSON.body.success == true) {
      response = response.responseJSON.body.channel
    }
    else {
      response = $.ajax({
        url: baseUrl + '/api/v1/groups.info',
        dataType: 'json',
        method: 'GET',
        headers: {
          'X-Auth-Token': authToken,
          'X-User-Id': userId,
          'Accept': 'application/json'
        },
        data: {
          'roomName': name
        }
      });
      response = response.responseJSON.body.group
    }

    return response
  }

function getParentRoomMembers(baseUrl, parent, { userId, authToken }) {
    let requestUrl = baseUrl + '/api/v1/channels.members';
    let response = $.ajax({
        url: requestUrl,
        dataType: 'json',
        method: 'GET',
        headers: {
            'X-Auth-Token': authToken,
            'X-User-Id': userId,
            'Accept': 'application/json'
        }
    });
    if (response.responseJSON.body.success === true) {
        return response.body.members.map(member => {
            return member.username;
        });
    }
    else {
        requestUrl = baseUrl + '/api/v1/groups.members';
        response = $.ajax({
            url: requestUrl,
            dataType: 'json',
            method: 'GET',
            headers: {
                'X-Auth-Token': authToken,
                'X-User-Id': userId,
                'Accept': 'application/json'
            }
        });
        return response.responseJSON.body.members.map(member => {
            return member.username;
        });
    }
}




function postMail(baseUrl, roomId, text, { userId, authToken }) {
    const requestUrl = baseUrl + 'chat.postMessage';
    const response = $.ajax({
        url: requestUrl,
        dataType: 'json',
        method: 'POST',
        headers: {
            'X-Auth-Token': authToken,
            'X-User-Id': userId,
        },
        data: {
            'roomId': roomId,
            'text': text
        }
    });

    return response.responseJSON
}
 */