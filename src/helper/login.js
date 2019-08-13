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

  var url = config.server + '/api/v1/channels.list.joined';
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

function buildChannelsList(parent, channels, callback) {
  channels.forEach(function (channel) {

    var list = $('<li>')
      .appendTo(parent);

    var item = $('<div>')
      .attr('id', channel._id)
      .addClass('listitem')
      .val(channel._id)
      .appendTo(list);

    var text = $('<label>')
      .text(channel.name)
      .appendTo(item);

    item.on('click', { channel: $('#' + channel._id).val() }, callback);
  });

}