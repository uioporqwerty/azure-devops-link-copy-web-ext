// @flow
function getContrast(color) {
  var rgb = color
    .substring(4, color.length - 1)
    .replace(/ /g, "")
    .split(",");
  var yiq =
    (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) /
    1000;
  return yiq >= 128 ? "black" : "white";
}

function getLinkImage() {
  const contrast = getContrast(
    window.getComputedStyle(document.body).backgroundColor
  );
  if (contrast === "black") {
    return browser.runtime.getURL("images/link-dark.svg");
  } else {
    return browser.runtime.getURL("images/link-light.svg");
  }
}

function getLink() {
  const linkElement = document.querySelector(
    ".workitem-info-bar > .info-text-wrapper > .caption"
  );
  return `https://dev.azure.com${linkElement.getAttribute("href")}`;
}

function createMessage() {
  let message = document.createElement("p");
  message.innerHTML = "Copied!";
  message.style.display = "none";
  message.style.marginLeft = "4px";
  return message;
}

function createWorkItemCopyLink(message) {
  let workItemCopyLink = document.createElement("img");
  workItemCopyLink.alt = "Copy link to work item";
  workItemCopyLink.src = getLinkImage();
  workItemCopyLink.style.cursor = "pointer";
  workItemCopyLink.onclick = () => {
    const link = getLink();
    navigator.clipboard
      .writeText(link)
      .then(() => {
        message.style.display = "inline";
        setTimeout(function () {
          message.style.display = "none";
        }, 3000);
        console.log(`Wrote ${link} to clipboard.`);
      })
      .catch((err) => {
        console.log(`Failed to write ${link} to clipboard.`);
        console.error(err);
      });
  };

  return workItemCopyLink;
}

const workItemInfoHeader = document.querySelector(
  ".workitem-info-bar > .info-text-wrapper"
);

let linkContainer = document.createElement("div");
linkContainer.id = "link-container";
linkContainer.classList.add("hide");
let message = createMessage();
let workItemCopyLink = createWorkItemCopyLink(message);
const workItemLink = workItemInfoHeader.querySelector(".caption");
workItemLink.addEventListener("mouseover", () => {
  linkContainer.classList.remove("hide");
});
workItemLink.addEventListener("mouseleave", (e) => {
  if (e.explicitOriginalTarget != workItemCopyLink)
    linkContainer.classList.add("hide");
});
linkContainer.addEventListener("mouseleave", (e) => {
  linkContainer.classList.add("hide");
});

linkContainer.appendChild(workItemCopyLink);
linkContainer.appendChild(message);
workItemInfoHeader.appendChild(linkContainer);
