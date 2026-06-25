import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.error("Vui lòng nhập mật khẩu. VD: npx tsx scripts/hash-password.ts mypassword123");
  process.exit(1);
}

const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);

console.log("Password:", password);
console.log("Hash:", hash);
console.log("\nCopy hash trên vào biến ADMIN_PASSWORD_HASH trong file .env.local");
