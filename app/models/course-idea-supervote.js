import Model from '@ember-data/model';
import { attr, belongsTo } from '@ember-data/model';

export default class CourseIdeaSupervoteModel extends Model {
  @attr('date') createdAt;

  @belongsTo('course-idea', { async: false, inverse: null }) courseIdea;
  @belongsTo('user', { async: false, inverse: 'courseIdeaSupervotes' }) user;
}
