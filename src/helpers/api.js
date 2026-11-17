import { helpFetch } from './helpFetch';
import { API_URL, DEVS_URL } from '../config';

/** API del negocio: Express.js + PostgreSQL (Neon) */
export const api = helpFetch(API_URL);
/** API virtual de desarrolladores: json-server */
export const apiDevs = helpFetch(DEVS_URL);
