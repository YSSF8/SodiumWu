let htmlEditor = CodeMirror.fromTextArea(document.querySelector('.html-code'), {
    mode: 'xml',
    theme: 'dracula',
    autoCloseBrackets: true,
    autoCloseTags: true
});

htmlEditor.setOption('lineNumbers', true);

let cssEditor = CodeMirror.fromTextArea(document.querySelector('.css-code'), {
    mode: 'css',
    theme: 'dracula',
    autoCloseBrackets: true
});

cssEditor.setOption('lineNumbers', true);

let jsEditor = CodeMirror.fromTextArea(document.querySelector('.js-code'), {
    mode: 'javascript',
    theme: 'dracula',
    autoCloseBrackets: true
});

jsEditor.setOption('lineNumbers', true);

const result = document.querySelector('.result');

document.querySelectorAll('.nav-bar button').forEach(btn => {
    btn.addEventListener('click', () => {
        if (/exec/gi.test(btn.innerHTML)) {
            result.contentWindow.location.reload();

            setTimeout(() => {
                result.contentDocument.head.innerHTML = `<style>${cssEditor.getValue()}</style>`;
                result.contentDocument.body.innerHTML = htmlEditor.getValue();
    
                const script = result.contentDocument.createElement('script');
                script.innerText = jsEditor.getValue();
                result.contentDocument.body.appendChild(script);
            }, 100);
        } else {
            const blob = new Blob([result.contentDocument.documentElement.outerHTML], { type: 'text/html' });

            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'index.html';
            document.body.appendChild(a);

            a.click();
            a.remove();

            URL.revokeObjectURL(blob);
        }
    });

    btn.addEventListener('mousedown', e => {
        let x = e.clientX - e.target.offsetLeft, y = e.clientY - e.target.offsetTop;

        const ripple = document.createElement('span');
        btn.appendChild(ripple);

        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        setTimeout(() => ripple.remove(), 700);
    });
});

document.addEventListener('keyup', e => {
    if (e.ctrlKey && e.key == 'Enter') document.querySelector('.nav-bar button:first-child').click();
});

document.addEventListener('DOMContentLoaded', () => {
    const loadMsg = document.querySelector('.compile-hint');
    loadMsg.style.top = '70px';

    setTimeout(() => loadMsg.style.top = '60px', 200);
    setTimeout(() => loadMsg.style.top = '70px', 3000);
    setTimeout(() => loadMsg.style.top = '-50px', 3200);
    setTimeout(() => {
        loadMsg.remove();
        localStorage.setItem('firstTime', 'no');
    }, 3400);

    if (localStorage.getItem('firstTime') == 'no') {
        loadMsg.remove();
    }
});

window.addEventListener('beforeunload', e => {
    if (htmlEditor.getValue() || cssEditor.getValue() || jsEditor.getValue()) {
        e.preventDefault();
        e.returnValue = '';
    }
});