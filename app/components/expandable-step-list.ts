import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export interface Step {
  id: string;
  title: string;
  isComplete: boolean;
}

interface Signature {
  Element: HTMLDivElement;

  Args: {
    steps: Step[];
    stepContainerClass?: string;
  };

  Blocks: {
    default: [
      {
        expandedStep: Step | null;
        expandNextStep: () => void;
      },
    ];
  };
}

export default class ExpandableStepListComponent extends Component<Signature> {
  @tracked containerElement: HTMLDivElement | null = null;
  @tracked expandedStepId: string | null = null;

  get expandedStep(): Step | null {
    return this.args.steps.find((step) => step.id === this.expandedStepId) ?? null;
  }

  get firstIncompleteStep(): Step | null {
    return this.args.steps.find((step) => !step.isComplete) ?? null;
  }

  @action
  expandNextStep() {
    if (!this.expandedStep) {
      return;
    }

    const stepIndex = this.args.steps.indexOf(this.expandedStep);
    const nextStep = this.args.steps[stepIndex + 1];

    this.expandedStepId = nextStep ? nextStep.id : null;

    if (nextStep && this.containerElement) {
      this.containerElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  @action
  handleDidInsertContainer(element: HTMLDivElement) {
    this.containerElement = element;
  }

  @action
  handleStepCollapse(_step: Step) {
    this.expandedStepId = null;
  }

  @action
  handleStepExpand(step: Step) {
    this.expandedStepId = step.id;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    ExpandableStepList: typeof ExpandableStepListComponent;
  }
}
