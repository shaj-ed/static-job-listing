// Select DOM //
const jobsList = document.querySelector(".job-lists");
const filterContainer = document.querySelector(".filter-container");
const tagsFilter = document.querySelector(".filter-tags");
const clear = document.querySelector(".clear");

let filterArray = [];

// Funtions //

// Get all jobs using fetch
async function getJobs() {
  const res = await fetch('./data.json');
  const jobs = await res.json();
  return jobs
  // return fetch("./data.json")
  //   .then((res) => res.json())
  //   .then((jobs) => jobs);
}

// Show all jobs in html docs
function setJobs(job) {
  return `      
      <div class="job">
            <div class="job__logo">
                <img src="${job.logo}" alt="${job.company}" />
            </div>

            <div class="job__details">
                <div class="job__details-top">
                <h3 class="job__company">${job.company}</h3>
                ${getNew(job)}
                ${getFeatured(job)}
                </div>
                <h2 class="job__title">${job.position}</h2>
                <div class="job__details-bottom">
                <span class="job__postat">${job.postedAt}</span>
                <span class="job__contract">${job.contract}</span>
                <span class="job__location">${job.location}</span>
                </div>
            </div>

            <div class="job__tag">
                <span class="tag">${job.role}</span>
                <span class="tag">${job.level}</span>
                ${getLanguages(job)}
                ${getTools(job)}
            </div>
        </div>      
      `;
}

// Get tags
function getLanguages(job) {
  let language = "";
  job.languages.forEach((lan) => {
    language += `<span class="tag">${lan}</span>`;
  });
  return language;
}

// Get tools
function getTools(job) {
  let tools = "";

  if (job.tools === "") return;

  job.tools.forEach((tool) => {
    tools += `<span class="tag">${tool}</span>`;
  });
  return tools;
}

// Get new
function getNew(job) {
  if (!job.new) {
    return "";
  } else {
    return `<span class="new">New!</span> `;
  }
}

// Get feature
function getFeatured(job) {
  if (!job.featured) {
    return "";
  } else {
    return `<span class="feature">Featured</span>`;
  }
}

// Set border on featured job
function setBorder(feature) {
  feature.forEach((item) => {
    const parent = item.parentElement.parentElement.parentElement;
    parent.classList.add("border-left");
  });
}

// Filter tag
function displayTag() {
  let div = document.createElement("div");
  div.classList.add("search-con");
  div.innerHTML = `
            <span class="search-tag">${
              filterArray[filterArray.length - 1]
            }</span>
            <span class="delete"><i class="fas fa-times"></i></span>
      `;
  tagsFilter.appendChild(div);
  filterContainer.classList.add("show");
  filterJob();
}

// Filter jobs
function filterJob() {
  let eachJob = "";
  if (filterArray === 0) {    
    filterContainer.classList.remove("show");
    getJobs();
    return;
  }

  getJobs().then((jobs) => {
    jobs.forEach((job) => {
      if (isThere(job)) {
        eachJob += setJobs(job);
      }
      jobsList.innerHTML = eachJob;

      const feature = document.querySelectorAll(".job .feature");

      setBorder(feature);
    });
  });
}

// Is filteres tag is in the array
function isThere(job) {
  let isIn = true;

  filterArray.forEach((item) => {
    if (
      !job.languages.includes(item) &&
      !job.tools.includes(item) &&
      job.role !== item &&
      job.level !== item
    ) {
      isIn = false;
    }
  });

  return isIn;
}

// show jobs
function showJob() {
  let eachJob = "";
  getJobs().then((jobs) => {
    jobs.forEach((job) => {
      eachJob += setJobs(job);
    });
    jobsList.innerHTML = eachJob;
    const feature = document.querySelectorAll(".job .feature");

    setBorder(feature);
  });
}

// Delete element
function deleteElem(elem) {
  const tag = elem.innerText;
  elem.remove();

  filterArray = filterArray.filter((item) => item !== tag);
  filterJob();
}

// Events //
window.addEventListener("DOMContentLoaded", () => {
  showJob();
});

// Get filter tag
jobsList.addEventListener("click", (e) => {
  const element = e.target;

  if (element.classList.contains("tag")) {
    const value = element.textContent;
    if (!filterArray.includes(value)) {
      filterArray.push(value);
      displayTag();
    }
  }
});

// Remove job by filter
filterContainer.addEventListener("click", (e) => {
  if (e.target.textContent.toLowerCase() === "clear") {
    showJob();
    tagsFilter.innerHTML = "";
    filterContainer.classList.remove("show");
    filterArray = [];
  }

  if (
    e.target.classList.contains("fas") ||
    e.target.classList.contains("delete")
  ) {
    if (e.target.classList.contains("fas")) {
      const element = e.target.parentElement.parentElement;
      deleteElem(element);
    } else {
      const element = e.target.parentElement;
      deleteElem(element);
    }
  }
});
