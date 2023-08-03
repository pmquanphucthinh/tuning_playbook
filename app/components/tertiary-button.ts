import Component from '@glimmer/component';

interface Signature {
  Element: HTMLButtonElement;

  Args: {
    size?: 'small' | 'regular';
    isDisabled?: boolean;
    isDark?: boolean;
  };

  Blocks: {
    default: [];
  };
}

export default class TertiaryButtonComponent extends Component<Signature> {
  get sizeIsSmall(): boolean {
    return this.args.size === 'small';
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    TertiaryButton: typeof TertiaryButtonComponent;
  }
}
