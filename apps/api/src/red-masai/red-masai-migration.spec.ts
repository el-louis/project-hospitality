import type { QueryRunner } from 'typeorm';
import { RedMasaiConceptContent1723000000000 } from '../migrations/1723000000000-RedMasaiConceptContent';

describe('RedMasaiConceptContent1723000000000', () => {
  it('adds deterministic content without altering established domain tables', async () => {
    const statements: string[] = [];
    const runner = {
      query: (sql: string) => {
        statements.push(sql.replace(/\s+/g, ' ').trim());
        return Promise.resolve();
      },
    } as QueryRunner;

    await new RedMasaiConceptContent1723000000000().up(runner);
    const sql = statements.join(' ');
    expect(sql).toContain('CREATE TABLE "red_masai_profile"');
    expect(sql).toContain('CREATE TABLE "offerings"');
    expect(sql).toContain('10000000-0000-4000-8000-000000000005');
    expect(sql).toContain('ON CONFLICT ("id") DO NOTHING');
    expect(sql).not.toMatch(
      /ALTER TABLE "apartment"|ALTER TABLE "bookings"|ALTER TABLE "availability_blocks"|DROP TABLE "apartment"|DROP TABLE "bookings"|DROP TABLE "availability_blocks"/,
    );
  });

  it('documents destructive rollback by dropping only milestone-owned content', async () => {
    const statements: string[] = [];
    const runner = {
      query: (sql: string) => {
        statements.push(sql);
        return Promise.resolve();
      },
    } as QueryRunner;
    await new RedMasaiConceptContent1723000000000().down(runner);
    expect(statements).toEqual([
      'DROP TABLE "offerings"',
      'DROP TABLE "red_masai_profile"',
      'DROP TYPE "content_confidence_enum"',
      'DROP TYPE "offerings_booking_method_enum"',
      'DROP TYPE "offerings_category_enum"',
    ]);
  });
});
