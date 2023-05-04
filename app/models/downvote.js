import Model from '@ember-data/model';
import { attr, belongsTo } from '@ember-data/model';

export default class DownvoteModel extends Model {
  @belongsTo('user', { async: false }) user;
  @attr('string') targetId;
  @attr('string') targetType;
}
