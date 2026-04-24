/**
 * JS Daily Practice - Main Script
 * Website giúp luyện tập JavaScript cơ bản mỗi ngày.
 */

// --- CẤU HÌNH BÀI HỌC (Có thể thêm Day 2, Day 3... vào đây) ---
const LESSONS = {
    day1: {
        title: "Day 1: Variables & console.log",
        task: `
            <h3>Day 1: Variables & console.log</h3>
            <p>Nhiệm vụ:</p>
            <ol>
                <li>Tạo biến <code>name</code>, <code>age</code>, <code>country</code>.</li>
                <li>In ra câu: "Tôi là ..., đến từ ..., năm nay ... tuổi".</li>
                <li>Tạo biến <code>a = 5</code>, <code>b = 10</code> và in ra tổng, hiệu.</li>
            </ol>
        `,
        defaultCode: `// Viết code của bạn ở đây...
`
    }
};

// --- CÁC PHẦN TỬ DOM ---
const codeEditor = document.getElementById('code-editor');
const highlightingCode = document.getElementById('highlighting-code');
const highlightingContent = document.getElementById('highlighting-content');
const consoleOutput = document.getElementById('console-output');
const lessonContent = document.getElementById('lesson-content');

// Buttons
const btnRun = document.getElementById('btn-run');
const btnSave = document.getElementById('btn-save');
const btnReset = document.getElementById('btn-reset');
const btnClearCode = document.getElementById('btn-clear-code');
const btnClearConsole = document.getElementById('btn-clear-console');

// --- HÀM KHỞI TẠO ---
function init() {
    // 1. Load nội dung bài học từ localStorage
    const savedLesson = localStorage.getItem('js_daily_lesson');
    if (savedLesson) {
        lessonContent.innerHTML = savedLesson;
    }

    // 2. Load code từ localStorage
    const savedCode = localStorage.getItem('js_daily_code');
    if (savedCode) {
        codeEditor.value = savedCode;
    } else {
        codeEditor.value = "";
    }

    updateHighlighting();
    addSystemMessage("Sẵn sàng! Hãy viết code và bấm Run Code.");
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

    highlightingCode.innerHTML = highlighted + (code.endsWith('\n') ? ' ' : '\n');
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
    addSystemMessage("Console đã được dọn dẹp.");
}

// --- HÀM CHẠY CODE ---
function runJS() {
    const code = codeEditor.value;
    addSystemMessage("--- Đang chạy code ---");

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

btnSave.addEventListener('click', () => {
    localStorage.setItem('js_daily_code', codeEditor.value);
    localStorage.setItem('js_daily_lesson', lessonContent.innerHTML);
    alert('Đã lưu code và bài học thành công!');
});

btnReset.addEventListener('click', () => {
    if (confirm('Xóa hết dữ liệu và bắt đầu lại?')) {
        codeEditor.value = "";
        lessonContent.innerHTML = "<h3>Hôm nay học gì?</h3><p>Nhấn vào đây để ghi nhiệm vụ...</p>";
        localStorage.removeItem('js_daily_code');
        localStorage.removeItem('js_daily_lesson');
        updateHighlighting();
    }
});

btnClearCode.addEventListener('click', () => {
    codeEditor.value = '';
    updateHighlighting();
});

btnClearConsole.addEventListener('click', clearConsole);

// Tự động lưu bài học khi thay đổi
lessonContent.addEventListener('input', () => {
    localStorage.setItem('js_daily_lesson', lessonContent.innerHTML);
});

init();

// Khởi chạy app
init();
