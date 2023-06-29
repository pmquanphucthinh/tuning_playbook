import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';
import congratulationsImage from '/assets/images/icons/congratulations.png';
import { action } from '@ember/object';

export default class CoursePageStepListStageItemComponent extends Component {
  congratulationsImage = congratulationsImage;
  @service store;
  @service visibility;
  transition = fade;

  get username() {
    return this.args.repository.user.username;
  }

  @action
  togglePublishToGithubModal() {
    this.args.onPublishToGithubClick();
    window.scrollTo({ top: 0 });
  }
}
