const slug = require("limax");

const rootPositions = server => {
    // Count the number of root-level channels
    return server.channels.filter(chan => !chan.parentID).array().length;
};

const findChannel = (server, name, type = "text") => {
    return server.channels.find(
        chan => chan.name === name && chan.type === type
    );
};

const spoilerChannelName = topic => `spoiler-${slug(topic)}`;

const create = async (topic, server) => {
    try {
        // Create "Spoilers" category
        let category = findChannel(server, "Spoilers", "category");
        if (!category) {
            category = await server.createChannel("Spoilers", "category");
            category.setPosition(rootPositions(server)); // Put at bottom of list
        }
        // Create channel based on topic
        let channel = findChannel(server, spoilerChannelName(topic));
        if (!channel) {
            channel = await server.createChannel(spoilerChannelName(topic));
            channel.setParent(category);
        }
    } catch (err) {
        console.error(err);
    }
};

module.exports = { create };
