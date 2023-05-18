import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class CreatePayoutModalComponent extends Component {
  @service('current-user') currentUserService;
  @tracked selectedPayoutMethod = null;
  @tracked payoutWasCreated = false;

  get currentUser() {
    return this.currentUserService.record;
  }

  @action
  handlePayoutCreated() {
    this.payoutWasCreated = true;
  }

  @action
  handlePayoutMethodClick(payoutMethod) {
    if (this.selectedPayoutMethod === payoutMethod) {
      this.selectedPayoutMethod = null;
    } else {
      this.selectedPayoutMethod = payoutMethod;
    }
  }
}