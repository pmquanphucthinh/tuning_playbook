import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import congratulationsImage from '/assets/images/icons/congratulations.png';
import RepositoryModel from 'codecrafters-frontend/models/repository';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
  };
};

export default class BaseStagesCompletedCardComponent extends Component<Signature> {
  congratulationsImage = congratulationsImage;

  @tracked configureExtensionsModalIsOpen = false;
}
