import Component from '@glimmer/component';
import { A } from '@ember/array';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';
import RepositoryPoller from 'codecrafters-frontend/lib/repository-poller';
import fade from 'ember-animated/transitions/fade';

class SetupItem {
  type = 'SetupItem';
}

class CourseStageItem {
  @tracked courseStage;

  type = 'CourseStageItem';

  constructor(courseStage) {
    this.courseStage = courseStage;
  }
}

export default class CoursePageContentStepListComponent extends Component {
  @tracked activeItemIndex;
  @tracked activeItemWillBeReplaced;
  @tracked polledRepository;
  @service store;
  transition = fade;
  @service visibility;

  constructor() {
    super(...arguments);

    this.items = A(this.buildItems());

    this.activeItemIndex = this.computeActiveIndex();
  }

  buildItems() {
    let items = [];

    items.push(new SetupItem());

    this.args.course.sortedStages.forEach((courseStage) => {
      items.push(new CourseStageItem(courseStage));
    });

    return items;
  }

  computeActiveIndex() {
    if (!this.repository.firstSubmissionCreated) {
      return 0;
    } else if (this.repository.highestCompletedStage && this.repository.highestCompletedStage.get('id')) {
      return this.repository.highestCompletedStage.get('position') + 1;
    } else {
      return 1;
    }
  }

  @action
  async handleDidInsert() {
    this.startRepositoryPoller();
  }

  @action
  async handleDidInsertPolledRepositoryMismatchLoader() {
    this.activeItemIndex = this.computeActiveIndex();
    this.startRepositoryPoller();
  }

  @action
  async handlePoll() {
    let newActiveItemIndex = this.computeActiveIndex();

    if (newActiveItemIndex === this.activeItemIndex) {
      return;
    }

    this.activeItemWillBeReplaced = true;

    later(
      this,
      () => {
        this.activeItemWillBeReplaced = false;
        this.activeItemIndex = newActiveItemIndex;
      },
      2000
    );
  }

  @action
  async handleWillDestroy() {
    this.stopRepositoryPoller();
  }

  get polledRepositoryNeedsToBeUpdated() {
    return this.polledRepository && this.polledRepository !== this.repository;
  }

  get repository() {
    return this.args.repository;
  }

  startRepositoryPoller() {
    this.stopRepositoryPoller();

    if (this.repository) {
      this.repositoryPoller = new RepositoryPoller({ store: this.store, visibilityService: this.visibility });
      this.repositoryPoller.start(this.repository, this.handlePoll);
      this.polledRepository = this.repository;
    }
  }

  stopRepositoryPoller() {
    if (this.repositoryPoller) {
      this.repositoryPoller.stop();
    }

    this.polledRepository = null;
  }
}
