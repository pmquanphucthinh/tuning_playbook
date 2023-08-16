import CourseIdeaModel from 'codecrafters-frontend/models/course-idea';
import Model from '@ember-data/model';
import { attr, belongsTo } from '@ember-data/model';

export default class CourseIdeaVoteModel extends Model {
  @attr('date')
  declare createdAt: Date;

  @belongsTo('course-idea', { async: false, inverse: null })
  declare courseIdea: CourseIdeaModel;
  // @ts-ignore
  @belongsTo('user', { async: false }) user;
}
