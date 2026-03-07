const issuesContainer= document.getElementById('issues-container')

//  for getting the vlau throuh json
async function allIssues(){
    const res= await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
    const data= await res.json();
    console.log(data)
    displayIssues(data.data)
}
allIssues()
// for displaying all issues
function displayIssues(datas){
    console.log(datas)
    datas.forEach(data => {
       console.log(data) 
       const card = document.createElement("div")
       card.className = "card bg-base-100  shadow-sm border-t-6 border-green-400"
       card.innerHTML =` <div class="card-body space-y-3 pb-10">
          <div class="flex justify-between">

          
            <img src="${data.status}" alt="">
           
          
           
           
            <h2 class=" px-2 py-1 text-center font-bold rounded-4xl bg-red-100 text-red-500 w-20">${data.priority.toUpperCase()}</h2>
           
           
          </div>
          <h2 class="card-title font-bold text-2xl">${data.title}</h2>
          <p class=" text-gray-500 text-lg">${data.description}</p>
          <div class="card-actions ">

            <button class=" font-bold btn border-red-600 rounded-4xl btn-soft btn-outline btn-error">${data.labels[0].toUpperCase()}</button>
            <button class=" font-bold btn border-orange-500 rounded-4xl btn-soft btn-outline btn-warning">${data.labels[1]}</button>
              
          </div>
          <hr class="w-full">
          <div class=" text-gray-500 text-lg">
            <p>#1 by john_doe</p>
            <p>1/15/2024</p>

          </div>

        </div>`
        issuesContainer.appendChild(card)

    });

}
