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

  it('preserves line breaks inserted into plain text editor content', () => {
    const editor = document.createElement('div');
    editor.append('foo');
    editor.append(document.createElement('br'));
    editor.append('bar');

    expect(readSmartTextEditorContent(editor, 'plain')).toBe('foo\nbar');
  });

  it('preserves block boundaries as line breaks for markdown editor content', () => {
    const editor = document.createElement('div');
    const first = document.createElement('div');
    const second = document.createElement('div');
    first.textContent = 'heading';
    second.textContent = '<tag>literal</tag>';
    editor.append(first, second);

    expect(readSmartTextEditorContent(editor, 'markdown')).toBe('heading\n<tag>literal</tag>');
  });

  it('preserves user-authored markdown whitespace while adding DOM line breaks', () => {
    const editor = document.createElement('div');
    editor.append(document.createElement('br'));
    editor.append('first line  ');
    editor.append(document.createElement('br'));
    editor.append(document.createElement('br'));
    editor.append('  indented');
    editor.append(document.createElement('br'));

    expect(readSmartTextEditorContent(editor, 'markdown')).toBe('\nfirst line  \n\n  indented\n');
  });

  it('keeps rich text sanitization for rich documents', () => {
    const editor = document.createElement('div');

    initializeSmartTextEditorContent(editor, 'rich', '<strong>safe</strong><script>alert(1)</script>');

    expect(editor.querySelector('strong')?.textContent).toBe('safe');
    expect(editor.querySelector('script')).toBeNull();
    expect(readSmartTextEditorContent(editor, 'rich')).toContain('<strong>safe</strong>');
  });
});
