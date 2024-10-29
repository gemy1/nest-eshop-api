const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class InitSchema1730146141427 {
  name = 'InitSchema1730146141427';

  async up(queryRunner) {
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "username" varchar NOT NULL,
                "password" varchar NOT NULL,
                "email" varchar NOT NULL,
                "refreshToken" varchar,
                "role" varchar NOT NULL DEFAULT ('user'),
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
            )
        `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
            DROP TABLE "users"
        `);
  }
};
