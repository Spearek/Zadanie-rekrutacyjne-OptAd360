"use strict";

var vendorList = [];
var modalOverlay = document.createElement('div');
var modalWrapper = document.createElement('div');
var modalContent = document.createElement('div');
var projectBody;
document.addEventListener('DOMContentLoaded', function () {
  projectBody = document.querySelector('body');

  if (location.protocol === 'https:' && !ifCookieExist()) {
    fetchVendors();
  }
});

function ifCookieExist() {
  var cookies = document.cookie.split(/; */);
  var iscookieSet = cookies.some(function (el) {
    return /^vendorsDecision=/.test(el);
  });
  return iscookieSet;
}

function createInitialPopup() {
  var popupContainer = document.createDocumentFragment();
  var acceptBtn = document.createElement('button');
  var rejectBtn = document.createElement('button');
  var modalTitle = document.createElement('h1');
  modalOverlay.className = 'modal-overlay';
  modalWrapper.className = 'modal-wrapper';
  modalContent.className = 'modal-content';
  modalTitle.className = 'modal-title';
  popupContainer.appendChild(modalOverlay);
  modalOverlay.appendChild(modalWrapper);
  modalWrapper.appendChild(modalContent);
  modalWrapper.insertBefore(modalTitle, modalWrapper.firstChild);
  modalTitle.innerHTML = 'GDPR consent';
  modalWrapper.appendChild(acceptBtn);
  modalWrapper.appendChild(rejectBtn);
  acceptBtn.innerHTML = 'Accept';
  rejectBtn.innerHTML = 'Reject';
  acceptBtn.className = 'vendors-btn vendors-accept';
  rejectBtn.className = 'vendors-btn vendors-reject';
  acceptBtn.addEventListener("click", confirmTerms.bind(this, "accepted"));
  rejectBtn.addEventListener("click", confirmTerms.bind(this, "rejected"));
  document.body.appendChild(popupContainer);
}

function fetchVendors() {
  fetch('https://vendorlist.consensu.org/vendorlist.json').then(function (response) {
    return response.json();
  }).then(function (responseData) {
    responseData.vendors.forEach(function (vendor) {
      vendorList.push({
        name: vendor.name,
        policy: vendor.policyUrl,
        id: vendor.id,
        accepted: true
      });
    });
    createInitialPopup();
    setVendors(vendorList);
    modalOverlay.classList.add('is-active');
    projectBody.classList.add('is-disabled');
  })["catch"](function (err) {
    console.log('Should not reach that!');
  });
}

function setVendors(vendorList) {
  var vendorContainer = document.createDocumentFragment();

  for (var i = 0; i < vendorList.length; i++) {
    var informations = document.createElement('div');
    informations.className = "vendor-data";
    informations.innerHTML = "\n        <div class=\"vendor-info\">\n            <p>".concat(vendorList[i].name, "</p>\n            <a href=\"").concat(vendorList[i].policy, "\">policy</a>\n        </div>\n        <div class=\"toggle-button-cover\">\n            <div class=\"button-cover\">\n                <div class=\"button b2\" id=\"button-consent\">\n                    <input type=\"checkbox\" class=\"checkbox js-policy\">\n                    <div class=\"knobs\">\n                        <span>YES</span>\n                    </div>\n                    <div class=\"layer\"></div>\n                </div>\n            </div>\n        </div>\n        ");
    vendorContainer.appendChild(informations);
  }

  modalContent.appendChild(vendorContainer);
}

function confirmTerms(decision) {
  var policyButtons = document.querySelectorAll('.js-policy');

  if (decision === "accepted") {
    policyButtons.forEach(function (btn, position) {
      btn.checked ? vendorList[position].accepted = false : null;
    });
    setCookies(decision);
  } else {
    policyButtons.forEach(function (btn, position) {
      return vendorList[position].accepted = false;
    });
    setCookies(decision);
  }
}

function setCookies(decision) {
  var hoursToExpire = 24;
  var expireDate = new Date(new Date().getTime() + hoursToExpire * 3600 * 1000);
  var acceptedPartners = [];
  var rejectedPartners = [];
  vendorList.forEach(function (vendor) {
    vendor.accepted ? acceptedPartners.push(vendor.id) : rejectedPartners.push(vendor.id);
  });

  if (acceptedPartners.length > 0) {
    acceptedPartners = JSON.stringify(acceptedPartners);
    document.cookie = "acceptedVendors=".concat(acceptedPartners, "; expires=").concat(expireDate, "; secure");
  }

  if (rejectedPartners.length > 0) {
    rejectedPartners = JSON.stringify(rejectedPartners);
    document.cookie = "rejectedVendors=".concat(rejectedPartners, "; expires=").concat(expireDate, "; secure");
  }

  document.cookie = "vendorsDecision=".concat(decision, "; expires=").concat(expireDate, "; secure");
  modalOverlay.classList.remove('is-active');
  projectBody.classList.remove('is-disabled');
}