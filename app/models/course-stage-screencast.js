import Model, { attr, belongsTo } from '@ember-data/model';

export default class CourseStageScreencastModel extends Model {
  @belongsTo('course-stage', { async: false, inverse: 'screencasts' }) courseStage;
  @belongsTo('language', { async: false, inverse: null }) language;
  @belongsTo('user', { async: false, inverse: null }) user;

  @attr('string') authorName;
  @attr('string') canonicalUrl;
  @attr('date') publishedAt;
  @attr('string') description;
  @attr('string') durationInSeconds;
  @attr('string') embedHtml;
  @attr('string') sourceIconUrl;
  @attr('string') originalUrl;
  @attr('string') thumbnailUrl;
  @attr('string') title;
}