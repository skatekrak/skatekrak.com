import moment from 'moment';
import Stripe from 'stripe';
import User, { IUser, SubscriptionStatus } from '../models/user';

export async function fetchUserFromInvoice(invoice: Stripe.Invoice): Promise<IUser> {
    if (typeof invoice.customer === 'string') {
        return await User.byStripeCustomerID(invoice.customer);
    }
    return await User.byStripeCustomerID(invoice.customer.id);
}

export async function fetchUserFromCustomer(
    customer: string | Stripe.Customer | Stripe.DeletedCustomer,
): Promise<IUser> {
    if (typeof customer === 'string') {
        return await User.byStripeCustomerID(customer);
    }
    return await User.byStripeCustomerID(customer.id);
}

export async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
    const user = await fetchUserFromInvoice(invoice);
    user.subscriptionStatus = SubscriptionStatus.Active;

    const firstLine = invoice.lines.data[0];
    user.subscriptionEndAt = moment.unix(firstLine.period.end).toDate();
    await user.save();
}

export async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    const user = await fetchUserFromInvoice(invoice);

    user.subscriptionStatus = SubscriptionStatus.Expired;

    await user.save();
}
