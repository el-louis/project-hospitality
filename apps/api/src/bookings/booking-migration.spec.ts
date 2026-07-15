import type { QueryRunner } from 'typeorm';
import { PersistBookingsAndAvailability1722000000000 } from '../migrations/1722000000000-PersistBookingsAndAvailability';

describe('PersistBookingsAndAvailability1722000000000', () => {
  it('is additive and creates the expected integrity controls', async () => {
    const statements: string[] = [];
    const queryRunner = {
      query: (statement: string) => {
        statements.push(statement.replace(/\s+/g, ' ').trim());
        return Promise.resolve();
      },
    } as QueryRunner;

    await new PersistBookingsAndAvailability1722000000000().up(queryRunner);
    const sql = statements.join(' ');

    expect(sql).toContain('CREATE TABLE "bookings"');
    expect(sql).toContain('CREATE TABLE "availability_blocks"');
    expect(sql).toContain('UQ_bookings_reference');
    expect(sql).toContain('CK_bookings_date_range');
    expect(sql).toContain('CK_bookings_currency');
    expect(sql).toContain('ON DELETE RESTRICT');
    expect(sql).toContain('ON DELETE SET NULL');
    expect(sql).toContain('ON DELETE CASCADE');
    expect(sql).not.toMatch(
      /DROP TABLE "apartment"|DROP TABLE "users"|DROP TABLE "auth_sessions"/,
    );
  });

  it('down removes only milestone-owned tables and enum', async () => {
    const statements: string[] = [];
    const queryRunner = {
      query: (statement: string) => {
        statements.push(statement);
        return Promise.resolve();
      },
    } as QueryRunner;

    await new PersistBookingsAndAvailability1722000000000().down(queryRunner);
    expect(statements).toEqual([
      'DROP TABLE "availability_blocks"',
      'DROP TABLE "bookings"',
      'DROP TYPE "bookings_status_enum"',
    ]);
  });
});
