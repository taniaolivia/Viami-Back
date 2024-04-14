// themeService.js

const db = require('../knex');

exports.listThemes = async () => {
    try {
        const themes = await db('theme').select('*').orderBy('theme', 'asc');
        return themes;
    } catch (error) {
        throw new Error('Database error');
    }
};

exports.getFiveThemes = async () => {
    try {
        const themes = await db('theme').select('*').orderBy('theme', 'asc').limit(5).offset(0);
        return themes;
    } catch (error) {
        throw new Error('Database error');
    }
};
