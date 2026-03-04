const jobForm = document.getElementById("jobForm");
const jobTable = document.getElementById("jobTable");
const searchInput = document.getElementById("search");
const filterStatus = document.getElementById("filterStatus");

let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

function saveJobs() {
  localStorage.setItem("jobs", JSON.stringify(jobs));
}

function renderJobs() {
  jobTable.innerHTML = "";

  const searchText = searchInput.value.toLowerCase();
  const filterValue = filterStatus.value;

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.company.toLowerCase().includes(searchText);
    const matchesFilter = filterValue === "All" || job.status === filterValue;
    return matchesSearch && matchesFilter;
  });

  filteredJobs.forEach((job, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${job.company}</td>
      <td>${job.role}</td>
      <td>${job.date}</td>
      <td class="status-${job.status}">${job.status}</td>
      <td>
        <button onclick="deleteJob(${index})">Delete</button>
      </td>
    `;

    jobTable.appendChild(row);
  });

  updateStats();
}

function updateStats() {
  document.getElementById("total").textContent = jobs.length;
  document.getElementById("appliedCount").textContent = jobs.filter(j => j.status === "Applied").length;
  document.getElementById("interviewCount").textContent = jobs.filter(j => j.status === "Interview").length;
  document.getElementById("rejectedCount").textContent = jobs.filter(j => j.status === "Rejected").length;
  document.getElementById("offerCount").textContent = jobs.filter(j => j.status === "Offer").length;
}

function deleteJob(index) {
  jobs.splice(index, 1);
  saveJobs();
  renderJobs();
}

jobForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const company = document.getElementById("company").value;
  const role = document.getElementById("role").value;
  const date = document.getElementById("date").value;
  const status = document.getElementById("status").value;

  jobs.push({ company, role, date, status });

  saveJobs();
  renderJobs();
  jobForm.reset();
});

searchInput.addEventListener("input", renderJobs);
filterStatus.addEventListener("change", renderJobs);

renderJobs();