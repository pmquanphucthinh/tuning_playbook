import Component from '@glimmer/component';
import RegionalDiscountModel from 'codecrafters-frontend/models/regional-discount';
import Store from '@ember-data/store';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    onClose: () => void;

    additionalCheckoutSessionProperties: {
      pricingFrequency: string;
      regionalDiscount?: RegionalDiscountModel;
      earlyBirdDiscountEnabled?: boolean;
      referralDiscountEnabled?: boolean;
    };
  };
}

export default class ConfigureCheckoutSessionModal extends Component<Signature> {
  @service declare store: Store;
  @tracked temp = false;
  @tracked isCreatingCheckoutSession = false;

  @action
  async handleProceedToCheckoutButtonClick() {
    this.isCreatingCheckoutSession = true;

    console.log(this.args.additionalCheckoutSessionProperties);
    const checkoutSession = this.store.createRecord('individual-checkout-session', {
      autoRenewSubscription: false, // None of our plans are subscriptions at the moment
      regionalDiscount: this.args.additionalCheckoutSessionProperties.regionalDiscount,
      earlyBirdDiscountEnabled: this.args.additionalCheckoutSessionProperties.earlyBirdDiscountEnabled,
      referralDiscountEnabled: this.args.additionalCheckoutSessionProperties.referralDiscountEnabled,
      successUrl: `${window.location.origin}/tracks`,
      cancelUrl: `${window.location.origin}/pay`,
      pricingFrequency: this.args.additionalCheckoutSessionProperties.pricingFrequency,
    });

    await checkoutSession.save();
    window.location.href = checkoutSession.url;
  }
}
