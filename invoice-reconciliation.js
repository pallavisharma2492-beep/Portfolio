const contractRates = {
  "Eng-3": 78, "Eng-5": 108, "Eng-2": 65, "ProjCord-2": 56,
  "ProjManager-4": 128, "BA-3": 85, "BA-1": 60, "FA-2": 70,
  "FA-4": 98, "ProjManager-2": 98
};

const lines = [
  ["E1001", "Alice Johnson", "Eng-3", 78, 160],
  ["E1002", "Brian Smith", "Eng-5", 108, 152],
  ["E1003", "Carla Mendes", "Eng-2", 65, 168],
  ["E1004", "David Lee", "ProjCord-2", 56, 120],
  ["E1005", "Elena Petrov", "ProjManager-4", 128, 144],
  ["E1006", "Farid Khan", "BA-3", 85, 160],
  ["E1007", "Grace Tan", "BA-1", 60, 96],
  ["E1008", "Henry Okafor", "FA-2", 70, 128],
  ["E1009", "Isabel Rossi", "FA-4", 102, 136],
  ["E1010", "Jamal Carter", "ProjManager-2", 112, 80]
];

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function renderResults() {
  const body = document.getElementById("resultsBody");
  body.innerHTML = lines.map(([id, name, role, invoicedRate, hours]) => {
    const contractRate = contractRates[role];
    const variance = (invoicedRate - contractRate) * hours;
    const matches = variance === 0;
    return `
      <tr>
        <td><strong>${name}</strong><br><span style="color:var(--muted)">${id}</span></td>
        <td>${role}</td>
        <td>${money(invoicedRate)}</td>
        <td>${money(contractRate)}</td>
        <td>${hours}</td>
        <td class="${matches ? "" : "variance"}">${matches ? "$0.00" : money(variance)}</td>
        <td><span class="status ${matches ? "match" : "exception"}">${matches ? "Match" : "Review rate"}</span></td>
      </tr>`;
  }).join("");
}

document.getElementById("runButton").addEventListener("click", () => {
  const results = document.getElementById("results");
  results.classList.add("loading");
  document.getElementById("runButton").textContent = "Reconciling...";
  setTimeout(() => {
    renderResults();
    results.classList.remove("loading");
    document.getElementById("runButton").textContent = "Run reconciliation";
  }, 450);
});

document.getElementById("invoiceFile").addEventListener("change", (event) => {
  document.getElementById("invoiceName").textContent = event.target.files[0]?.name || "Invoice.pdf";
});

document.getElementById("rosterFile").addEventListener("change", (event) => {
  document.getElementById("rosterName").textContent = event.target.files[0]?.name || "Roster.pdf";
});

document.getElementById("downloadButton").addEventListener("click", () => {
  const rows = [["Employee ID", "Employee", "Designation", "Invoiced Rate", "Contract Rate", "Hours", "Variance", "Status"]];
  lines.forEach(([id, name, role, invoicedRate, hours]) => {
    const contractRate = contractRates[role];
    const variance = (invoicedRate - contractRate) * hours;
    rows.push([id, name, role, invoicedRate, contractRate, hours, variance, variance === 0 ? "Match" : "Review rate"]);
  });
  const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "invoice-reconciliation.csv";
  link.click();
  URL.revokeObjectURL(url);
});

renderResults();
