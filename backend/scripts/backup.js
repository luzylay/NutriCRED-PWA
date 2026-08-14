const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { pipeline } = require('stream');
const util = require('util');

const pipelineAsync = util.promisify(pipeline);

const dbPath = path.join(__dirname, '..', 'dev.db');
const backupsDir = path.join(__dirname, '..', 'backups');
const password = process.env.BACKUP_PASSWORD || 'default_secure_password_replace_in_prod';
const algorithm = 'aes-256-cbc';

async function backupAndEncrypt() {
  if (!fs.existsSync(backupsDir)) {
    fs.mkdirSync(backupsDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFilename = `backup-${timestamp}.db.enc`;
  const backupPath = path.join(backupsDir, backupFilename);

  // Generate a random initialization vector
  const iv = crypto.randomBytes(16);
  // Generate a key from the password
  const key = crypto.scryptSync(password, 'salt', 32);

  const cipher = crypto.createCipheriv(algorithm, key, iv);

  const input = fs.createReadStream(dbPath);
  const output = fs.createWriteStream(backupPath);

  // Write the IV to the beginning of the file so it can be used for decryption
  output.write(iv);

  try {
    await pipelineAsync(input, cipher, output);
    console.log(`Backup completed successfully: ${backupPath}`);
  } catch (error) {
    console.error('Backup failed:', error);
    process.exit(1);
  }
}

backupAndEncrypt();
