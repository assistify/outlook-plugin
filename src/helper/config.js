
function getConfiguration() {
    return {
        server: Office.context.roamingSettings.get('server'),
        userId: Office.context.roamingSettings.get('userId'),
        authToken: Office.context.roamingSettings.get('authToken'),
    };
}

function setConfiguration(config,  callback) {
    Office.context.roamingSettings.set('server', config.server);
    Office.context.roamingSettings.set('userId', config.userId);
    Office.context.roamingSettings.set('authToken', config.authToken);
    Office.context.roamingSettings.saveAsync(callback);
}

