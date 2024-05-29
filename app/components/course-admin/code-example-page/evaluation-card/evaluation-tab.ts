import Component from '@glimmer/component';
import type CommunitySolutionEvaluationModel from 'codecrafters-frontend/models/community-solution-evaluation';

export type Signature = {
  Element: HTMLDivElement;

  Args: {
    evaluation: CommunitySolutionEvaluationModel;
  };
};

export default class EvaluationTabComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::CodeExamplePage::EvaluationCard::EvaluationTab': typeof EvaluationTabComponent;
  }
}
