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
      callback(null, error)
    });
}