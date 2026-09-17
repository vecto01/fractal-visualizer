module.exports = {
    ui: 'bdd',
    timeout: 3000,
    require: ['chai/register'], // Подключаем Chai для assert
    spec: ['tests/**/*.js']
};