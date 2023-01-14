const LevelSchemaVersion = 2;

module.exports = {
    GetLevelExperience(level) {
        // Mee6 compliant levelling formula
        if (level < 1) return 0;
        return 5 / 6 * level * (2 * level * level + 27 * level + 91);
    },
    GiveExperience() {
        // Mee6 compliant experience per message formula
        return 15 + Math.ceil(Math.random() * 10);
    },
    GetUserLevelSchema(version = LevelSchemaVersion, schema = null) {
        switch (version) {
            case 2:
                // Need a rate limit
                schema.rateLimit = Date.now();
                schema.version = 2;
            case 1:
                // Simply create the first schema
                if (!schema) schema = { 
                    version: 1, 
                    level: 0, 
                    experience: 0, 
                    rateLimit: 0  // v2
                };
        }
        if (version < LevelSchemaVersion) return this.GetUserLevelSchema(version + 1, schema);
        return schema;
    },
    GetUserInfo(memberId, levelStore) {
        let info = levelStore.get(memberId);
        if (!info) info = this.GetUserLevelSchema(0);
        else if (info.version != LevelSchemaVersion) info = this.GetUserLevelSchema(info.version, info);
        return info;
    }
}