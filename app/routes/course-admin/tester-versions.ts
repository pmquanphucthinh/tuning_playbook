import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/lib/base-route';
import Store from '@ember-data/store';

export default class CourseTesterVersionsRoute extends BaseRoute {
  @service declare store: Store;

  async model() {
    // @ts-ignore
    let course = this.modelFor('course-admin').course;

    await this.store.query('course-tester-version', {
      course_id: course.id,
      include: ['course', 'activator'].join(','),
    });

    return {
      course: course,
    };
  }
}