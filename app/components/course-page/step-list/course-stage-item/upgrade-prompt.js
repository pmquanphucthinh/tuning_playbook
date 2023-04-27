import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class UpgradePromptComponent extends Component {
  @service('router') router;
  @service('current-user') currentUserService;
  @tracked isSaving = false;

  @action
  handleSubscribeLinkClicked() {
    this.router.transitionTo('pay');
  }
}
