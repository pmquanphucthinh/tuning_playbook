import { belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';

export default class GithubAppInstallation extends Model {
  @belongsTo('user', { async: false }) user;
}
