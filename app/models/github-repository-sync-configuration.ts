import Model, { attr, belongsTo } from '@ember-data/model';

import type RepositoryModel from 'codecrafters-frontend/models/repository';

export default class GithubRepositorySyncConfiguration extends Model {
  @attr('string') declare githubRepositoryId: string;
  @attr('string') declare githubRepositoryName: string;
  @attr('string') declare lastSyncStatus: 'success' | 'failure';
  @attr('date') declare lastSyncedAt: Date | null;

  @belongsTo('repository', { async: false, inverse: 'githubRepositorySyncConfigurations' }) declare repository: RepositoryModel;

  get lastSyncFailed() {
    return this.lastSyncStatus === 'failure';
  }
}
