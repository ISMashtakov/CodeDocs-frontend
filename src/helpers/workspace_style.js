const WORKSPACE_STYLE_IN_LOCALSTORAGE = 'workspaceStyle';

class Dracula {
  constructor() {
    this.className = '.ace-dracula';
    this.color = '#f8f8f2';
    this.keywordColor = '#ff79c6';
    this.gutterColor = '#909194';
    this.gutterBackground = '#282a36';
    this.gutterActiveBackground = '#44475a';
  }
}

class Github {
  constructor() {
    this.className = '.ace-github';
    this.color = '#000000';
    this.keywordColor = '#000000';
    this.gutterColor = '#AAAAAA';
    this.gutterBackground = '#e8e8e8';
    this.gutterActiveBackground = '#111111';
  }
}

class KRTheme {
  constructor() {
    this.className = '.ace-kr-theme';
    this.color = '#FCFFE0';
    this.keywordColor = '#949C8B';
    this.gutterColor = '#FCFFE0';
    this.gutterBackground = '#1c1917';
    this.gutterActiveBackground = '#38403D';
  }
}

class Monokai {
  constructor() {
    this.className = '.ace-monokai';
    this.color = '#F8F8F2';
    this.keywordColor = '#F92672';
    this.gutterColor = '#8F908A';
    this.gutterBackground = '#2F3129';
    this.gutterActiveBackground = '#272727';
  }
}

class SolarizedDark {
  constructor() {
    this.className = '.ace-solarized-dark';
    this.color = '#93A1A1';
    this.keywordColor = '#859900';
    this.gutterColor = '#d0edf7';
    this.gutterBackground = '#01313f';
    this.gutterActiveBackground = '#0d3440';
  }
}

class TommorowNightBright {
  constructor() {
    this.className = '.ace-tomorrow-night-bright';
    this.color = '#DEDEDE';
    this.keywordColor = '#C397D8';
    this.gutterColor = '#DEDEDE';
    this.gutterBackground = '#1a1a1a';
    this.gutterActiveBackground = '#2A2A2A';
  }
}

class Kuroir {
  constructor() {
    this.className = '.ace-tomorrow-night-bright';
    this.color = '#363636';
    this.keywordColor = '#363636';
    this.gutterColor = '#333333';
    this.gutterBackground = '#e8e8e8';
    this.gutterActiveBackground = '#e2e5bf';
  }
}

export const styleNameMap = {
  dracula: new Dracula(),
  github: new Github(),
  kr_theme: new KRTheme(),
  monokai: new Monokai(),
  solarized_dark: new SolarizedDark(),
  tomorrow_night_bright: new TommorowNightBright(),
  kuroir: new Kuroir(),
};

export default class WorkspaceStyle {
  constructor(theme, color, keywordColor, gutterColor, gutterBackground, gutterActiveBackground) {
    this.theme = theme;
    const obj = styleNameMap[this.theme];
    this.color = color || obj.color;
    this.keywordColor = keywordColor || obj.keywordColor;
    this.gutterColor = gutterColor || obj.gutterColor;
    this.gutterBackground = gutterBackground || obj.gutterBackground;
    this.gutterActiveBackground = gutterActiveBackground || obj.gutterActiveBackground;
  }

  save() {
    localStorage.setItem(WORKSPACE_STYLE_IN_LOCALSTORAGE, JSON.stringify({
      theme: this.theme,
      color: this.color,
      keywordColor: this.keywordColor,
      gutterColor: this.gutterColor,
      gutterBackground: this.gutterBackground,
      gutterActiveBackground: this.gutterActiveBackground,
    }));
  }

  static load() {
    let style = localStorage.getItem(WORKSPACE_STYLE_IN_LOCALSTORAGE);
    if (!style) return WorkspaceStyle.default;

    style = JSON.parse(style);
    if (!('theme' in style)) return WorkspaceStyle.default;

    return new WorkspaceStyle(
      style.theme,
      style.color,
      style.keywordColor,
      style.gutterColor,
      style.gutterBackground,
      style.gutterActiveBackground,
    );
  }

  static get default() {
    return new WorkspaceStyle('kuroir');
  }

  get style() {
    return `
        ${styleNameMap[this.theme].className} .ace_identifier {
            color: ${this.color};
        }
        ${styleNameMap[this.theme].className} .ace_keyword {
            color:  ${this.keywordColor};
        }
        ${styleNameMap[this.theme].className} .ace_gutter {
            background:  ${this.gutterBackground};
            color:  ${this.gutterColor};
        }
        ${styleNameMap[this.theme].className} .ace_gutter-active-line {
            background:  ${this.gutterActiveBackground};
        }
        `;
  }
}
