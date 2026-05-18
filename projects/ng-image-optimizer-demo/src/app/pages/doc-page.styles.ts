/** Shared styles for documentation pages. */
export const DOC_PAGE_STYLES = `
  ul, ol { margin-bottom: 24px; padding-left: 20px; color: var(--text-secondary); }
  li { margin-bottom: 8px; }
  strong { color: var(--text-primary); font-weight: 600; }
  hr {
    margin: 32px 0;
    border: 0;
    border-top: 1px solid var(--border-color);
    opacity: 0.5;
  }
  h3.option-title {
    font-family: var(--font-mono);
    font-size: 1.1rem;
  }
  .callout {
    padding: 16px 20px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    background: var(--bg-secondary);
    margin-bottom: 24px;
    color: var(--text-secondary);
  }
  .callout strong { display: block; margin-bottom: 8px; color: var(--text-primary); }
  .mode-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 32px;
  }
  @media (max-width: 768px) {
    .mode-grid { grid-template-columns: 1fr; }
  }
  .mode-card {
    padding: 20px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    background: var(--bg-secondary);
  }
  .mode-card h3 { margin-top: 0; font-size: 1.1rem; }
  .mode-card p:last-child { margin-bottom: 0; }
  .mode-card a { color: var(--accent-secondary); }
`;
