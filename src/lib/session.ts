import { FastifyReply, FastifyRequest } from 'fastify'
import { Session } from '../entities/session'
import { User } from '../entities/user'
import { AppDataSource } from './typeorm'
import { COOKIE_SECRET, COOKIE_NAME, COOKIE_HTTP_ONLY, COOKIE_SIGNED } from './dotenv'
import { sign } from '@fastify/cookie'

declare module 'fastify' {
  interface FastifyRequest {
    session?: Session | null
    user?: User | null
  }
}

export async function saveSession(reply: FastifyReply, user: User) {
    const session = new Session();
    session.user = user;
    await AppDataSource.getRepository(Session).save(session);
    const test = sign(session.token, COOKIE_SECRET);
    const string = test.split('=')
    console.log("string ", string[1]);

    console.log("signed : ", test);
    console.log("not signed : ", session.token);
    void reply.setCookie(COOKIE_NAME, session.token, {
        signed: COOKIE_SIGNED,
        httpOnly: COOKIE_HTTP_ONLY,
        path: '/'
      })
      
    reply.send({})
}

export async function loadSession(request: FastifyRequest) {
    const cookie = request.cookies.cookieName;
    const unsigned = cookie ? request.unsignCookie(cookie) : null

    console.log("request.cookies : ", request.cookies);
    console.log("cookie : ", cookie);
    console.log("unsigned : ", unsigned);
    if (cookie != undefined)
        console.log("request.unsignCookie(cookie) : ", request.unsignCookie(cookie));
      //const string = Object.values(request.cookies).toString();


    const allsessions = await AppDataSource.getRepository(Session).find();
    console.log("allsessions : ", allsessions);

    if(unsigned && unsigned.value && unsigned.valid) {
        request.session = await AppDataSource.getRepository(Session).findOneBy({token: unsigned.value });
        request.user = await AppDataSource.getRepository(User).findOneBy({ id: request.session?.user.id});

    }
  // TODO: read the cookie from request.cookies[COOKIE_NAME].
  // TODO: unsign the cookie (or reject if invalid) and retreive the token.
  // TODO: load the sesion + user and assign it to request.session` and `request.user`.
}