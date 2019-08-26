# Assistify Outlook Plugin

Adds a button to Outlook to send the current e-mail to an Assistify or Rocket.Chat channel.

The first time you use this plugin, you will be asked to provide the URL of the chat you want to use.
After that, you are expected to log in there. This is required to connect your personal chat account to
your Outlook instance. This connection persists, so this is not necessary the next time you use the plugin.

When you send a message to the chat, you are asked to select a chat channel / room. In this room, the plugin
creates a new discussion, so that you and your team can discuss the e-mail in this new discussion.

## Developing the pluing

If you want to change something on your local version of the plugin, you can setup a local server, which
serves the modified pages of the plugin to outlook.

1. Create a server certificate by executing the following command:

    openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out server.crt

2. Install a tool to serve local files via https:

    npm install -g local-web-server
    
3. Modify your local copy of the `manifest.xml` file by replacing the string `https://assistify.github.io/outlook-plugin`
with `https://localhost:8000`.

   **Dont commit these changes!**

4. Import the modified `manifest.xml` file to Outlook

5. Start the local server

    ws --https --cert server.crt --key server.key
    
## Debugging

The plugin can be debugged in the developer tools of Chrome. If you have a local server running, you could even
add a line with the `debugger` command in the JavaScript code to stop at this location, because it is sometimes
difficult to identify the file between the several hundred (!) files that Outlook loads.

## Logging

Events will be logged only if hosted somewhere different than GitHub pages on a server or docker container running Node.js.

The small Node.js based server only serves the plugin files, and injects different URLs to the manifest.xml and message.js files to enable logging to a loggia-Host.

All URLs are given as environment variables to the Node.js server:

    LOGGER_URL=https://internal.server.running.loggia
    INTERNAL_PLUGIN_URL=https://internal.server.running.index.js
    PUBLIC_PLUGIN_URL=https://assistify.github.io/outlook-plugin
    Optionally, you can use DEBUG=true to log all request to the console
