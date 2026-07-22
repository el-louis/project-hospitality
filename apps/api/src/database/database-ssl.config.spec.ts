import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getDatabaseSslOptions } from './database-ssl.config';

describe('database SSL configuration', () => {
  it('enables TLS with certificate and hostname verification', () => {
    expect(getDatabaseSslOptions('true', 'example.neon.tech')).toEqual({
      rejectUnauthorized: true,
    });
  });

  it('allows disabled TLS only for an explicitly local database', () => {
    expect(getDatabaseSslOptions('false', 'localhost')).toBe(false);
    expect(getDatabaseSslOptions('false', '127.0.0.1')).toBe(false);
    expect(getDatabaseSslOptions('false', '::1')).toBe(false);
  });

  it.each([undefined, '', 'TRUE', 'yes', '1'])(
    'rejects malformed DB_SSL value %p',
    (value) => {
      expect(() => getDatabaseSslOptions(value, 'example.neon.tech')).toThrow(
        'DB_SSL must be configured as either true or false.',
      );
    },
  );

  it('refuses to disable TLS for a remote database', () => {
    expect(() => getDatabaseSslOptions('false', 'example.neon.tech')).toThrow(
      'DB_SSL=false is permitted only for an explicitly local PostgreSQL host.',
    );
  });

  it('keeps CLI and runtime paths on the shared secure helper', () => {
    const cli = readFileSync(join(__dirname, 'data-source.ts'), 'utf8');
    const runtime = readFileSync(
      join(__dirname, '..', 'app.module.ts'),
      'utf8',
    );

    for (const source of [cli, runtime]) {
      expect(source).toContain('getDatabaseSslOptions(');
      expect(source).not.toContain('rejectUnauthorized: false');
      expect(source).not.toContain("process.env.DB_SSL === 'true'");
    }
  });

  it('does not log connection configuration', () => {
    const source = readFileSync(
      join(__dirname, 'database-ssl.config.ts'),
      'utf8',
    );

    expect(source).not.toMatch(/console\.|Logger/);
  });
});
