import {
  createRenderableFileCanvasElement,
  getRenderableUploadedFileKind,
} from './fileCanvasElements';

const position = { x: 10, y: 20 };

describe('getRenderableUploadedFileKind', () => {
  it.each([
    ['notes.txt', 'text/plain', 'smart_text_doc'],
    ['brief.md', 'text/markdown', 'smart_text_doc'],
    ['data.json', 'application/json', 'smart_text_doc'],
    ['proposal.pages', '', 'smart_text_doc'],
    ['budget.csv', 'text/csv', 'interactive_sheet'],
    ['budget.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'interactive_sheet'],
    ['budget.numbers', '', 'interactive_sheet'],
    ['photo.png', 'image/png', 'image'],
    ['photo.jpg', 'image/jpeg', 'image'],
    ['report.pdf', 'application/pdf', 'pdf'],
  ] as const)('routes %s to %s', (name, type, expectedKind) => {
    expect(getRenderableUploadedFileKind({ name, type })).toBe(expectedKind);
  });
});

describe('createRenderableFileCanvasElement', () => {
  it('creates a smart text document for JSON uploads', async () => {
    const file = new File(['{"status":"ready"}'], 'status.json', { type: 'application/json' });

    const element = await createRenderableFileCanvasElement(file, position);

    expect(element.type).toBe('smart');
    expect(element.smartType).toBe('smart_text_doc');
    expect(element.position).toEqual(position);
    expect(element.data?.title).toBe('status.json');
    expect(element.data?.content).toContain('"status": "ready"');
    expect(element.metadata?.renderMode).toBe('smart_text_doc');
  });

  it('creates an interactive sheet with parsed CSV cells', async () => {
    const file = new File(['name,score\nSoaBra,10'], 'scores.csv', { type: 'text/csv' });

    const element = await createRenderableFileCanvasElement(file, position);

    expect(element.type).toBe('smart');
    expect(element.smartType).toBe('interactive_sheet');
    expect(element.data?.title).toBe('scores.csv');
    expect(element.data?.cells).toMatchObject({
      A1: { value: 'name' },
      B1: { value: 'score' },
      A2: { value: 'SoaBra' },
      B2: { value: '10' },
    });
    expect(element.metadata?.renderMode).toBe('interactive_sheet');
  });
});
