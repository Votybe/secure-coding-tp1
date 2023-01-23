// src/specs/fixtures/sessions-fixtures.ts
import { Session } from '../../entities/session.js'
import { buildUserFixture } from './user-fixtures.spec'
import { User } from '../../entities/users'
import { AppDataSource } from '../../lib/typeorm.js'

type SessionFixtureOptions = { user?: User }

export function buildSessionFixture(opts: SessionFixtureOptions = {}) {
  const session = new Session()
  session.user = opts.user ?? buildUserFixture()
  return session
}

export async function createSessionFixture(opts: SessionFixtureOptions = {}) {
  return AppDataSource.getRepository(Session).save(buildSessionFixture(opts))
}