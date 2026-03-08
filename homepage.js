let currentStatus = "all";
let allIssuesData = [];

const tabActive = ["bg-primary", "border-primary", "text-white"]
const tabInactive = ["bg-transparent", "border-primary", "text-primary"]

const issuesContainer = document.getElementById('issues-container')
const loadingSpinner = document.getElementById('loadSpiner')
const issueNumber = document.getElementById('issus-number')

function switchTab(tab) {
  currentStatus = tab;
  const tabs = ["all", "open", "close"]
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

function updateIssues() {
  const count = issuesContainer.children.length;
  issueNumber.innerText = count;
}

async function status() {

  const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
  const data = await res.json()
  console.log(data.data)
}

status() 


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

// for displaying all issues
function displayIssues(datas) {
  issuesContainer.innerHTML = "";
  
  const filteredData = datas.filter(data => {
    if (currentStatus === "all") return true;
    return data.status === currentStatus;
  });

  filteredData.forEach(data => {
    const card = document.createElement("div")
    const isClosed = data.status === "close";
    
    card.className = `card bg-base-100 shadow-sm border-t-6 ${isClosed ? 'border-purple-400' : 'border-green-400'}`
    card.innerHTML = ` <div class="card-body space-y-3 pb-10">
          <div class="flex justify-between">
            <img src="assets/${isClosed ? 'Closed- Status .png' : 'Open-Status.png'}" alt="">
            <h2 class=" px-2 py-1 text-center font-bold rounded-4xl bg-red-100 text-red-500 w-20">${data.priority.toUpperCase()}</h2> 
          </div>
          <h2 class="card-title font-bold text-2xl">${data.title}</h2>
          <p class=" text-gray-500 text-lg">${data.description}</p>
          <div class="card-actions ">
            ${data.labels.map(label => `<button class=" font-bold btn border-red-600 rounded-4xl btn-soft btn-outline btn-error">${label.toUpperCase()}</button>`).join('')}
          </div>
          <hr class="w-full">
          <div class=" text-gray-500 text-lg">
            <p>#1 by ${data.author}</p>
                <p>${new Date(data.createdAt).toLocaleString()}</p>
          </div>
        </div>`
    issuesContainer.appendChild(card)
  });

  updateIssues()
}

// Set initial tab
switchTab('all')
