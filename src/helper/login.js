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

function logout(config, callback) {

  var url = config.server + '/api/v1/logout';

  $.ajax({
    url: url,
    method: 'POST',
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


function getJoinedChannels(config, callback) {

  var channelsApi = config.server + '/api/v1/channels.list.joined';
  var groupsApi = config.server + '/api/v1/groups.list';

  $.when(
    $.ajax({
      url: channelsApi,
      dataType: 'json',
      method: 'GET',
      headers: {
        'X-Auth-Token': config.authToken,
        'X-User-Id': config.userId,
      },
    }),

    $.ajax({
      url: groupsApi,
      dataType: 'json',
      method: 'GET',
      headers: {
        'X-Auth-Token': config.authToken,
        'X-User-Id': config.userId,
      },
    })
  ).then(function (channels, groups) {
    callback(groups[0].groups.concat(channels[0].channels));
  });
}

function buildChannelsList(parent, prevChannel, channels) {
  if (prevChannel) {
    $(parent).val(prevChannel);
  }

  channels.forEach(function (channel) {
    $('<li>')
      .attr('id', channel._id)
      .val(channel.name)
      .text(channel.name)
      .appendTo(parent);
  });
}