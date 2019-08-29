
function getConfiguration() {
    return {
        server: Office.context.roamingSettings.get('server'),
        userId: Office.context.roamingSettings.get('userId'),
        authToken: Office.context.roamingSettings.get('authToken'),
        channelId: Office.context.roamingSettings.get('channelId'),
        channelType: Office.context.roamingSettings.get('channelType'),
    };
}

function setConfiguration(config, callback) {
    Office.context.roamingSettings.set('server', config.server);
    Office.context.roamingSettings.set('userId', config.userId);
    Office.context.roamingSettings.set('authToken', config.authToken);
    Office.context.roamingSettings.set('channelId', config.channelId);
    Office.context.roamingSettings.set('channelType', config.channelType);
    Office.context.roamingSettings.saveAsync(callback);
}

function resetConfiguration(config) {
    Office.context.roamingSettings.remove('server');
    Office.context.roamingSettings.remove('userId');
    Office.context.roamingSettings.remove('authToken');
    Office.context.roamingSettings.remove('channelId');
    Office.context.roamingSettings.remove('channelType');
    Office.context.roamingSettings.saveAsync();
}




