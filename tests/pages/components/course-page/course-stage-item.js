import { attribute, clickable, clickOnText, isPresent, text } from 'ember-cli-page-object';

// Legacy, to be removed
export default {
  clickOnActionButton: clickOnText('[data-test-action-button]'),

  earnedBadgeNotice: {
    badgeEarnedModal: {
      badgeName: text('[data-test-badge-name]'),
      scope: '[data-test-badge-earned-modal]',
    },

    clickOnViewButton: clickable('[data-test-view-button]'),
    scope: '[data-test-earned-badge-notice]',
  },

  feedbackPrompt: {
    clickOnOption: clickOnText('[data-test-feedback-prompt-option]'),
    clickOnSubmitButton: clickable('button'),
    explanationTextareaPlaceholder: attribute('placeholder', 'textarea'),
    questionText: text('[data-test-question-text]'),
    scope: '[data-test-feedback-prompt]',
  },

  hasFeedbackPrompt: isPresent('[data-test-feedback-prompt]'),

  upgradePrompt: {
    clickOnSubscribeButton: clickable('[data-test-subscribe-button]'),
    scope: '[data-test-upgrade-prompt]',
  },
};
