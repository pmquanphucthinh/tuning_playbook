import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import fade from 'ember-animated/transitions/fade';

export default class BadgesController extends Controller {
  transition = fade;
  @tracked selectedBadge = null;

  @action
  handleBadgeCardClicked(badge) {
    this.selectedBadge = badge;
  }

  get otherBadgesCount() {
    return 21 - this.model.badges.length;
  }
}
