

function getItem(accessToken, itemId, callback) {
  // Construct the REST URL to the current item
  // Details for formatting the URL can be found at
  // /previous-versions/office/office-365-api/api/version-2.0/mail-rest-operations#get-a-message-rest

  var getMessageUrl = Office.context.mailbox.restUrl +
    '/v2.0/me/messages/' + itemId;

  $.ajax({
    url: getMessageUrl,
    dataType: 'json',
    headers: {
      'Authorization': 'Bearer ' + accessToken
    },
  })
    .done(function (item) {
      callback(item);
    })
    .fail(function (error) {
      callback(null, error);
    });
}

function getRoom(config, callback) {
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
      roomName: config.channel || 'general',
    },
  }).done(function (response) {
    getParentRoomMembers(config, function (mresponse, error) {
      if (error) {
        callback(null, error);
      } else {
        response.members = mresponse.members.map(member => {
            return member.username;
        });
        callback(response);
      }
    });
  }).fail(function (error) {
    callback(null, error);
  });
}

function getParentRoomMembers(config, callback) {
  var url = config.server + '/api/v1/channels.members';
  $.ajax({
      url: url,
      dataType: 'json',
      method: 'GET',
      headers: {
        'X-Auth-Token': config.authToken,
        'X-User-Id': config.userId,
      },
  }).done(function (response) {
    callback(response);
  }).fail(function (error) {
    callback(null, error);
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
    callback(response);
  }).fail(function (error) {
    callback(null, error);
  });
}

function createDiscussion(config, mail, callback) {
  // Get the room in which the mail will posted.
  getRoom(config, function (response, error) {
    if (error) {
      callback(null, error);
    } else {
      var discussion = {
        parentId: response.channel._id,
        name: mail.Subject,
        members: response.members || []
      };
      //Create a new channel
      createNewDiscussion(config, discussion, function (response, error) {
        if (error) {
          callback(null, error);
        } else {
          callback(response);
        }
      });
    }
  });
}

function convertHtmlToMarkdown(htmlText) {
  const options = {
    bulletListMarker: "-"
  }
  const turndownService = new TurndownService(options)
  const markdown = turndownService.turndown(htmlText)
  console.log(markdown)
  return markdown.replace(/<\!--.*?-->/g, "");
}

function postEMail(config, mail, callback) {

  markdownText = convertHtmlToMarkdown(mail.Body.Content)

  createDiscussion(config, mail, function (response, error) {
    if (error) {
      callback(error);
    } else {
      const url = config.server + '/api/v1/chat.postMessage';
      $.ajax({
        url: url,
        dataType: 'json',
        method: 'POST',
        headers: {
          'X-Auth-Token': config.authToken,
          'X-User-Id': config.userId,
        },
        data: {
          'roomId': response.discussion.rid,
          'text': markdownText
        }
      }).done(function (response) {
        callback(response);
      }).fail(function (error) {
        callback(null, error);
      });
    }
  });



}

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





 */