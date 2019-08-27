/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

var configEvent;

// The initialize function must be run each time a new page is loaded.
Office.initialize = function (reason) {
 
};

function showDialog(event, data) {
  //Show the dialog window
  configEvent = event;
  var url = new URI('../settings/login.html').absoluteTo(window.location).toString();
  var dialogOptions = { width: 30, height: 50, displayInIframe: true };
  if (data) {
    url = url + '?param=' + encodeURIComponent(JSON.stringify(data));
  }
  Office.context.ui.displayDialogAsync(url, dialogOptions, function (result) {
    loginDialog = result.value;
    loginDialog.addEventHandler(Microsoft.Office.WebExtension.EventType.DialogMessageReceived, processMessage);
    loginDialog.addEventHandler(Microsoft.Office.WebExtension.EventType.DialogEventReceived, dialogClosed);
  });
}

function processMessage(arg) {
  var messageFromDialog = JSON.parse(arg.message);
  switch (messageFromDialog.action) {
    case 'logoff':
      // resets the user's preference
      resetConfiguration(messageFromDialog);
      break;
    case 'send':
      // Stores the user's preference
      setConfiguration(messageFromDialog, function (result) {
        loginDialog.close();
        loginDialog = null;
        // Send message 
        send(configEvent);
      });
      break;
    case 'close':
      loginDialog.close();
      loginDialog = null;
      configEvent.completed();
      break;
    default:
      break;
  }
}

function dialogClosed(arg) {
  loginDialog = null;
  configEvent.completed();
  configEvent = null;
}

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

/**
 * Shows a notification when the add-in command is executed.
 * @param event {Office.AddinCommands.Event}
 */
function forward(event) {
  // Show the configuartion dialog.
  showDialog(event, getConfiguration());
}

function send(event) {
  // Get the access token
  Office.context.mailbox.getCallbackTokenAsync({ isRest: true }, function (result) {
    if (result.status === "succeeded") {
      var accessToken = result.value;

      // Get Mail REST Id
      var itemId = getItemRestId();

      // Read the mail item
      try {
        getItem(accessToken, itemId, function (response, error) {
          if (error) {
            showError(error);
          } else {
            postEMail(getConfiguration(), response, function (response, error) {
              if (error) {
                // Be sure to indicate when the add-in command function is complete
                event.completed();
                // show error
              } else {
                var result = {};
                result.discussion = response.channel;
                result.message = response.message._id;
                result.status = 'success';
                var message = {
                  type: Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage,
                  message: "Mail forwarded.",
                  icon: "success.svg",
                  persistent: true
                };
                showDialog(event, result);
                // Show a notification message
                Office.context.mailbox.item.notificationMessages.replaceAsync("action", message);
              }
            });
          }
        });
      } catch (error) {
        showError(error);
      }
    } else {
      showError();
    }
  });
}

function showError(error) {
  // To Do Error display
}

function getGlobal() {
  return (typeof self !== "undefined") ? self :
    (typeof window !== "undefined") ? window :
      (typeof global !== "undefined") ? global :
        undefined;
}

var g = getGlobal();

// the add-in command functions need to be available in global scope
g.forward = forward;
