import  bcrypt from 'bcrypt';

bcrypt.hash('123456', 10).then(console.log);
bcrypt.hash('654321', 10).then(console.log)

//?  EVET nasil bir password --cevirir yani salt etmek mantikini conolda gormek icin test icin yazdim !