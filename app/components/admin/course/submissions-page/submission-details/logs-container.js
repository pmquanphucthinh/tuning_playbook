import Component from '@glimmer/component';
import { default as AnsiUp } from 'ansi_up';
import { htmlSafe } from '@ember/template';

export default class AdminCourseSubmissionsPageSubmissionDetailsLogsContainerComponent extends Component {
  get evaluation() {
    return this.args.submission.evaluations.firstObject;
  }

  get logLines() {
    return this.evaluation.parsedLogs.split('\n').map((line) => {
      return htmlSafe(new AnsiUp().ansi_to_html(line));
    });
  }
}
