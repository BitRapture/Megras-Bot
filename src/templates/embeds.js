module.exports = {
    Simple(title, description, fields = [], color = 0x9B59B6) {
        let embed = { title: title, description: description, color: color };
        if (fields.length > 0) embed.fields = fields;
        return {embeds: [embed]};
    }
}