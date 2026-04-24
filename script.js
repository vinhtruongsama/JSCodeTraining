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
        codeEditor.value = "// Bắt đầu viết code tại đây...\n";
    }

    updateHighlighting();
    addSystemMessage("Sẵn sàng! Hãy viết code và bấm Run Code.");
}

// --- HÀM SYNTAX HIGHLIGHTING (Vanilla JS) ---
function updateHighlighting() {
    let code = codeEditor.value;

    // Thoát các ký tự HTML đặc biệt để tránh lỗi hiển thị
    code = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Syntax Highlighting Regex
    const rules = [
        { regex: /(\/\/.+)/g, class: 'comment' }, // Comments
        { regex: /(".*?"|'.*?'|`.*?`)/g, class: 'string' }, // Strings
        { regex: /\b(let|const|var|function|return|if|else|for|while|import|export|class|new|this|await|async|try|catch|finally)\b/g, class: 'keyword' }, // Keywords
        { regex: /\b(true|false|null|undefined)\b/g, class: 'boolean' }, // Booleans/Null
        { regex: /\b(\d+)\b/g, class: 'number' }, // Numbers
        { regex: /\b(console|log|warn|error|alert|document|window)\b/g, class: 'function' } // Functions/Objects
    ];

    let highlighted = code;
    rules.forEach(rule => {
        // Sử dụng một trick nhỏ để không thay thế các token đã được bọc span
        // Nhưng ở mức độ đơn giản này, ta chạy tuần tự (cần cẩn thận thứ tự)
    });

    // Cách đơn giản và hiệu quả hơn cho demo này:
    highlighted = code
        .replace(/(\/\/.+)/g, '<span class="token comment">$1</span>')
        .replace(/\b(let|const|var|function|return|if|else|for|while|new|this|await|async|try|catch)\b/g, '<span class="token keyword">$1</span>')
        .replace(/\b(console|log|warn|error|alert|window|document)\b/g, '<span class="token function">$1</span>')
        .replace(/\b(true|false|null|undefined)\b/g, '<span class="token boolean">$1</span>')
        .replace(/\b(\d+)\b/g, '<span class="token number">$1</span>')
        // Xử lý string cuối cùng để không bị keyword bên trong đè
        .replace(/(".*?"|'.*?'|`.*?`)/g, '<span class="token string">$1</span>');

    highlightingCode.innerHTML = highlighted + "\n"; // Thêm newline để đồng bộ cuộn
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
        codeEditor.value = "// Bắt đầu viết code tại đây...\n";
        lessonContent.innerHTML = "<h3>Nhập đề bài tại đây...</h3><p>Bạn có thể tự viết nhiệm vụ cho mình mỗi ngày.</p>";
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
