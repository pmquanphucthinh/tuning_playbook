import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default class CourseOverviewController extends Controller {
  @service currentUser;

  get activeRepository() {
    if (this.currentUser.isAuthenticated) {
      return this.currentUser.record.repositories.filterBy('course', this.model.course).filterBy('firstSubmissionCreated').sortBy('lastSubmissionAt')
        .lastObject;
    } else {
      return null;
    }
  }

  get userRepositories() {
    if (this.currentUser.isAuthenticated) {
      return this.currentUser.record.repositories.filterBy('course', this.model.course).filterBy('firstSubmissionCreated');
    } else {
      return [];
    }
  }
}