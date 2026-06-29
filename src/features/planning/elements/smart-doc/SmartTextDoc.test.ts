import {
  initializeSmartTextEditorContent,
  readSmartTextEditorContent,
} from './SmartTextDoc';

describe('SmartTextDoc editor content helpers', () => {
  it('preserves HTML-looking plain text as literal text', () => {
    const editor = document.createElement('div');
    const content = '<div>literal</div><script>alert(1)</script>';

    initializeSmartTextEditorContent(editor, 'plain', content);

    expect(editor.textContent).toBe(content);
    expect(editor.querySelector('div')).toBeNull();
    expect(editor.querySelector('script')).toBeNull();
    expect(readSmartTextEditorContent(editor, 'plain')).toBe(content);
  });

  it('preserves HTML-looking markdown text as literal text', () => {
    const editor = document.createElement('div');
    const content = '# Title\n<div>not html</div>';

    initializeSmartTextEditorContent(editor, 'markdown', content);

    expect(editor.textContent).toBe(content);
    expect(editor.querySelector('div')).toBeNull();
    expect(readSmartTextEditorContent(editor, 'markdown')).toBe(content);
  });

  it('keeps rich text sanitization for rich documents', () => {
    const editor = document.createElement('div');

    initializeSmartTextEditorContent(editor, 'rich', '<strong>safe</strong><script>alert(1)</script>');

    expect(editor.querySelector('strong')?.textContent).toBe('safe');
    expect(editor.querySelector('script')).toBeNull();
    expect(readSmartTextEditorContent(editor, 'rich')).toContain('<strong>safe</strong>');
  });
});
