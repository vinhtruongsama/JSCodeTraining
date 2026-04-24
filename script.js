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
const consoleOutput = document.getElementById('console-output');
const notesArea = document.getElementById('notes-area');
const lessonContent = document.getElementById('lesson-content');

// Buttons
const btnRun = document.getElementById('btn-run');
const btnSave = document.getElementById('btn-save');
const btnReset = document.getElementById('btn-reset');
const btnClearCode = document.getElementById('btn-clear-code');
const btnClearConsole = document.getElementById('btn-clear-console');

// --- HÀM KHỞI TẠO ---
function init() {
    // 1. Load nội dung bài học
    loadLesson('day1');

    // 2. Load code từ localStorage (nếu có)
    const savedCode = localStorage.getItem('js_daily_code');
    if (savedCode) {
        codeEditor.value = savedCode;
    } else {
        codeEditor.value = LESSONS.day1.defaultCode;
    }

    // 3. Load ghi chú
    const savedNotes = localStorage.getItem('js_daily_notes');
    if (savedNotes) {
        notesArea.value = savedNotes;
    }

    addSystemMessage("Sẵn sàng! Hãy viết code và bấm Run Code.");
}

function loadLesson(day) {
    const lesson = LESSONS[day];
    if (lesson) {
        lessonContent.innerHTML = lesson.task;
    }
}

// --- HÀM XỬ LÝ CONSOLE ---
function appendToConsole(content, type = 'log') {
    const line = document.createElement('div');
    line.className = `console-line ${type}`;
    
    // Nếu content là object/array, chuyển sang string
    if (typeof content === 'object') {
        content = JSON.stringify(content, null, 2);
    }
    
    line.textContent = content;
    consoleOutput.appendChild(line);
    
    // Tự động cuộn xuống dưới cùng
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
    
    // Dọn console trước khi chạy mới (tùy chọn)
    // consoleOutput.innerHTML = ''; 
    addSystemMessage("--- Đang chạy code ---");

    // Lưu tạm console.log gốc
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    // Ghi đè console để hiển thị lên giao diện
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

    console.warn = (...args) => {
        appendToConsole(args.join(' '), 'warn');
        originalWarn.apply(console, args);
    };

    try {
        // Thực thi code người dùng
        // Sử dụng Function thay vì eval để an toàn hơn một chút
        new Function(code)();
    } catch (err) {
        appendToConsole(`Lỗi: ${err.message}`, 'error');
    }

    // Khôi phục lại console gốc sau khi chạy xong
    console.log = originalLog;
    console.error = originalError;
    console.warn = originalWarn;
}

// --- EVENT LISTENERS ---

// Chạy code
btnRun.addEventListener('click', runJS);

// Phím tắt Ctrl + Enter để chạy code
codeEditor.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        runJS();
    }
});

// Lưu code
btnSave.addEventListener('click', () => {
    localStorage.setItem('js_daily_code', codeEditor.value);
    localStorage.setItem('js_daily_notes', notesArea.value);
    alert('Đã lưu code và ghi chú thành công!');
});

// Reset về mặc định
btnReset.addEventListener('click', () => {
    if (confirm('Bạn có chắc muốn xóa code hiện tại và quay lại bài học mặc định không?')) {
        codeEditor.value = LESSONS.day1.defaultCode;
        localStorage.removeItem('js_daily_code');
        addSystemMessage("Đã khôi phục bài học mặc định.");
    }
});

// Xóa trắng editor
btnClearCode.addEventListener('click', () => {
    codeEditor.value = '';
    addSystemMessage("Editor đã trống.");
});

// Xóa console
btnClearConsole.addEventListener('click', clearConsole);

// Lưu ghi chú tự động khi người dùng gõ
notesArea.addEventListener('input', () => {
    localStorage.setItem('js_daily_notes', notesArea.value);
});

// Khởi chạy app
init();
