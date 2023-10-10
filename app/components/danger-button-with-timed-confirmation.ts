import Component from '@glimmer/component';
import config from 'codecrafters-frontend/config/environment';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLButtonElement;

  Args: {
    deferredFunction: () => void;
    onConfirm: () => void;
    size?: string;
  };

  Blocks: {
    default: [];
  };
}

export default class DangerButtonWithTimedConfirmation extends Component<Signature> {
  @tracked isHovered: boolean = false;
  @tracked progressWidth: number = 100;
  @tracked progressInterval: number = 1;

  get progressBarWidthStyle() {
    return htmlSafe(`width: ${this.progressWidth}%`);
  }

  @action
  handleMouseEnter() {
    this.isHovered = true;
  }

  @action
  handleMouseLeave() {
    this.hideProgressBar();
    this.stopProgress();
  }

  @action
  hideProgressBar() {
    this.isHovered = false;
  }

  @action
  startProgress() {
    let intervalDelay;
    config.environment === 'test' ? (intervalDelay = 5) : (intervalDelay = 50);
    this.progressWidth = 100;

    this.progressInterval = setInterval(() => {
      if (this.progressWidth > 0) {
        this.progressWidth -= 1;
      } else if (this.progressWidth === 0) {
        clearInterval(this.progressInterval);

        this.args.deferredFunction();
        this.args.onConfirm();
      } else {
        clearInterval(this.progressInterval);
      }
    }, intervalDelay);
  }

  @action
  stopProgress() {
    this.progressWidth = 100;
    clearInterval(this.progressInterval);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    DangerButtonWithTimedConfirmation: typeof DangerButtonWithTimedConfirmation;
  }
}
