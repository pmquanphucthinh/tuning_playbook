import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';

export default class CourseStageSolutionRoute extends ApplicationRoute {
  @service store;

  async model(params) {
    const courses = await this.store.findAll('course', { include: 'stages.solutions.language,supported-languages' });
    const course = courses.findBy('slug', params.course_slug);
    const stage = course.stages.findBy('slug', params.stage_slug);

    return stage.solutions.findBy('language.slug', params.requestedLanguageSlug);
  }
}
