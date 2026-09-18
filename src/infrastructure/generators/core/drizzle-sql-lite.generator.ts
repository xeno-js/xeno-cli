import path from 'node:path'

import type { IFileService, IGenerator } from '../../../domain'
import { type CoreOptions } from '../../../shared'

/**
 * @class DrizzleSqlLiteGenerator
 * @description Generates a Drizzle configuration file (drizzle.config.ts) and a
 * SQLite schema example (src/infrastructure/db/sqlite-schema.ts) when the user
 * opts to use SQLite/libSQL instead of Postgres.
 */
export class DrizzleSqlLiteGenerator implements IGenerator<CoreOptions> {
  constructor(private readonly _fileService: IFileService) {}

  async generate(projectPath: string, _options: CoreOptions): Promise<void> {
    const configContent = this.composeDrizzleConfig()
    const filePath = path.join(projectPath, 'drizzle.config.ts')
    await this._fileService.writeFileRecursive(filePath, configContent)

    const schemaPath = path.join(projectPath, 'src', 'schema.ts')
    const schemaContent = this.composeSchema()
    await this._fileService.writeFileRecursive(schemaPath, schemaContent)
  }

  private composeDrizzleConfig(): string {
    return `import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

/**
 * Drizzle Kit configuration for SQLite / libSQL.
 * Uses environment variable SQLITE_DATABASE_URL to locate the database.
 */
export default defineConfig({
  schema: './src/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.SQLITE_DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
`
  }

  private composeSchema(): string {
    return `import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

 /**
  * Example SQLite schema using Drizzle's libsql primitives.
  * Place your application tables here (this file is scaffolded by the CLI when
  * the user opts into SQLite support).
  */
 export const usersTable = sqliteTable('users', {
   id: integer('id').primaryKey().notNull(),
   name: text('name').notNull(),
   description: text('description'),
 });

/**
 * Types inferred from the schema.
 * - UserDto: Represents the shape of the data retrieved from the database ($inferSelect).
 * - NewUserDto: Represents the shape of the data required to insert a new record ($inferInsert).
 */
export type UserDto = typeof usersTable.$inferSelect;
export type NewUserDto = typeof usersTable.$inferInsert;

/**
 * Centralized Database Schema dictionary.
 */
export type SqliteSchema = {
  users: typeof usersTable;
};
`
  }
}
