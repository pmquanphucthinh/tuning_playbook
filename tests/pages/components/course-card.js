import { isPresent, text } from 'ember-cli-page-object';

export default {
  name: text('[data-test-course-name]'),
  description: text('[data-test-course-description]'),
  hasBetaLabel: isPresent('[data-test-course-beta-label]'),
};
