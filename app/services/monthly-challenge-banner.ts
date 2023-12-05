import Service from '@ember/service';
import petoiRobotDogImage from '/assets/images/monthly-challenges/petoirobotdog.png';

export default class MonthlyChallengeBannerService extends Service {
  get imageAltText() {
    return "Petoi Robot Dog";
  }

  get isOutdated(): boolean {
    return new Date("December 01, 2023") >= new Date();
  }

  get largeImage() {
    return petoiRobotDogImage;
  }

  get smallImage() {
    return petoiRobotDogImage;
  }

  get url() {
    return "https://codecrafters.io/november"
  }
}
