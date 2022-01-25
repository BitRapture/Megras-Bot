
module.exports = {
    SimpleEmbed(_title, _description, _color = 0x9B59B6)
    {
        let embed = { title: _title, description: _description, color: _color }
        return embed;
    },
    FieldEmbed(_title, _description, _fields, _color = 0x9B59B6)
    {
        let embed = this.SimpleEmbed(_title, _description, _color);
        embed.fields = _fields;
        return embed;
    }
}