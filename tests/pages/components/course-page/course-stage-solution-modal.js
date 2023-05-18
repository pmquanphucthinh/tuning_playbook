import { clickable, clickOnText, collection, fillable, hasClass, text } from 'ember-cli-page-object';
import CommunitySolutionsTab from 'codecrafters-frontend/tests/pages/components/course-page/course-stage-solution-modal/community-solutions-tab';
import CommentCard from '../comment-card';

export default {
  get isOpen() {
    return this.isVisible;
  },

  activeHeaderTabLinkText: text('[data-test-header-tab-link].border-teal-500'),
  clickOnCloseButton: clickable('[data-test-close-modal-button]'),
  clickOnHeaderTabLink: clickOnText('[data-test-header-tab-link]'),
  clickOnNextStageButton: clickable('[data-test-next-stage-button]'),
  clickOnPreviousStageButton: clickable('[data-test-previous-stage-button]'),

  commentsTab: {
    clickOnTabHeader: clickOnText('[data-test-tab-header]'),
    clickOnSubmitButton: clickable('[data-test-submit-button]'),
    submitButtonIsDisabled: hasClass('opacity-50', '[data-test-submit-button]'),
    commentCards: collection('[data-test-comment-card]', CommentCard),
    fillInCommentInput: fillable('[data-test-comment-input]'),
    scope: '[data-test-comments-tab]',
  },

  communitySolutionsTab: CommunitySolutionsTab,

  languageDropdown: {
    currentLanguageName: text('[data-test-language-dropdown-trigger] [data-test-current-language-name]', { resetScope: true }),
    toggle: clickable('[data-test-language-dropdown-trigger]', { resetScope: true }),
    clickOnLink: clickOnText('div[role="button"]'),

    hasLink(text) {
      return this.links.toArray().some((link) => link.text.includes(text));
    },

    links: collection('div[role="button"]', {
      text: text(),
    }),

    resetScope: true,
    scope: '[data-test-language-dropdown-content]',
  },

  revealSolutionOverlay: {
    actionButtons: collection('[data-test-action-button]'),

    get availableActionButtons() {
      return this.actionButtons.map((button) => button.text);
    },

    clickOnActionButton: clickOnText('[data-test-action-button]'),
    headingText: text('[data-test-heading-text]'),
    instructionsText: text('[data-test-instructions-text]'),
    scope: '[data-test-reveal-solution-overlay]',
  },

  title: text('[data-test-course-stage-solution-modal-title]'),
  scope: '[data-test-course-stage-solution-modal]',
};