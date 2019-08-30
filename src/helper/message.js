var usageLogger = null;

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

function getParentRoomMembers(config, callback) {
  var url;
  if (config.channelType === 'p') {
    url = config.server + '/api/v1/groups.members';
  } else {
    url = config.server + '/api/v1/channels.members';
  }
  
  $.ajax({
    url: url,
    dataType: 'json',
    method: 'GET',
    headers: {
      'X-Auth-Token': config.authToken,
      'X-User-Id': config.userId,
    },
    data: {
      roomId: config.channelId
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
      users: discussion.members
    },
  }).done(function (response) {
    callback(response);
  }).fail(function (error) {
    callback(null, error);
  });
}

function createDiscussion(config, mail, callback) {
  // Get the room in which the mail will posted.
  getParentRoomMembers(config, function (response, error) {
    if (error) {
      callback(null, error);
    } else {
      var discussion = {
        parentId: config.channelId,
        name: mail.Subject,
        members: response.members || [],
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
  var options = {
    bulletListMarker: "-"
  };
  var turndownService = new TurndownService(options);
  var markdown = turndownService.turndown(htmlText.replace(/&nbsp;/g, " "));
  return markdown.replace(/<\!--.*?-->/g, "");
}

function postEMail(config, mail, callback) {
  markdownText = convertHtmlToMarkdown(mail.Body.Content);

  createDiscussion(config, mail, function (response, error) {
    if (error) {
      callback(error);
    } else {
      var url = config.server + '/api/v1/chat.postMessage';
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
        if (usageLogger) {
          sendToLog(config.server.replace(/.*\/\/([^.]+).*/, '$1'), config.userId, response.message.rid)
            .done(function () {
              callback(response);
            })
        } else {
          callback(response)
        }
      }).fail(function (error) {
        callback(null, error);
      });
    }
  });

  function sendToLog(env, userId, parent) {
    return $.ajax({
      url: usageLogger,
      dataType: 'json',
      method: 'POST',
      data: {
        s: 'outlook-plugin',
        t: +new Date(),
        e: env,
        u: userId,
        p: parent
      }
    })
  }
}
