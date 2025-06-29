.departments-panel::before {
  content: "";
  position: absolute;
  left: -1rem;
  width: 1rem;
  height: 3rem;
  top: var(--notch-top);
  transform: translate(-100%, -50%);
  background: #E5EFF5;
  border-radius: 1.5rem 0 0 1.5rem;
  transition: top 0.2s ease;   /* حركة ناعمة */
  z-index: 10;
}

/* لما ينطوي الشريط، أخفي اللسان */
.departments-panel.collapsed::before {
  opacity: 0;
}

[dir="rtl"] .departments-panel::before {
  left: auto;
  right: -1rem;
  border-radius: 0 1.5rem 1.5rem 0;
  transform: translate(100%, -50%);
}
