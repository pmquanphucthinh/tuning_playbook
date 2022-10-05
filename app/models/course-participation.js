import { attr, belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';

export default class CourseParticipationModel extends Model {
  @belongsTo('course', { async: false }) course;
  @belongsTo('course-stage', { async: false }) currentStage;
  @belongsTo('user', { async: false }) user;
  @belongsTo('language', { async: false }) language;

  @attr('date') completedAt;
  @attr('date') lastActivityAt;
  @attr('date') startedAt;

  get isCompleted() {
    return !!this.completedAt;
  }
}