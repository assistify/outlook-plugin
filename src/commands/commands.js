/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

Office.onReady(info => {
  // If needed, Office.js is ready to be called
});

function showConfigDialog(event) {
  // Not Configured: Show the configuration dialog
  configEvent = event;
  var url = new URI('../settings/login.html').absoluteTo(window.location).toString();
  var dialogOptions = { width: 40, height: 60, displayInIframe: true };
  Office.context.ui.displayDialogAsync(url, dialogOptions, function (result) {
    loginDialog = result.value;
    loginDialog.addEventHandler(Microsoft.Office.WebExtension.EventType.DialogMessageReceived, processMessage);
    loginDialog.addEventHandler(Microsoft.Office.WebExtension.EventType.DialogEventReceived, dialogClosed);
  });
}

function processMessage(message) {
  config = JSON.parse(message.message);
  setConfiguration(config, function (result) {
    loginDialog.close();
    loginDialog = null;
    // Implicitly invoke the send message function
    send(configEvent);
  });

}

function dialogClosed(message) {
  loginDialog = null;
  configEvent.completed();
  configEvent = null;
}


function isValidConfig(config) {
  return false;
  //return config && config.server && config.userId && config.authToken && config.channel ;
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

  //Get the configuration for the Add-in.
  var config = getConfiguration();

  // Configuration must contain the Server Url, UserId & authToken.(if already logged in via api)
  if (!isValidConfig(config)) {
    showConfigDialog(event);
  } else {
    send(event);
  }
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
            var mail = response;
            postEMail(config, mail, function (response, error) {
              if (error) {
                // show error
              } else {
                var message = {
                  type: Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage,
                  message: "Performed action.",
                  icon: "Icon.80x80",
                  persistent: true
                };

                // Show a notification message
                Office.context.mailbox.item.notificationMessages.replaceAsync("action", message);
              }
              // Be sure to indicate when the add-in command function is complete
              event.completed();
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
