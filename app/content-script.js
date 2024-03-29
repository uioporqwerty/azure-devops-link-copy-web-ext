// @flow

function getContrast(color) {
  var rgb = color
    .substring(4, color.length - 1)
    .replace(/ /g, '')
    .split(',');
  var yiq =
    (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) /
    1000;
  return yiq >= 128 ? 'black' : 'white';
}

function getLinkImage() {
  const contrast = getContrast(
    window.getComputedStyle(document.body).backgroundColor
  );
  if (contrast === 'black') {
    return browser.runtime.getURL('images/link-dark.svg');
  } else {
    return browser.runtime.getURL('images/link-light.svg');
  }
}

function getLink() {
  const linkElement = document.querySelector(
    '.workitem-info-bar > .info-text-wrapper > .caption'
  );
  return `https://dev.azure.com${linkElement.getAttribute('href')}`;
}

function createMessage() {
  let message = document.createElement('p');
  message.innerHTML = browser.i18n.getMessage('copiedMessage');
  message.style.display = 'none';
  message.style.marginLeft = '4px';
  return message;
}

function createWorkItemCopyLink(message) {
  let workItemCopyLink = document.createElement('img');
  workItemCopyLink.alt = browser.i18n.getMessage('linkAltMessage');
  workItemCopyLink.src = getLinkImage();
  workItemCopyLink.style.cursor = 'pointer';
  workItemCopyLink.onclick = () => {
    const link = getLink();
    navigator.clipboard
      .writeText(link)
      .then(() => {
        message.style.display = 'inline';
        setTimeout(function () {
          message.style.display = 'none';
        }, 3000);
        appInsights.trackEvent({ name: 'Copied work item' });
      })
      .catch((err) => {
        appInsights.trackException({ error: err });
      });
  };

  return workItemCopyLink;
}

function getCopyLinkNode() {
  let linkContainer = document.createElement('div');
  linkContainer.id = 'link-container';
  let message = createMessage();
  let workItemCopyLink = createWorkItemCopyLink(message);

  linkContainer.appendChild(workItemCopyLink);
  linkContainer.appendChild(message);
  return linkContainer;
}

function getTeamsShareNode() {
  let teamsShare = document.createElement('div');
  teamsShare.className = 'teams-share-button';
  teamsShare.setAttribute('data-href', getLink());
  teamsShare.setAttribute('data-icon-px-size', '18');
  return teamsShare;
}

const obs = new MutationObserver(async function (mutations, observer) {
  for (var i = 0; i < mutations.length; i++) {
    const mutationRecord = mutations[i];
    if (
      mutationRecord.target.className ===
        'workitem-info-bar workitem-header-bar' &&
      mutationRecord.addedNodes.length > 0
    ) {
      mutationRecord.target.children[0].appendChild(getCopyLinkNode());

      let showTeamsButton = (await browser.storage.sync.get('isTeamsEnabled'))
        .isTeamsEnabled;
      if (showTeamsButton == undefined) {
        showTeamsButton = true;
      }

      if (
        (showTeamsButton &&
          navigator.userAgentData.brands.some(
            (brand) => brand.brand === 'Google Chrome'
          )) ||
        navigator.userAgentData.brands.some(
          (brand) => brand.brand === 'Microsoft Edge'
        )
      ) {
        mutationRecord.target.children[0].appendChild(getTeamsShareNode());
        shareToMicrosoftTeams.renderButtons();
      }
    }
  }
});
obs.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: false,
  characterData: false
});
