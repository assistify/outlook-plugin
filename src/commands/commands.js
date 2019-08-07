import $ from 'jquery';

/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

Office.onReady(info => {
  // If needed, Office.js is ready to be called
});

function getItemRestId() {
  if (Office.context.mailbox.diagnostics.hostName === 'OutlookIOS') {
    // itemId is already REST-formatted
    return Office.context.mailbox.item.itemId;
  } else {
    // Convert to an item ID for API v2.0
    return Office.context.mailbox.convertToRestId(
      Office.context.mailbox.item.itemId,
      Office.MailboxEnums.RestVersion.v2_0
    );
  }
}

function getCurrentItem(accessToken) {
  // Get the item's REST ID
  var itemId = getItemRestId();

  // Construct the REST URL to the current item
  // Details for formatting the URL can be found at
  // /previous-versions/office/office-365-api/api/version-2.0/mail-rest-operations#get-a-message-rest
  var getMessageUrl = Office.context.mailbox.restUrl +
    '/v2.0/me/messages/' + itemId;

  const item = $.ajax({
    url: getMessageUrl,
    dataType: 'json',
    headers: { 'Authorization': 'Bearer ' + accessToken },
    async: false,
  });
  return item.responseJSON;
}
// **********************
// ROCKETCHAT API CALLS
// **********************

function login(baseUrl, email, password) {
  const response = $.ajax({
    url: baseUrl+ 'login',
    dataType: 'json',
    method: 'POST',
    data: {
      'email': email,
      'password': password
    },
    async: false,
  });
  const userId = response.responseJSON.data.userId
  const authToken = response.responseJSON.data.authToken
  return {userId, authToken}
}

function getRoom(baseUrl, name, {userId, authToken}) {
  let response = $.ajax({
    url: baseUrl+'channels.info',
    dataType: 'json',
    method: 'GET',
    headers: {
      'X-Auth-Token': authToken,
      'X-User-Id': userId,
    },
    data: {
      'roomName': name
    },
    async: false,
  });
  console.log(response)
  if (response.responseJSON.success == true) {
    response = response.responseJSON.channel
  }
  else {
    response = $.ajax({
      url: baseUrl+'groups.info',
      dataType: 'json',
      method: 'GET',
      headers: {
        'X-Auth-Token': authToken,
        'X-User-Id': userId,
        'Accept': 'application/json'
      },
      data: {
        'roomName': name
      },
      async: false,
    });
    response = response.responseJSON.group
  }

  return response
}

function getParentRoomMembers(baseUrl, parent, {userId, authToken}) {
  let requestUrl = baseUrl + 'channels.members';
  let response = $.ajax({
    url: requestUrl,
    dataType: 'json',
    method: 'GET',
    headers: {
      'X-Auth-Token': authToken,
      'X-User-Id': userId,
      'Accept': 'application/json'
    },
    async: false,
  });
  if (response.responseJSON.success === true) {
    return response.body.members.map(member => {
        return member.username;
    });
  }
  else {
    requestUrl = baseUrl + 'groups.members';
    response = $.ajax({
      url: requestUrl,
      dataType: 'json',
      method: 'GET',
      headers: {
        'X-Auth-Token': authToken,
        'X-User-Id': userId,
        'Accept': 'application/json'
      },
      async: false,
    });
    return response.responseJSON.members.map(member => {
        return member.username;
    });
  }
}

function createNewDiscussion(baseUrl, parentId, name, users, {userId, authToken}) {
  const response = $.ajax({
    url: baseUrl+ 'rooms.createDiscussion',
    dataType: 'json',
    method: 'POST',
    headers: {
      'X-Auth-Token': authToken,
      'X-User-Id': userId,
    },
    data: {
      'prid': parentId,
      't_name': name,
      'users': users
    },
    async: false,
  });
  return response.responseJSON.discussion
}


function postMail(baseUrl, roomId, text, {userId, authToken}) {
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
/**
 * Shows a notification when the add-in command is executed.
 * @param event {Office.AddinCommands.Event}
 */
function action(event) {

  Office.context.mailbox.getCallbackTokenAsync({ isRest: true }, function (result) {
    if (result.status === "succeeded") {
      var accessToken = result.value;
      // Use the access token
      console.log('get item');
      const item = getCurrentItem(accessToken)
      console.log(item)
      if (item) {
        // GET PARENT ROOM
        const url = ''
        const parent = ''
        const email = ''
        const password = ''

        const {userId, authToken} = login(url, email, password);
        const parentId = getRoom(url, parent, {userId, authToken})._id;
        
        // GET USERS
        // CREATE DISCUSSION
        const discussion = createNewDiscussion(url, parentId, 'test', [], {userId, authToken});
        // SEND MESSAGE IN CHAT
        postMail(url, discussion._id, item.BodyPreview, {userId, authToken})
        const message = {
          type: Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage,
          message: "Performed action.",
          icon: "Icon.80x80",
          persistent: true
        }

        // Show a notification message
        Office.context.mailbox.item.notificationMessages.replaceAsync("action", message);

        // Be sure to indicate when the add-in command function is complete
        //event.completed();
      }
    } else {
      console.log('Error');
      // Handle the error
    }
  });


}

function getGlobal() {
  return (typeof self !== "undefined") ? self :
    (typeof window !== "undefined") ? window :
      (typeof global !== "undefined") ? global :
        undefined;
}

const g = getGlobal();

// the add-in command functions need to be available in global scope
g.action = action;
