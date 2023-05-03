import Model from '@ember-data/model';
import { attr, belongsTo } from '@ember-data/model';

export default class UpvoteModel extends Model {
  @belongsTo('user', { async: false }) user;
  @attr('string') targetId;
  @attr('string') targetType;
}
