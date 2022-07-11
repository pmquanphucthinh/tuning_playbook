import { attr, belongsTo, hasMany } from '@ember-data/model';
import { equal } from '@ember/object/computed'; // eslint-disable-line ember/no-computed-properties-in-native-classes
import Model from '@ember-data/model';

export default class CourseStageModel extends Model {
  @belongsTo('course', { async: false }) course;
  @attr('string') difficulty;
  @attr('string') name;
  @attr('string') descriptionMarkdownTemplate;
  @attr('boolean') isFree;
  @attr('string') marketingMarkdown;
  @attr('number') position;
  @attr('string') slug;
  @belongsTo('code-walkthrough', { async: false }) sourceWalkthrough;
  @hasMany('course-stage-solution', { async: false }) solutions;

  @equal('difficulty', 'very_easy') difficultyIsVeryEasy;
  @equal('difficulty', 'easy') difficultyIsEasy;
  @equal('difficulty', 'hard') difficultyIsHard;
  @equal('difficulty', 'medium') difficultyIsMedium;

  hasSolutionForLanguage(language) {
    return !!this.courseStage.solutions.findBy('language', language);
  }

  get hasSourceWalkthrough() {
    return !!this.sourceWalkthrough;
  }

  get isFirst() {
    return this.position === 1;
  }

  get isLast() {
    return this === this.course.sortedStages.lastObject;
  }
}
