const customerData = [
  { name: 'Walmart', region: 'North America', overdue: '$214K', risk: 'High', owner: 'M. Chen' },
  { name: 'Amazon', region: 'North America', overdue: '$176K', risk: 'Medium', owner: 'L. Reed' },
  { name: 'Tesla', region: 'Europe', overdue: '$142K', risk: 'High', owner: 'A. Patel' },
  { name: 'Costco', region: 'North America', overdue: '$108K', risk: 'Low', owner: 'J. Smith' },
  { name: 'Target', region: 'Asia Pacific', overdue: '$85K', risk: 'Medium', owner: 'N. Bell' },
];

const invoices = [
  { id: 'INV-20481', vendor: 'DHL Global', project: 'Grid Modernization', amount: '$84,250', status: 'Under Review', submitted: '20 Nov 2026', approval: 'Pending', payment: 'Not scheduled', days: 2 },
  { id: 'INV-20478', vendor: 'FedEx Express', project: 'Substation Upgrade', amount: '$52,810', status: 'Submitted', submitted: '18 Nov 2026', approval: 'Pending', payment: 'Not scheduled', days: 4 },
  { id: 'INV-20473', vendor: 'UPS Supply Chain', project: 'Transmission Expansion', amount: '$126,400', status: 'Approved', submitted: '15 Nov 2026', approval: 'Approved', payment: 'Scheduled', days: 7 },
  { id: 'INV-20466', vendor: 'Siemens Mobility', project: 'Underground Utilities', amount: '$218,920', status: 'Rejected', submitted: '12 Nov 2026', approval: 'Needs review', payment: 'On hold', days: 10 },
  { id: 'INV-20455', vendor: 'Honeywell', project: 'Grid Modernization', amount: '$67,300', status: 'Paid', submitted: '05 Nov 2026', approval: 'Approved', payment: 'Paid 20 Nov', days: 17 },
];

const chartDefaults = {
  color: '#8295af',
  borderColor: 'rgba(34,53,81,.7)',
  font: { family: 'DM Sans', size: 10 },
};
Chart.defaults.color = chartDefaults.color;
Chart.defaults.font = chartDefaults.font;
const storedTheme = localStorage.getItem('ar-theme') || 'dark';
document.body.classList.toggle('light', storedTheme === 'light');

function updateThemeControl() {
  const lightMode = document.body.classList.contains('light');
  const toggle = document.getElementById('themeToggle');
  toggle.title = lightMode ? 'Switch to dark mode' : 'Switch to light mode';
  toggle.setAttribute('aria-label', toggle.title);
  toggle.querySelector('span').textContent = lightMode ? 'Dark mode' : 'Light mode';
}

function renderCustomers(data = customerData) {
  document.getElementById('customerRows').innerHTML = data.map((customer) => `<tr><td><strong>${customer.name}</strong></td><td>${customer.region}</td><td><strong>${customer.overdue}</strong></td><td><span class="risk ${customer.risk.toLowerCase()}">${customer.risk}</span></td><td>${customer.owner}</td></tr>`).join('');
}

function statusClass(status) {
  return `status-${status.toLowerCase().replaceAll(' ', '-')}`;
}

function renderInvoices(data = invoices) {
  document.getElementById('invoiceRows').innerHTML = data.map((invoice) => `<tr><td>${invoice.id}</td><td><strong>${invoice.vendor}</strong></td><td class="project-cell">${invoice.project}</td><td class="amount">${invoice.amount}</td><td><span class="table-status ${statusClass(invoice.status)}">${invoice.status}</span></td><td>${invoice.submitted}</td><td>${invoice.approval}</td><td>${invoice.payment}</td><td>${invoice.days}d</td></tr>`).join('');
  document.getElementById('invoiceCount').textContent = `Showing ${data.length} of 126 invoices`;
}

const gridLines = { color: 'rgba(71,97,128,.25)', drawBorder: false };
new Chart(document.getElementById('agingChart'), { type: 'bar', data: { labels: ['Current', '0–30', '31–60', '61–90', '90+'], datasets: [{ data: [1.5, .95, .7, .55, 1.1], backgroundColor: ['#36a9ff', '#31d1bb', '#f5b75b', '#ff7f72', '#ee5d6c'], borderRadius: 5, borderSkipped: false, barThickness: 26 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context) => ` $${context.raw}M outstanding` }, backgroundColor: '#0a1728', borderColor: '#2a4663', borderWidth: 1, padding: 10 } }, scales: { x: { grid: { display: false }, border: { display: false } }, y: { grid: gridLines, border: { display: false }, ticks: { callback: (value) => `$${value}M`, maxTicksLimit: 5 } } } } });
new Chart(document.getElementById('trendChart'), { type: 'line', data: { labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'], datasets: [{ data: [3.1, 3.35, 3.28, 3.72, 3.95, 4.35, 4.8], borderColor: '#31d1bb', borderWidth: 2, pointRadius: 3, pointBackgroundColor: '#31d1bb', pointBorderColor: '#102d3c', pointBorderWidth: 2, tension: .4, fill: true, backgroundColor: (ctx) => { const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 190); gradient.addColorStop(0, 'rgba(49,209,187,.23)'); gradient.addColorStop(1, 'rgba(49,209,187,0)'); return gradient; } }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context) => ` $${context.raw}M collected` }, backgroundColor: '#0a1728', borderColor: '#2a4663', borderWidth: 1, padding: 10 } }, scales: { x: { display: false }, y: { grid: gridLines, border: { display: false }, ticks: { callback: (value) => `$${value}M`, maxTicksLimit: 4 } } } } });
new Chart(document.getElementById('barrierChart'), { type: 'doughnut', data: { labels: ['Billing disputes', 'Missing documentation', 'Customer approval delays', 'Operational issues', 'Invoice delivery issues'], datasets: [{ data: [35, 22, 18, 15, 10], backgroundColor: ['#36a9ff', '#31d1bb', '#f5b75b', '#ff7f72', '#60758f'], borderColor: '#122238', borderWidth: 4, hoverOffset: 6 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '71%', plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context) => ` ${context.label}: ${context.raw}%` }, backgroundColor: '#0a1728', borderColor: '#2a4663', borderWidth: 1, padding: 10 } } } });

new Chart(document.getElementById('forecastChart'), { type: 'bar', data: { labels: ['Next 30 days', '31–60 days', '61–90 days'], datasets: [{ data: [1.52, .58, .35], backgroundColor: ['#31d1bb', '#36a9ff', '#f5b75b'], borderRadius: 5, borderSkipped: false, barThickness: 38 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context) => ` $${context.raw}M expected cash` }, backgroundColor: '#0a1728', borderColor: '#2a4663', borderWidth: 1, padding: 10 } }, scales: { x: { grid: { display: false }, border: { display: false } }, y: { grid: gridLines, border: { display: false }, ticks: { callback: (value) => `$${value}M`, maxTicksLimit: 4 } } } } });
new Chart(document.getElementById('latePayerChart'), { type: 'bar', data: { labels: ['Walmart', 'Tesla', 'Amazon', 'Target', 'Costco'], datasets: [{ data: [5, 4, 3, 2, 1], backgroundColor: ['#ff7f72', '#ff7f72', '#f5b75b', '#31d1bb', '#31d1bb'], borderRadius: 5, borderSkipped: false, barThickness: 24 }] }, options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context) => ` ${context.raw} late payments` }, backgroundColor: '#0a1728', borderColor: '#2a4663', borderWidth: 1, padding: 10 } }, scales: { x: { beginAtZero: true, grid: gridLines, border: { display: false }, ticks: { stepSize: 1 } }, y: { grid: { display: false }, border: { display: false } } } } });

function updateChartTheme() {
  Chart.defaults.color = document.body.classList.contains('light') ? '#60758b' : '#8295af';
}

document.getElementById('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('ar-theme', document.body.classList.contains('light') ? 'light' : 'dark');
  updateThemeControl();
  updateChartTheme();
});

document.querySelectorAll('.report-tab').forEach((tab) => tab.addEventListener('click', () => { document.querySelectorAll('.report-tab').forEach((item) => item.classList.remove('active')); tab.classList.add('active'); document.getElementById(tab.dataset.target).scrollIntoView({ behavior: 'smooth', block: 'start' }); }));

function updateFilters() {
  const region = document.getElementById('regionFilter').value;
  renderCustomers(region === 'All regions' ? customerData : customerData.filter((customer) => customer.region === region));
  document.getElementById('updatedAt').textContent = 'Updated just now';
}

document.getElementById('regionFilter').addEventListener('change', updateFilters);
document.getElementById('portfolioFilter').addEventListener('change', updateFilters);
document.getElementById('clearFilters').addEventListener('click', () => { document.getElementById('regionFilter').value = 'All regions'; document.getElementById('portfolioFilter').value = 'All portfolios'; updateFilters(); });
document.getElementById('invoiceSearch').addEventListener('input', (event) => { const query = event.target.value.toLowerCase(); renderInvoices(invoices.filter((invoice) => `${invoice.id} ${invoice.vendor}`.toLowerCase().includes(query))); });
document.getElementById('statusFilter').addEventListener('change', (event) => { renderInvoices(event.target.value === 'All statuses' ? invoices : invoices.filter((invoice) => invoice.status === event.target.value)); });
document.getElementById('refreshBtn').addEventListener('click', (event) => { const button = event.currentTarget; const icon = button.querySelector('svg'); icon.style.transform = 'rotate(360deg)'; document.getElementById('updatedAt').textContent = 'Updated just now'; setTimeout(() => { icon.style.transform = ''; }, 450); });
document.getElementById('exportBtn').addEventListener('click', () => { const toast = document.getElementById('toast'); toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2600); });
document.getElementById('barrierDetail').addEventListener('click', () => { document.getElementById('invoices').scrollIntoView({ behavior: 'smooth' }); document.getElementById('invoiceSearch').focus(); });

renderCustomers();
renderInvoices();
lucide.createIcons();
updateThemeControl();
updateChartTheme();
