export const escapeHtml = (value: string) => value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export function injectDocument(template: string, doc: {head: string; body: string}) {
 return template.replace(/<title>[\s\S]*?<\/title>/i, '').replace(/<meta[^>]+name=["']description["'][^>]*>/gi, '').replace('</head>', doc.head+'</head>').replace('<div id="root"></div>', '<div id="root">'+doc.body+'</div>');
}
