import { clickable, create, visitable } from 'ember-cli-page-object';
import AccountDropdown from 'codecrafters-frontend/tests/pages/components/account-dropdown';
import CheckoutSessionSuccessfulModal from 'codecrafters-frontend/tests/pages/components/checkout-session-successful-modal';
import Header from 'codecrafters-frontend/tests/pages/components/header';

export default create({
  accountDropdown: AccountDropdown,
  clickOnStartPaymentButton: clickable('[data-test-start-payment-button]'),
  header: Header,
  visit: visitable('/pay'),
});
