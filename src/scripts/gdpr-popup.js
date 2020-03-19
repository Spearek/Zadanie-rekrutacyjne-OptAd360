"use strict";

const vendorList = [];
const modalOverlay = document.createElement('div');
const modalWrapper = document.createElement('div');
const modalContent = document.createElement('div');
let projectBody;


document.addEventListener('DOMContentLoaded', () => {
    
    projectBody = document.querySelector('body');
    if (location.protocol === 'https:' && !ifCookieExist()) {
        fetchVendors();
    }
});


function ifCookieExist() {
    const cookies = document.cookie.split(/; */);
    const iscookieSet = cookies.some((el) => /^vendorsDecision=/.test(el));
    return iscookieSet;
}

function createInitialPopup() {
    const popupContainer = document.createDocumentFragment();
    const acceptBtn = document.createElement('button');
    const rejectBtn = document.createElement('button');
    const modalTitle = document.createElement('h1');

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
    fetch('https://vendorlist.consensu.org/vendorlist.json')
        .then(response => response.json())
        .then(responseData => {
            responseData.vendors.forEach(vendor => {
                vendorList.push({ name: vendor.name, policy: vendor.policyUrl, id: vendor.id, accepted: true })
            });
            createInitialPopup();
            setVendors(vendorList);
            modalOverlay.classList.add('is-active');
            projectBody.classList.add('is-disabled');
        })
        .catch(err => {
            console.log('Should not reach that!');
        })
}

function setVendors(vendorList) {
    const vendorContainer = document.createDocumentFragment();

    for (let i = 0; i < vendorList.length; i++) {
        const informations = document.createElement('div');
        informations.className = "vendor-data";
        informations.innerHTML = `
        <div class="vendor-info">
            <p>${vendorList[i].name}</p>
            <a href="${vendorList[i].policy}">policy</a>
        </div>
        <div class="toggle-button-cover">
            <div class="button-cover">
                <div class="button b2" id="button-consent">
                    <input type="checkbox" class="checkbox js-policy">
                    <div class="knobs">
                        <span>YES</span>
                    </div>
                    <div class="layer"></div>
                </div>
            </div>
        </div>
        `
        vendorContainer.appendChild(informations);
    }
    modalContent.appendChild(vendorContainer);
}

function confirmTerms(decision) {
    const policyButtons = document.querySelectorAll('.js-policy');

    if (decision === "accepted") {
        policyButtons.forEach((btn, position) => {
            (btn.checked) ? vendorList[position].accepted = false : null;
        });
        setCookies(decision);
    } else {
        policyButtons.forEach((btn, position) => vendorList[position].accepted = false);
        setCookies(decision);
    }
}

function setCookies(decision) {

    const hoursToExpire = 24;
    const expireDate = new Date(new Date().getTime() + hoursToExpire * 3600 * 1000);
    let acceptedPartners = [];
    let rejectedPartners = [];

    vendorList.forEach(vendor => {
        vendor.accepted ? acceptedPartners.push(vendor.id) : rejectedPartners.push(vendor.id);
    })
    if (acceptedPartners.length > 0) {
        acceptedPartners = JSON.stringify(acceptedPartners);
        document.cookie = `acceptedVendors=${acceptedPartners}; expires=${expireDate}; secure`;
    }
    if (rejectedPartners.length > 0) {
        rejectedPartners = JSON.stringify(rejectedPartners);
        document.cookie = `rejectedVendors=${rejectedPartners}; expires=${expireDate}; secure`;
    }
    document.cookie = `vendorsDecision=${decision}; expires=${expireDate}; secure`;

    modalOverlay.classList.remove('is-active');
    projectBody.classList.remove('is-disabled');
}

