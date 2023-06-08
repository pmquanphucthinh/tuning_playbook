import Component from '@glimmer/component';
import window from 'ember-window-mock';
import { action } from '@ember/object';

interface Signature {
  Args: {
    repository: {
      id: string;
    };
  };
}

export default class InstallGitHubAppStepComponent extends Component<Signature> {
  @action
  handleInstallGitHubAppButtonClick() {
    window.location.href = `/github_app_installations/start?repository_id=${this.args.repository.id}`;
  }
}