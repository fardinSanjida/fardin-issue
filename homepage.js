let currentStatus = "all";
let allIssuesData = [];
const tabActive = ["bg-primary", "border-primary", "text-white"]
const tabInactive = ["bg-transparent", "border-primary", "text-primary"]

const issuesContainer = document.getElementById('issues-container')
const loadingSpinner = document.getElementById('loadSpiner')
const issueNumber = document.getElementById('issus-number')
const issuedetails = document.getElementById('issue-details')
const searchInput = document.getElementById('search-input')

let debounceTimer;
searchInput.addEventListener('input', (e) => {
  const searchText = e.target.value;
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    searchIssues(searchText);
  }, 300);
});

async function searchIssues(searchText) {
  if (!searchText) {
    allIssues();
    return;
  }
  loadingSpinner.classList.remove('hidden')
  loadingSpinner.classList.add('flex')
  
  const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`);
  const data = await res.json();
  allIssuesData = data.data;
  displayIssues(allIssuesData);

  loadingSpinner.classList.add('hidden')
  loadingSpinner.classList.remove('flex')
}

function switchTab(tab) {
  currentStatus = tab;
  const tabs = ["all", "open", "closed"]
  for (let t of tabs) {
    const tabName = document.getElementById("tab-" + t)
    if (t === tab) {
      tabName.classList.remove(...tabInactive)
      tabName.classList.add(...tabActive)
    }
    else {
      tabName.classList.remove(...tabActive)
      tabName.classList.add(...tabInactive)
    }
  }
  displayIssues(allIssuesData)
}

switchTab('all')

function updateIssues() {
  const total = issuesContainer.children.length;
  issueNumber.innerText = total;
}

//  for getting the value through json
async function allIssues() {
  loadingSpinner.classList.remove('hidden')
  loadingSpinner.classList.add('flex')
    const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
    const data = await res.json();
    allIssuesData = data.data;
    displayIssues(allIssuesData)
  
    loadingSpinner.classList.add('hidden')
    loadingSpinner.classList.remove('flex')
  }

allIssues()


function getLabelHTML(label) {
  const upperLabel = label.toUpperCase();
  let badgeClass = "btn-info";
  let borderClass = "border-info";
  let icon = "fa-tag";

  if (upperLabel.includes("BUG")) {
    badgeClass = "btn-error";
    borderClass = "border-error";
    icon = "fa-bug";
  } else if (upperLabel.includes("HELP WANTED")) {
    badgeClass = "btn-warning";
    borderClass = "border-warning";
    icon = "fa-handshake";
  } else if (upperLabel.includes("ENHANCEMENT")) {
    badgeClass = "btn-success";
    borderClass = "border-success";
    icon = "fa-magic";
  }

  return `<button class="font-bold btn rounded-4xl btn-soft btn-outline border-2 ${badgeClass} ${borderClass}">
            <i class="fas ${icon} mr-1"></i> ${upperLabel}
          </button>`;
}

function displayIssues(datas) {
  issuesContainer.innerHTML = "";

  const filteredData = datas.filter(data => {
    if (currentStatus === "all")
       return true;
    return data.status?.toLowerCase() === currentStatus.toLowerCase();
  });

  filteredData.forEach((data, index) => {

    const card = document.createElement("div");
    const isClosed = data.status?.toLowerCase() === "closed";

    card.className = `card bg-base-100 shadow-sm border-t-6 ${
      isClosed ? "border-purple-400" : "border-green-400"
    }`;

    card.innerHTML = `
      <div class="card-body space-y-3 pb-10">
      
        <div class="flex justify-between">
          <img src="assets/${isClosed ? "Closed-Status.png" : "Open-Status.png"}" alt="status">
          
          <h2 class="px-2 py-1 text-center font-bold rounded-4xl bg-red-100 text-red-500 w-20">
            ${(data.priority || "unknown").toUpperCase()}
          </h2>
        </div>

        <h2 onclick="openModal('${data.id}')" class="cursor-pointer card-title font-bold text-2xl hover:text-primary transition-colors">
          ${data.title || "No Title"}
        </h2>

        <p class="text-gray-500 text-lg">
          ${data.description || "No description"}
        </p>
          <div class="card-actions ">
            ${data.labels.map(label => getLabelHTML(label)).join('')}
          </div>
          <hr class="w-full">
          <div class=" text-gray-500 text-lg flex justify-between items-center">
            <p>#1 by ${data.author}</p>
            <p>${new Date(data.createdAt).toLocaleString()}</p>
          </div>
      </div>
    `;

    issuesContainer.appendChild(card);
  });

  updateIssues();
}

async function openModal(issueId) {
  const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${issueId}`);
  const result = await res.json();
  const data = result.data;

  issuedetails.querySelector('h3').innerText = data.title;
  const statusEl = issuedetails.querySelector('.modal-box div div p:first-child');
  statusEl.innerText = data.status.charAt(0).toUpperCase() + data.status.slice(1);
  statusEl.className = `px-4 py-1 rounded-xl w-fit text-white ${data.status.toLowerCase() === 'open' ? 'bg-green-400' : 'bg-purple-400'}`;
  
  issuedetails.querySelector('.modal-box div div p:nth-child(3)').innerText = `Opened by ${data.author}`;
  issuedetails.querySelector('.modal-box div div p:last-child').innerText = new Date(data.createdAt).toLocaleDateString();
  
  const labelContainer = issuedetails.querySelector('.card-actions');
  labelContainer.innerHTML = data.labels.map(label => getLabelHTML(label)).join('');
  
  issuedetails.querySelector('.modal-box > div > p').innerText = data.description;
  issuedetails.querySelector('.modal-box div div h2').innerText = data.author;
  
  const priorityBtn = issuedetails.querySelector('.modal-box div div:last-child button');
  priorityBtn.innerText = data.priority.toUpperCase();
  
  let priorityClass = "btn-info";
  let borderClass = "border-info";
  const priority = data.priority.toLowerCase();
  if (priority === 'high') {
    priorityClass = "btn-error";
    borderClass = "border-error";
  } else if (priority === 'medium') {
    priorityClass = "btn-warning";
    borderClass = "border-warning";
  } else if (priority === 'low') {
    priorityClass = "btn-success";
    borderClass = "border-success";
  }
  
  priorityBtn.className = `font-bold btn rounded-4xl btn-soft btn-outline border-2 ${priorityClass} ${borderClass}`;

  issuedetails.showModal();
}


