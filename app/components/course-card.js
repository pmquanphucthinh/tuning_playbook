import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CourseCardComponent extends Component {
  @service authenticator;
  @service router;

  get linkToRoute() {
    if (this.isSkeleton) {
      return {
        name: 'catalog',
        model: null,
        query: {},
      };
    }

    if (this.lastPushedRepository) {
      return {
        name: 'course',
        model: this.args.course.slug,
        query: { fresh: null },
      };
    }

    return {
      name: 'course-overview',
      model: this.args.course.slug,
      query: {},
    };
  }

  get isSkeleton() {
    return !this.args.course;
  }

  get lastPushedRepository() {
    if (this.isSkeleton) {
      return null;
    }

    if (this.authenticator.currentUserIsLoaded) {
      return this.authenticator.currentUser.repositories
        .filterBy('course', this.args.course)
        .filterBy('firstSubmissionCreated')
        .sortBy('lastSubmissionAt').lastObject;
    } else {
      return null;
    }
  }
}
