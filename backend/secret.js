import crypto from "crypto";

const accessSecret = crypto.randomBytes(64).toString("hex");
const refreshSecret = crypto.randomBytes(64).toString("hex");

console.log("ACCESS_SECRET=", accessSecret);
console.log("REFRESH_SECRET=", refreshSecret);

/* 
?DONT FORGET
 1-Bu islem  server postgresql den backup almak ve .sql dosyasi olusturmak icin kullanilir.
  Istenilen klasor olusururu icinde yapariz vey EN Yaxsisi kendi projdeininklasoruine

  pg_dump -U postgres -d chat_database -f "C:\Users\acer\Desktop\chat_web\backend\db\chat_database.sql"

  
2-ci Neon-a  da yuklemek icin bu komut kullailir bu  terminalden komut yapisi 

C:\Users\acer>psql "postgresql://neondb_owner:password@ep-tiny-shadow-asqtqrcw.c-4.eu-central-1.aws.neon.tech/neondb?sslmode=require" -f 
"C:\Users\acer\Desktop\chat_web\backend\db\chat_database.sql"

*/