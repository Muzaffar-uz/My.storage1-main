module.exports = {
    development :{
        client: 'mysql2',
        connection : {
            host : 'localhost',
            database : 'my.storage',
            user: 'root',
            password:''
        },
        pool:{
            min: 0,
            max: 7,
        }
    }
}