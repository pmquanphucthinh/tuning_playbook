import Component from '@glimmer/component';

interface Signature {
  Element: HTMLButtonElement;

  Args: {
    size: 'small' | 'regular';
    isDisabled: boolean;
  };

  Blocks: {
    default: [];
  };
}

export default class PrimaryButtonComponent extends Component<Signature> {
  get sizeIsSmall(): boolean {
    return this.args.size === 'small';
  }
}