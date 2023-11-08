import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class AffiliateLinkStatsContainerComponent extends Component {
  @service authenticator;

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get paidUsersCount() {
    return this.args.affiliateLink.visibleActivations.filter((activation) => activation.spentAmountInDollars > 0).length;
  }

  get trialCount() {
    return this.args.affiliateLink.activations.filterBy('hasStartedTrial').length;
  }
}
