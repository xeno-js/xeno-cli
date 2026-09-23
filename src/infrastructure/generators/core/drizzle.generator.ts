import path from 'node:path'

import type { IFileService, IGenerator } from '../../../domain'
import { type CoreOptions } from '../../../shared'

/**
 * @class DrizzleGenerator
 * @description Generates the Drizzle configuration file (drizzle.config.ts) and a basic schema file (src/schema.ts) for database scaffolding.
 * The generator is only invoked if the user has opted to include database support in their project.
 *
 * @author Xeno
 * @version 1.0.0
 * @license ISC
 * @since 2025-09-30
 * @link https://github.com/xeno-js/xeno-js
 */
export class DrizzleGenerator implements IGenerator<CoreOptions> {
  constructor(private readonly _fileService: IFileService) {}

  async generate(projectPath: string, _options: CoreOptions): Promise<void> {
    const configContent = this.composeDrizzleConfig()
    const filePath = path.join(projectPath, 'drizzle.config.ts')
    await this._fileService.writeFileRecursive(filePath, configContent)

    const schemaContent = this.composeSchema()
    await this._fileService.writeFileRecursive(
      path.join(projectPath, 'src', 'schema.ts'),
      schemaContent,
    )
  }

  private composeDrizzleConfig(): string {
    return `/// <reference types="node" />
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

/**
 * Drizzle Kit configuration file.
 * Defines the schema location, migration output directory, and database connection.
 */
export default defineConfig({
  schema: './src/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
`
  }

  private composeSchema(): string {
    return `import { boolean, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

/**
 * @description Define your database tables here.
 * The 'usersTable' serves as a baseline example. 
 * You can add more tables, relations, and indexes according to your domain requirements.
 */
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  isDeleted: boolean('is_deleted').notNull().default(false),
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').defaultNow(),
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
export type DbSchema = {
  users: typeof usersTable;
};
`
  }
}
