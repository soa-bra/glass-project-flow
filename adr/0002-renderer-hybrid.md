# ADR 0002 — Renderer هجين
- القرار: SVG للعناصر قليلة التفاعل + Canvas/WebGL للكثافة. OffscreenCanvas للـWorkers.
- السياق: المستهدف 60FPS مع 5k عناصر.
- العواقب: تعقيد أعلى، لكن أداء مستقر.
