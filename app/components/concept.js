import Component from '@glimmer/component';
import { TrackedSet } from 'tracked-built-ins';
import { action } from '@ember/object';
import { cached } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ConceptComponent extends Component {
  @service store;

  @tracked lastRevealedBlockGroupIndex = null;
  @tracked interactedBlockIndexes = new TrackedSet([]);
  @tracked hasFinished = false;

  @cached
  get allBlocks() {
    return this.args.concept.parsedBlocks.map((block, index) => {
      return {
        ...block,
        type: block.type,
        index: index,
      };
    });
  }

  @cached
  get allBlockGroups() {
    return this.allBlocks.reduce((groups, block) => {
      if (groups.length === 0) {
        groups.push({ index: 0, blocks: [] });
      }

      groups[groups.length - 1].blocks.push(block);

      if (block.isInteractable || groups.length === 0) {
        groups.push({ index: groups.length, blocks: [] });
      }

      return groups;
    }, []);
  }

  get completedBlocksCount() {
    return this.allBlockGroups.reduce((count, blockGroup) => {
      if (blockGroup.index < this.currentBlockGroupIndex) {
        count += blockGroup.blocks.length;
      }

      return count;
    }, 0);
  }

  get currentBlockGroupIndex() {
    return this.lastRevealedBlockGroupIndex || 0;
  }

  @action
  handleBlockGroupContainerInserted(blockGroup, containerElement) {
    if (blockGroup.index === this.lastRevealedBlockGroupIndex) {
      containerElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  @action
  handleDidInsertContainer() {
    this.store
      .createRecord('analytics-event', {
        name: 'viewed_concept',
        properties: { concept_id: this.args.concept.id },
      })
      .save();
  }

  @action
  handleContinueButtonClick(block) {
    this.allBlockGroups[this.currentBlockGroupIndex].blocks.forEach((block) => {
      this.interactedBlockIndexes.add(block.index);
    });

    if (this.currentBlockGroupIndex === this.allBlockGroups.length - 1) {
      this.hasFinished = true;
    } else {
      this.updateLastRevealedBlockGroupIndex(this.currentBlockGroupIndex + 1);
    }

    this.interactedBlockIndexes.add(block.index);

    this.store
      .createRecord('analytics-event', {
        name: 'progressed_through_concept',
        properties: { concept_id: this.args.concept.id, progress_percentage: this.progressPercentage },
      })
      .save();
  }

  @action
  handleQuestionBlockSubmitted(block) {
    this.interactedBlockIndexes.add(block.index);
  }

  @action
  handleContinueBlockInsertedAfterQuestion(element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  @action
  handleStepBackButtonClick() {
    if (this.currentBlockGroupIndex === 0) {
      return;
    } else {
      this.allBlockGroups[this.currentBlockGroupIndex].blocks.forEach((block) => {
        this.interactedBlockIndexes.delete(block.index);
      });

      this.updateLastRevealedBlockGroupIndex(this.currentBlockGroupIndex - 1);
    }

    // TODO: Add analytics event?
  }

  get progressPercentage() {
    if (!this.lastRevealedBlockGroupIndex) {
      return 0; // The user hasn't interacted with any blocks yet
    }

    if (this.hasFinished) {
      return 100;
    } else {
      return Math.round(100 * (this.completedBlocksCount / this.allBlocks.length));
    }
  }

  get visibleBlockGroups() {
    return this.allBlockGroups.slice(0, (this.lastRevealedBlockGroupIndex || 0) + 1);
  }

  updateLastRevealedBlockGroupIndex(newBlockGroupIndex) {
    this.lastRevealedBlockGroupIndex = newBlockGroupIndex;
    this.args.onProgressPercentageChange(this.progressPercentage);
  }
}
