// Retrieves all the configuration 
function getAllConfiguration() {
    return {
        server: Office.context.roamingSettings.get('server'),
        userId: Office.context.roamingSettings.get('userId'),
        authToken: Office.context.roamingSettings.get('authToken'),
        channelId: Office.context.roamingSettings.get('channelId'),
        channelType: Office.context.roamingSettings.get('channelType'),
    };
}

// Stores login configuration
function setLoginConfiguration(config, callback) {
    Office.context.roamingSettings.set('server', config.server);
    Office.context.roamingSettings.set('userId', config.userId);
    Office.context.roamingSettings.set('authToken', config.authToken);
    Office.context.roamingSettings.saveAsync(callback);
}

// Stores room configuration
function setRoomConfiguration(config, callback) {
    Office.context.roamingSettings.set('channelId', config.channelId);
    Office.context.roamingSettings.set('channelType', config.channelType);
    Office.context.roamingSettings.saveAsync(callback);
}

// Reset all configuration
function resetAllConfiguration(config) {
    Office.context.roamingSettings.remove('server');
    Office.context.roamingSettings.remove('userId');
    Office.context.roamingSettings.remove('authToken');
    Office.context.roamingSettings.remove('channelId');
    Office.context.roamingSettings.remove('channelType');
    Office.context.roamingSettings.saveAsync();
}




