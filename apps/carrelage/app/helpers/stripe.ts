import { Stripe } from 'stripe';
import config from '../server/config';

const stripe = new Stripe(config.STRIPE_KEY, { apiVersion: '2020-08-27' });
export default stripe;
