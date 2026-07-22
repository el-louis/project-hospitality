import type { TlsOptions } from 'tls';

const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '::1']);

export type DatabaseSslOptions = false | TlsOptions;

export function getDatabaseSslOptions(
  value: string | undefined,
  host: string | undefined,
): DatabaseSslOptions {
  if (value === 'true') {
    return { rejectUnauthorized: true };
  }

  if (value === 'false' && host && LOOPBACK_HOSTS.has(host.toLowerCase())) {
    return false;
  }

  if (value === 'false') {
    throw new Error(
      'DB_SSL=false is permitted only for an explicitly local PostgreSQL host.',
    );
  }

  throw new Error('DB_SSL must be configured as either true or false.');
}
