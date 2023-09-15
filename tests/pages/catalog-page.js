import { collection, create, visitable } from 'ember-cli-page-object';
import { waitUntil } from '@ember/test-helpers';
import AccountDropdown from 'codecrafters-frontend/tests/pages/components/account-dropdown';
import CourseCard from 'codecrafters-frontend/tests/pages/components/course-card';
import TrackCard from 'codecrafters-frontend/tests/pages/components/tracks-page/track-card';
import Header from 'codecrafters-frontend/tests/pages/components/header';

export default create({
  accountDropdown: AccountDropdown,

  async clickOnCourse(courseName) {
    await waitUntil(() => this.courseCards.length > 0); // Ensure skeleton UI is gone
    await this.courseCards.toArray().findBy('name', courseName).click();
  },

  async clickOnTrack(trackName) {
    await waitUntil(() => this.trackCards.length > 0); // Ensure skeleton UI is gone
    await this.trackCards.toArray().findBy('name', trackName).click();
  },

  courseCards: collection('[data-test-course-card]', CourseCard),
  trackCards: collection('[data-test-track-card]', TrackCard),
  header: Header,
  visit: visitable('/catalog'),
});
