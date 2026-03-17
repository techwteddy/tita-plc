// =============================================
// AUTH GUARD — included on protected pages
// =============================================

(function() {
  const session = JSON.parse(sessionStorage.getItem('tita_user') || 'null');
  const currentPage = window.location.pathname;

  // Pages that require management role
  const managementPages = [
    'admin.html',
    'production-report.html'
  ];

  // Pages that require at least worker role
  const workerPages = [
    'production-entry.html'
  ];

  const isManagementPage = managementPages.some(p => currentPage.includes(p));
  const isWorkerPage = workerPages.some(p => currentPage.includes(p));

  // Not logged in at all
  if (!session && (isManagementPage || isWorkerPage)) {
    window.location.href = getLoginPath();
    return;
  }

  // Worker trying to access management page
  if (session && session.role === 'worker' && isManagementPage) {
    window.location.href = 'production-entry.html';
    return;
  }

  // Show logged in user name in navbar if element exists
  window.addEventListener('DOMContentLoaded', () => {
    const nameEl = document.getElementById('loggedInUser');
    if (nameEl && session) {
      nameEl.textContent = session.name + ' (' + session.role + ')';
    }

    // Add logout button to navbar on protected pages
    if (session && (isManagementPage || isWorkerPage)) {
      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) {
        logoutBtn.style.display = 'inline-flex';
        logoutBtn.addEventListener('click', logout);
      }
    }
  });

  function getLoginPath() {
    // Works from both root and /pages/ subdirectory
    return currentPage.includes('/pages/') ? '../login.html' : 'login.html';
  }

  window.logout = function() {
    sessionStorage.removeItem('tita_user');
    window.location.href = getLoginPath();
  };

  window.getSession = function() {
    return session;
  };

})();
