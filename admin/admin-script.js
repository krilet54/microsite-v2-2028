(function () {
  'use strict';

  window.requireAuth = async function requireAuth() {
    const response = await supabase.auth.getSession();
    const session = response.data ? response.data.session : null;
    if (!session) {
      window.location.href = '/admin/index.html';
      return null;
    }
    return session;
  };

  window.signOut = async function signOut() {
    await supabase.auth.signOut();
    window.location.href = '/admin/index.html';
  };

  window.escapeHtml = function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  window.formatDate = function formatDate(value) {
    if (!value) return '-';
    return new Date(value).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  window.statusBadgeClass = function statusBadgeClass(status) {
    const key = String(status || '').toLowerCase();
    if (key === 'published') return 'badge badge-published';
    if (key === 'draft') return 'badge badge-draft';
    if (key === 'new') return 'badge badge-new';
    if (key === 'read') return 'badge badge-read';
    if (key === 'replied') return 'badge badge-replied';
    if (key === 'archived') return 'badge badge-archived';
    return 'badge badge-draft';
  };

  window.renderSidebarBadge = async function renderSidebarBadge() {
    const badge = document.getElementById('submissions-badge');
    if (!badge) return;

    const response = await supabase
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new');

    if (response.error) {
      badge.style.display = 'none';
      return;
    }

    const count = response.count || 0;
    badge.textContent = String(count);
    badge.style.display = count > 0 ? 'inline-block' : 'none';
  };
})();
