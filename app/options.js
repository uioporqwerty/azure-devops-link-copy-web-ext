// @flow

async function saveOptions(e) {
  e?.preventDefault();
  var enableTeamsCheckbox = document.querySelector('#disable_teams_checkbox');

  /*::
        if (!(enableTeamsCheckbox instanceof HTMLInputElement)) {
        throw new Error('element is not of type HTMLInputElement');
        }
    */

  await browser.storage.sync.set({
    isTeamsEnabled: enableTeamsCheckbox.checked
  });
}

async function restoreOptions() {
  setContentStrings();
  let isTeamsEnabled = (await browser.storage.sync.get('isTeamsEnabled'))
    .isTeamsEnabled;
  if (isTeamsEnabled == undefined) {
    isTeamsEnabled = true;
  }

  var enableTeamsCheckbox = document.querySelector('#disable_teams_checkbox');

  /*::
        if (!(enableTeamsCheckbox instanceof HTMLInputElement)) {
        throw new Error('element is not of type HTMLInputElement');
        }
    */
  enableTeamsCheckbox.checked = isTeamsEnabled;
}

function setContentStrings() {
  console.log('setting content strings');
  var enableTeamsLabel = document.querySelector('#disable_teams_label');
  var saveButton = document.querySelector('#save_button');
  if (!enableTeamsLabel || !saveButton) {
    throw new Error('element not found');
  }

  enableTeamsLabel.textContent = browser.i18n.getMessage(
    'options_isTeamsEnabledLabel'
  );
  saveButton.textContent = browser.i18n.getMessage('options_saveButton');
}

document.addEventListener(
  'DOMContentLoaded',
  async () => await restoreOptions()
);
document
  .querySelector('form')
  ?.addEventListener('submit', async () => await saveOptions());
