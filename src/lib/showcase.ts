/**
 * The groups on the /components page, in page order, with the registry keys
 * shown in each. The page reads this list.
 */
export const showcaseGroups = [
  { id: 'form', title: 'Form', keys: ['button', 'input', 'textarea', 'select', 'checkbox', 'radio', 'switch', 'toggle-group'] },
  { id: 'data-display', title: 'Data display', keys: ['card', 'badge', 'avatar', 'avatar-group', 'table', 'pagination', 'progress', 'skeleton', 'carousel', 'google-map'] },
  { id: 'feedback', title: 'Feedback', keys: ['alert', 'toast', 'tooltip', 'spinner'] },
  { id: 'overlay', title: 'Overlay', keys: ['dialog', 'sheet', 'dropdown', 'popover', 'tabs', 'vertical-tabs', 'accordion'] },
  { id: 'content', title: 'Content and layout', keys: ['code-block', 'kbd', 'separator', 'icon'] },
  { id: 'marketing', title: 'Marketing', keys: ['cta', 'npm-copy-button', 'social-proof', 'terminal-demo', 'video-embed', 'announcement-bar'] },
  { id: 'patterns', title: 'Patterns', keys: ['form-field', 'search-input', 'password-input', 'stat-card', 'empty-state', 'page-header', 'media-slot'] },
];

/** How many components the page shows. */
export const showcaseCount = showcaseGroups.reduce((n, group) => n + group.keys.length, 0);
