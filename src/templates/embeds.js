module.exports = {
    Simple(title, description, color = 0x9B59B6, fields = []) {
        let embed = { title: title, description: description, color: color };
        if (fields.length > 0) embed.fields = fields;
        return {embeds: [embed]};
    }
}