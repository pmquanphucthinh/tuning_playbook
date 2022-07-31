import Model from '@ember-data/model';
import { attr } from '@ember-data/model';

export default class IndividualCheckoutSessionModel extends Model {
  @attr('boolean') autoRenewSubscription;
  @attr('boolean') earlyBirdDiscountEnabled;
  @attr('string') promotionCode;
  @attr('string') successUrl;
  @attr('string') cancelUrl;
  @attr('string') url;
  @attr('string') pricingFrequency;
}
