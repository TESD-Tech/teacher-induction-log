  // Check if we should show admin panel based on URL
  export function isAdminView(): boolean {
    const pathname = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    
    // Check for admin in path or admin=true parameter
    return pathname.includes('/admin') || 
           pathname.includes('adminpanel') || 
           urlParams.get('admin') === 'true' ||
           urlParams.get('view') === 'admin';
  }

