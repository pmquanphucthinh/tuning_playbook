import Component from '@glimmer/component';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import Prism from 'prismjs';
import showdown from 'showdown';

import 'prismjs';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-nim';
// import 'prismjs/components/prism-php'; Doesn't work for some reason?
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-clojure';
import 'prismjs/components/prism-crystal';
import 'prismjs/components/prism-elixir';
import 'prismjs/components/prism-haskell';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-csharp';

class ProseSection {
  type = 'ProseSection';

  constructor(markdown) {
    this.markdown = markdown;
  }

  get HTML() {
    // showdown.extension('formatted-github-links', {
    //   type: 'output',
    //   filter: (text, converter, options) => {
    //     return text + 'a';
    //   },
    // });
    //
    return htmlSafe(new showdown.Converter({ openLinksInNewWindow: true, extensions: ['formatted-github-links'] }).makeHtml(this.markdown));
  }
}

class ReferencedCodeSection {
  type = 'ReferencedCodeSection';

  constructor(code, languageSlug, link, filePath, highlightedLines) {
    this.code = code;
    this.languageSlug = languageSlug;
    this.highlightedLines = highlightedLines;
    this.link = link;
    this.filePath = filePath;
  }
}

export default class CodeWalkthroughComponent extends Component {
  @action
  handleDidInsertProseSectionHTML(element) {
    Prism.highlightAllUnder(element);
  }

  @action
  handleDidUpdateProseSectionHTML(element) {
    Prism.highlightAllUnder(element);
  }

  get sections() {
    return this.args.model.sections.map((section) => {
      if (section.type === 'prose') {
        return new ProseSection(section.markdown);
      } else if (section.type === 'referenced_code') {
        return new ReferencedCodeSection(section.code, section.language_slug, section.link, section.file_path, section.highlighted_lines);
      }
    });
  }
}
