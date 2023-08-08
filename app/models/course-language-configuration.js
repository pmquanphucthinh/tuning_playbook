import Model from '@ember-data/model';
import { attr, belongsTo } from '@ember-data/model';
import { equal } from '@ember/object/computed'; // eslint-disable-line ember/no-computed-properties-in-native-classes

export default class CourseLanguageConfigurationModel extends Model {
  @attr('') alphaTesterUsernames;
  @attr('string') releaseStatus;

  @belongsTo('course', { async: false }) course;
  @belongsTo('language', { async: false }) language;

  @equal('releaseStatus', 'alpha') releaseStatusIsAlpha;
  @equal('releaseStatus', 'beta') releaseStatusIsBeta;
  @equal('releaseStatus', 'live') releaseStatusIsLive;

  isAvailableForUser(user) {
    if (this.releaseStatusIsAlpha) {
      return user.isStaff || this.alphaTesterUsernames.includes(user.username);
    } else {
      return true;
    }
  }
}
