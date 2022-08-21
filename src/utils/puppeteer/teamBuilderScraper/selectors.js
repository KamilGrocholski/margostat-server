export const SELECTORS = {
    TABLE: 
        'body > div.background-logged-wrapper > div > div.body-container > div.body-left-container > div > div.guild-members-container > table',
    TABLE_ROW: 
        'body > div.background-logged-wrapper > div > div.body-container > div.body-left-container > div > div.guild-members-container > table > tbody > tr',
    NICK: function(n) {
        return `body > div.background-logged-wrapper > div > div.body-container > div.body-left-container > div > div.guild-members-container > table > tbody > tr:nth-child(${n}) > td.nick.table-borders > a`
    },
    LVL: function(n) {
        return `body > div.background-logged-wrapper > div > div.body-container > div.body-left-container > div > div.guild-members-container > table > tbody > tr:nth-child(${n}) > td.level.table-borders`
    },
    PROF: function(n) {
        return `body > div.background-logged-wrapper > div > div.body-container > div.body-left-container > div > div.guild-members-container > table > tbody > tr:nth-child(${n}) > td.prof.table-borders`
    }
}