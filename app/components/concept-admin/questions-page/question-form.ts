import Component from '@glimmer/component';
import ConceptQuestionModel from 'codecrafters-frontend/models/concept-question';
import { action } from '@ember/object';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    question: ConceptQuestionModel;
  };
}

export default class QuestionFormComponent extends Component<Signature> {
  @action
  async handleCorrectOptionToggled(optionIndex: number) {
    const option = this.args.question.options[optionIndex]!;
    const optionWasCorrect = option.is_correct;

    this.args.question.options = this.args.question.options.map((option, currentOptionIndex) => {
      if (optionWasCorrect) {
        return { ...option, is_correct: false };
      } else {
        return { ...option, is_correct: currentOptionIndex === optionIndex ? true : false };
      }
    });
  }

  @action
  async handleOptionAdded() {
    this.args.question.options = [...this.args.question.options, { markdown: '', is_correct: false, explanation_markdown: '' }];
  }

  @action
  async handleOptionChanged() {
    this.args.question.set('options', [...this.args.question.options]); // Force dirty-tracking to run
  }

  @action
  async handleOptionDeleted(optionIndex: number) {
    this.args.question.options = this.args.question.options.filter((_, currentOptionIndex) => currentOptionIndex !== optionIndex);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptAdmin::QuestionsPage::QuestionForm': typeof QuestionFormComponent;
  }
}
