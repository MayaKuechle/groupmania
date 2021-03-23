module.exports = {
    HOST: "db4free.net",
    USER: "groupmania2020",
    PASSWORD: "groupmania2020",
    DB: "groupmania",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };