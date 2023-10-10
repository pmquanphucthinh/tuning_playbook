import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

type Signature = {
  Args: {
    tabs: {
      slug: string;
      title: string;
    }[];
  };

  Blocks: {
    default: [string];
  };
};

export default class TabsComponent extends Component<Signature> {
  @tracked activeTabSlug;

  constructor(owner: unknown, args: Signature['Args']) {
    // @ts-ignore
    super(owner, args);

    this.activeTabSlug = args.tabs[0]!.slug;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    Tabs: typeof TabsComponent;
  }
}
