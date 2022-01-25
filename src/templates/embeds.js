
module.exports = {
    SimpleEmbed(_title, _description, _color = 0x9B59B6)
    {
        return { title: _title, description: _description, color: _color };
    },
    FieldEmbed(_title, _description, _fields, _color = 0x9B59B6)
    {
        let embed = this.SimpleEmbed(_title, _description, _color);
        embed.fields = _fields;
        return embed;
    }
}