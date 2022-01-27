
module.exports = {
    SimpleEmbed(_title, _description, _color = 0x9B59B6)
    {
        let embed = { title: _title, description: _description, color: _color };
        return embed;
    },
    FieldEmbed(_title, _description, _fields, _color = 0x9B59B6)
    {
        let embed = this.SimpleEmbed(_title, _description, _color);
        embed.fields = _fields;
        return embed;
    },
    FieldFooter(_title, _description, _fields, _footer, _color = 0x9B59B6)
    {
        let embed = this.FieldEmbed(_title, _description, _fields, _color);
        embed.footer = _footer;
        return embed;
    },
    Error(_error)
    {
        let embed = { title: "Error!", description: _error, color: 0xFF0000 };
        return embed;
    },
    Malformed()
    {
        return this.Error("Malformed command", "Check the command arguments");
    }
}