let currentStatus = "all";
let allIssuesData = [];
const tabActive = ["bg-primary", "border-primary", "text-white"];
const tabInactive = ["bg-transparent", "border-primary", "text-primary"];

const issuesContainer = document.getElementById("issues-container");
const loadingSpinner = document.getElementById("loadSpiner");
const issueNumber = document.getElementById("issus-number");
const issuedetails = document.getElementById("issue-details");
const searchInput = document.getElementById("search-input");

let debounceTimer;
searchInput.addEventListener("input", (e) => {
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
  loadingSpinner.classList.remove("hidden");
  loadingSpinner.classList.add("flex");

  const res = await fetch(
    `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`,
  );
  const data = await res.json();
  allIssuesData = data.data;
  displayIssues(allIssuesData);

  loadingSpinner.classList.add("hidden");
  loadingSpinner.classList.remove("flex");
}

function switchTab(tab) {
  currentStatus = tab;
  const tabs = ["all", "open", "closed"];
  for (let t of tabs) {
    const tabName = document.getElementById("tab-" + t);
    if (t === tab) {
      tabName.classList.remove(...tabInactive);
      tabName.classList.add(...tabActive);
    } else {
      tabName.classList.remove(...tabActive);
      tabName.classList.add(...tabInactive);
    }
  }
  displayIssues(allIssuesData);
}

switchTab("all");

function updateIssues() {
  const total = issuesContainer.children.length;
  issueNumber.innerText = total;
}

//  for getting the value through json
async function allIssues() {
  loadingSpinner.classList.remove("hidden");
  loadingSpinner.classList.add("flex");
  const res = await fetch(
    "https://phi-lab-server.vercel.app/api/v1/lab/issues",
  );
  const data = await res.json();
  allIssuesData = data.data;
  displayIssues(allIssuesData);

  loadingSpinner.classList.add("hidden");
  loadingSpinner.classList.remove("flex");
}

allIssues();

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

function getPriorityClasses(priority) {
  const p = priority?.toLowerCase();
  if (p === "high")
    return { badge: "bg-red-100 text-red-500", btn: "btn-error" };
  if (p === "medium")
    return { badge: "bg-orange-100 text-orange-500", btn: "btn-warning" };
  if (p === "low")
    return { badge: "bg-gray-100 text-gray-500", btn: "btn-neutral" };
  return { badge: "bg-blue-100 text-blue-500", btn: "btn-info" };
}

function displayIssues(datas) {
  issuesContainer.innerHTML = "";

  const filteredData = datas.filter((data) => {
    if (currentStatus === "all") return true;
    return data.status?.toLowerCase() === currentStatus.toLowerCase();
  });

  filteredData.forEach((data, index) => {
    const card = document.createElement("div");
    const isClosed = data.status?.toLowerCase() === "closed";
    const priorityClasses = getPriorityClasses(data.priority);

    card.className = `card bg-base-100 shadow-sm border-t-6 ${
      isClosed ? "border-purple-400" : "border-green-400"
    }`;

    card.innerHTML = `
      <div class="card-body space-y-3 pb-10">
      
        <div class="flex justify-between">
          <img src="assets/${isClosed ? "Closed-Status.png" : "Open-Status.png"}" alt="status">
          
          <h2 class="px-2 py-1 text-center font-bold rounded-4xl ${priorityClasses.badge} w-20">
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
            ${data.labels.map((label) => getLabelHTML(label)).join("")}
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

  const isOpened = data.status.toLowerCase() === 'open';
  const priorityClasses = getPriorityClasses(data.priority);
  const borderClass = priorityClasses.btn.replace('btn-', 'border-');

  issuedetails.innerHTML = `
    <div class="modal-box space-y-3">
      <h3 class="text-lg font-bold">${data.title}</h3>
      <div>
        <div class="flex gap-3 items-center">
          <p class="px-4 py-1 rounded-xl w-fit text-white ${isOpened ? 'bg-green-400' : 'bg-purple-400'}">
            ${data.status.charAt(0).toUpperCase() + data.status.slice(1)}
          </p>
          <p>•</p>
          <p>Opened by ${data.author}</p>
          <p>•</p>
          <p>${new Date(data.createdAt).toLocaleDateString()}</p>
        </div>

        <div class="card-actions my-5">
          ${data.labels.map(label => getLabelHTML(label)).join('')}
        </div>
        
        <p class="text-gray-600">${data.description}</p>
        
        <div class="flex justify-between mt-4">
          <div>
            <p>Assignee:</p>
            <h2 class="font-bold text-lg">${data.author}</h2>
          </div>
          <div>
            <p>Priority:</p>
            <button class="font-bold btn rounded-4xl btn-soft btn-outline border-2 ${priorityClasses.btn} ${borderClass}">
              ${data.priority.toUpperCase()}
            </button>
          </div>
        </div>
      </div>
      <div class="modal-action">
        <button onclick="document.getElementById('issue-details').close()" class="btn btn-primary">Close</button>
      </div>
    </div>
  `;

  issuedetails.showModal();
}
