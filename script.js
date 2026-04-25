/**
 * JS Daily Practice - Main Script
 * Website giúp luyện tập JavaScript cơ bản mỗi ngày.
 */

// --- CẤU HÌNH BÀI HỌC (Có thể thêm Day 2, Day 3... vào đây) ---


// --- CÁC PHẦN TỬ DOM ---
const codeEditor = document.getElementById('code-editor');
const highlightingContent = document.getElementById('highlighting-content');
const consoleOutput = document.getElementById('console-output');

// Buttons
const btnRun = document.getElementById('btn-run');
const btnClearCode = document.getElementById('btn-clear-code');
const btnClearConsole = document.getElementById('btn-clear-console');
const btnTheme = document.getElementById('btn-theme');

// Layout & Resizer
const workspace = document.querySelector('.workspace');
const resizer = document.getElementById('workspace-resizer');
const editorSection = document.getElementById('editor-section');
const consoleSection = document.getElementById('console-section');
const btnLayoutVertical = document.getElementById('btn-layout-vertical');
const btnLayoutHorizontal = document.getElementById('btn-layout-horizontal');

// --- HÀM KHỞI TẠO ---
function init() {
    // 1. Load Theme
    const savedTheme = localStorage.getItem('js_daily_theme') || 'light';
    if (savedTheme === 'dark-blue') {
        document.body.setAttribute('data-theme', 'dark-blue');
        updateThemeIcon('dark-blue');
    }

    // 2. Load code từ localStorage
    const savedCode = localStorage.getItem('js_daily_code');
    if (savedCode) {
        codeEditor.value = savedCode;
    } else {
        codeEditor.value = "";
    }

    // 3. Load Layout settings
    const savedLayout = localStorage.getItem('js_daily_layout') || 'vertical';

    if (savedLayout === 'horizontal') {
        setLayout('horizontal');
        const savedWidth = localStorage.getItem('js_daily_editor_width');
        if (savedWidth) editorSection.style.width = savedWidth;
    } else {
        setLayout('vertical');
        const savedHeight = localStorage.getItem('js_daily_editor_height');
        if (savedHeight) editorSection.style.height = savedHeight;
    }

    updateHighlighting();
}

function setLayout(mode) {
    if (mode === 'horizontal') {
        workspace.classList.add('layout-horizontal');
        btnLayoutHorizontal.classList.add('active');
        btnLayoutVertical.classList.remove('active');

        // Reset sizes if switching (optional, but better for consistency)
        editorSection.style.height = '';
        const savedWidth = localStorage.getItem('js_daily_editor_width');
        if (savedWidth) editorSection.style.width = savedWidth;
    } else {
        workspace.classList.remove('layout-horizontal');
        btnLayoutVertical.classList.add('active');
        btnLayoutHorizontal.classList.remove('active');

        // Reset sizes if switching
        editorSection.style.width = '';
        const savedHeight = localStorage.getItem('js_daily_editor_height');
        if (savedHeight) editorSection.style.height = savedHeight;
    }
    localStorage.setItem('js_daily_layout', mode);
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    if (currentTheme === 'dark-blue') {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('js_daily_theme', 'light');
        updateThemeIcon('light');
    } else {
        document.body.setAttribute('data-theme', 'dark-blue');
        localStorage.setItem('js_daily_theme', 'dark-blue');
        updateThemeIcon('dark-blue');
    }
}

function updateThemeIcon(theme) {
    if (theme === 'dark-blue') {
        // Moon icon with gold color
        btnTheme.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="#f1c40f" stroke="#f1c40f" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="theme-icon-dark"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    } else {
        // Sun icon with orange color
        btnTheme.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="#e67e22" stroke="#e67e22" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="theme-icon-light"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    }
}

// --- HÀM SYNTAX HIGHLIGHTING (Cải tiến - Một lần chạy duy nhất) ---
function updateHighlighting() {
    let code = codeEditor.value;

    // Thoát HTML
    code = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Quy tắc Regex tổng hợp (Bổ sung dấu ngoặc và toán tử)
    const combinedRegex = new RegExp(
        '(\\/\\/.*)' +                                      // 1. Comment
        '|("(?:\\\\.|[^"\\\\])*"|\'(?:\\\\.|[^\'\\\\])*\'|`(?:\\\\.|[^`\\\\])*`)' + // 2. Strings
        '|\\b(let|const|var|function|return|if|else|for|while|new|this|await|async|try|catch|finally|import|export|class|from)\\b' + // 3. Keywords
        '|\\b(true|false|null|undefined)\\b' +               // 4. Booleans/Null
        '|\\b(console|log|warn|error|alert|window|document|Math|JSON|Object|Array|Promise)\\b' + // 5. Built-ins
        '|([\\(\\)\\{\\}\\[\\]])' +                         // 6. Brackets (Dấu ngoặc)
        '|(\\b\\d+\\b)',                                    // 7. Numbers
        'g'
    );

    const highlighted = code.replace(combinedRegex, (match, p1, p2, p3, p4, p5, p6, p7) => {
        if (p1) return `<span class="token comment">${p1}</span>`;
        if (p2) return `<span class="token string">${p2}</span>`;
        if (p3) return `<span class="token keyword">${p3}</span>`;
        if (p4) return `<span class="token boolean">${p4}</span>`;
        if (p5) return `<span class="token function">${p5}</span>`;
        if (p6) return `<span class="token operator">${p6}</span>`; // Màu cho dấu ngoặc
        if (p7) return `<span class="token number">${p7}</span>`;
        return match;
    });

    highlightingContent.innerHTML = highlighted + (code.endsWith('\n') ? ' ' : '\n');
}

// Đồng bộ cuộn giữa textarea và lớp highlight
codeEditor.addEventListener('scroll', () => {
    highlightingContent.scrollTop = codeEditor.scrollTop;
    highlightingContent.scrollLeft = codeEditor.scrollLeft;
});

// Cập nhật highlight khi gõ
codeEditor.addEventListener('input', updateHighlighting);

// --- HÀM XỬ LÝ CONSOLE ---
function appendToConsole(content, type = 'log') {
    const line = document.createElement('div');
    line.className = `console-line ${type}`;

    if (typeof content === 'object') {
        content = JSON.stringify(content, null, 2);
    }

    line.textContent = content;
    consoleOutput.appendChild(line);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

function addSystemMessage(msg) {
    appendToConsole(msg, 'system');
}

function clearConsole() {
    consoleOutput.innerHTML = '';
}

// --- HÀM CHẠY CODE ---
function runJS() {

    const code = codeEditor.value;
    const lines = code.split('\n');
    let hasError = false;

    // Bộ kiểm tra dấu chấm phẩy nghiêm ngặt
    lines.forEach((line, index) => {
        const trimmed = line.trim();
        // Bỏ qua dòng trống hoặc comment
        if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*')) return;

        // Các trường hợp bắt buộc phải có dấu ; (Khai báo, gán giá trị, gọi hàm)
        const isControlFlow = trimmed.match(/^(if|for|while|switch|function)\b/);
        const needsSemicolon = !isControlFlow && (
            trimmed.match(/^(let|const|var|return)\b/) || // Khai báo biến/return
            trimmed.includes('=') ||                      // Phép gán
            trimmed.includes('(')                         // Gọi hàm
        );

        const endsCorrectly = (
            trimmed.endsWith(';') ||
            trimmed.endsWith('{') ||
            trimmed.endsWith('}') ||
            trimmed.endsWith(',')
        );

        if (needsSemicolon && !endsCorrectly) {
            appendToConsole(`Lỗi: Thiếu dấu ';' ở dòng ${index + 1}: "${trimmed}"`, 'error');
            hasError = true;
        }
    });

    if (hasError) {
        addSystemMessage("Dừng chạy: Hãy thêm dấu ';' vào các dòng lỗi để tiếp tục.");
        return;
    }

    // Bắt đầu viết code tại đây...

    const originalLog = console.log;
    const originalError = console.error;

    console.log = (...args) => {
        const output = args.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg) : arg
        ).join(' ');
        appendToConsole(output, 'log');
        originalLog.apply(console, args);
    };

    console.error = (...args) => {
        appendToConsole(args.join(' '), 'error');
        originalError.apply(console, args);
    };

    try {
        new Function(code)();
    } catch (err) {
        appendToConsole(`Lỗi: ${err.message}`, 'error');
    }

    console.log = originalLog;
    console.error = originalError;
}

// --- EVENT LISTENERS ---

btnRun.addEventListener('click', runJS);

codeEditor.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') runJS();

    // Xử lý phím Tab
    if (e.key === 'Tab') {
        e.preventDefault();
        const start = codeEditor.selectionStart;
        const end = codeEditor.selectionEnd;
        codeEditor.value = codeEditor.value.substring(0, start) + "    " + codeEditor.value.substring(end);
        codeEditor.selectionStart = codeEditor.selectionEnd = start + 4;
        updateHighlighting();
    }
});

btnClearCode.addEventListener('click', () => {
    codeEditor.value = '';
    updateHighlighting();
});

btnClearConsole.addEventListener('click', clearConsole);

btnTheme.addEventListener('click', toggleTheme);

btnLayoutVertical.addEventListener('click', () => setLayout('vertical'));
btnLayoutHorizontal.addEventListener('click', () => setLayout('horizontal'));

// --- RESIZING LOGIC ---
let isResizing = false;

resizer.addEventListener('mousedown', (e) => {
    isResizing = true;
    document.body.style.cursor = workspace.classList.contains('layout-horizontal') ? 'col-resize' : 'row-resize';
    workspace.style.userSelect = 'none'; // Prevent text selection while resizing
});

document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;

    const isHorizontal = workspace.classList.contains('layout-horizontal');
    const rect = workspace.getBoundingClientRect();

    if (isHorizontal) {
        const offset = e.clientX - rect.left;
        const percentage = (offset / rect.width) * 100;

        // Constrain between 20% and 80%
        if (percentage > 20 && percentage < 80) {
            const size = `${percentage}%`;
            editorSection.style.width = size;
            localStorage.setItem('js_daily_editor_width', size);
        }
    } else {
        const offset = e.clientY - rect.top;
        const percentage = (offset / rect.height) * 100;

        // Constrain between 20% and 80%
        if (percentage > 20 && percentage < 80) {
            const size = `${percentage}%`;
            editorSection.style.height = size;
            localStorage.setItem('js_daily_editor_height', size);
        }
    }
});

document.addEventListener('mouseup', () => {
    if (isResizing) {
        isResizing = false;
        document.body.style.cursor = '';
        workspace.style.userSelect = '';
    }
});

init();

