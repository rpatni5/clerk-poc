export interface StripeCustomerResponseModel {
    customer: { id: string, [key: string]: any };
    subscription: { [key: string]: any };
}