import { attr, belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';

export default class FeatureSuggestionModel extends Model {
  @attr('string') featureSlug;
  @attr('date') createdAt;
  @attr('date') dismissedAt;
  @belongsTo('user', { async: false }) user;

  get featureIsPrivateLeaderboard() {
    console.log(this.featureSlug);
    return this.featureSlug === 'private-leaderboard';
  }

  get isDismissed() {
    return !!this.dismissedAt;
  }
}
