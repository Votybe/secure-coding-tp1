import { config } from 'dotenv'
import * as path from 'path'

export const NODE_ENV = (process.env.NODE_ENV || 'development') as 'test' | 'development' | 'production'

// config() does not override loaded env variable, so load overrides first
if (NODE_ENV === 'test') config({ path: path.resolve(process.cwd(), '.env.test') })
config()

export const COOKIE_NAME = getOrThrow('COOKIE_NAME')
export const COOKIE_SECRET = getOrThrow('COOKIE_SECRET')
export const COOKIE_SIGNED = process.env.COOKIE_SIGNED === 'true'
export const COOKIE_HTTP_ONLY = process.env.COOKIE_HTTP_ONLY === 'true'

function getOrThrow(name: string) {
    const val = process.env[name]
    if (typeof val === 'undefined') throw new Error(`Missing mandatory environment variable ${name}`)
    return val
}