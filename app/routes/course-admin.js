import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/lib/base-route';

export default class CourseAdminRoute extends BaseRoute {
  @service authenticator;
  @service router;
  @service store;

  async beforeModel() {
    await this.authenticator.authenticate();
    let { course_slug } = this.paramsFor('course-admin');

    if (!this.authenticator.currentUser.isCourseAuthor({ slug: course_slug })) {
      this.router.transitionTo('catalog');
    }
  }

  async model(params) {
    let courses = await this.store.findAll('course', {
      include: 'stages,language-configurations.language',
    });

    return {
      course: courses.find((course) => course.slug === params.course_slug),
    };
  }
}
