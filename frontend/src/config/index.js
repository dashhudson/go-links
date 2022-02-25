import {fromJS, List} from 'immutable';

const CUSTOM_CONFIG = fromJS(window._trotto.layout);

const DEFAULT_CONFIG = {
  palette: {
    primary: '#d6b034',
    secondary: '#4990e2',
    success: '#4f8a10',
    error: '#e36042'
  },
  page: {
    title: 'DH Links',
    favicon: 'https://app.dashhudson.com/favicon.png'
  },
  header: {
    title: '',
    logo: {
      url: 'https://app.dashhudson.com/img/logo-dh-color.471d2fb6.svg',
      css: {
        height: '1.6em'
      }
    },
    links: [
      'directory',
      'howItWorks'
    ]
  },
  footer: {
    showSourceLink: false,
    links: []
  }
};

const DEFAULT_NAV_ITEMS = {
  directory: {
    text: 'Directory',
    url: '#/directory'
  },
  howItWorks: {
    text: 'How It Works',
    url: 'https://www.trot.to/how-it-works',
    openInNewTab: true
  }
};

let config = fromJS(DEFAULT_CONFIG).mergeDeep(CUSTOM_CONFIG);

if (CUSTOM_CONFIG.getIn(['header', 'links'])) {
  // `mergeDeep` merges lists instead of replacing them
  config = config.setIn(['header', 'links'], CUSTOM_CONFIG.getIn(['header', 'links']));
}

config = config.updateIn(['header', 'links'], (links) => links.reduce((fullLinks, link) => {
  if (typeof link === 'string') {
    if (!DEFAULT_NAV_ITEMS[link]) {
      console.error('Skipping invalid link ID: ', link);

      return fullLinks;
    }
    return fullLinks.push(fromJS(Object.assign({id: link}, DEFAULT_NAV_ITEMS[link])));
  }

  return fullLinks.push(link);
}, List()));

export const getConfig = (keyPath) => config.getIn(keyPath.split('.'))

// Backend yaml not working hard-code for now
export const DEFAULT_NAMESPACE = 'dh';

const setTitleAndFavicon = () => {
  const favicon = document.createElement('link');
  favicon.rel = 'shortcut icon';
  favicon.href = getConfig('page.favicon');
  document.getElementsByTagName('head')[0].appendChild(favicon);

  document.title = getConfig('page.title');
};

setTitleAndFavicon();
