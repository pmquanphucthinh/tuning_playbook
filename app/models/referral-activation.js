import Model, { attr, belongsTo } from '@ember-data/model';

export default class ReferralActivationModel extends Model {
  @belongsTo('user', { async: false, inverse: 'referralActivationsAsCustomer' }) customer;
  @belongsTo('user', { async: false, inverse: 'referralActivationsAsReferrer' }) referrer;
  @belongsTo('referral-link', { async: false }) referralLink;

  @attr('date') activatedAt;
  @attr('string') status; // 'pending_trial', 'trialing', 'first_charge_successful', 'trial_cancelled', 'inactive'
  @attr('number') spentAmountInCents;
  @attr('number') upcomingPaymentAmountInCents;
  @attr('number') withdrawableEarningsAmountInCents;
  @attr('number') withheldEarningsAmountInCents;

  get discountPeriodEndsAt() {
    return new Date(this.activatedAt.getTime() + 3 * 24 * 60 * 60 * 1000);
  }

  get hasStartedTrial() {
    return this.statusIsTrialing || this.statusIsFirstChargeSuccessful || this.statusIsTrialCancelled;
  }

  get isWithinDiscountPeriod() {
    return this.discountPeriodEndsAt > new Date();
  }

  get statusIsTrialCancelled() {
    return this.status === 'trial_cancelled';
  }

  get statusIsPendingTrial() {
    return this.status === 'pending_trial';
  }

  get statusIsTrialing() {
    return this.status === 'trialing';
  }

  get statusIsFirstChargeSuccessful() {
    return this.status === 'first_charge_successful';
  }

  get statusIsInactive() {
    return this.status === 'inactive';
  }

  get spentAmountInDollars() {
    return this.spentAmountInCents / 100;
  }

  get totalEarningsAmountInCents() {
    return this.withdrawableEarningsAmountInCents + this.withheldEarningsAmountInCents;
  }

  get totalEarningsAmountInDollars() {
    return this.totalEarningsAmountInCents / 100;
  }

  get upcomingPaymentAmountInDollars() {
    return this.upcomingPaymentAmountInCents / 100;
  }
}
