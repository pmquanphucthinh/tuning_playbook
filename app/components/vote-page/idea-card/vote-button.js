import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class VoteButtonComponent extends Component {
  @service('current-user') currentUserService;

  get renderedVotesCount() {
    return this.args.idea.votesCount;
  }
}
