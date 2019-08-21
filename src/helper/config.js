
function getConfiguration() {
    return {
        server: Office.context.roamingSettings.get('server'),
        userId: Office.context.roamingSettings.get('userId'),
        authToken: Office.context.roamingSettings.get('authToken'),
        channel: Office.context.roamingSettings.get('channel')
    };
}

function setConfiguration(config, callback) {
    Office.context.roamingSettings.set('server', config.server);
    Office.context.roamingSettings.set('userId', config.userId);
    Office.context.roamingSettings.set('authToken', config.authToken);
    Office.context.roamingSettings.set('channel', config.channel);
    Office.context.roamingSettings.saveAsync(callback);
}

function resetConfiguration(config) {
    Office.context.roamingSettings.remove('server');
    Office.context.roamingSettings.remove('userId');
    Office.context.roamingSettings.remove('authToken');
    Office.context.roamingSettings.remove('channel');
}




