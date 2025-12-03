const vscode = require("vscode");

let timer = null;
let statusBar = null;
let remainingSeconds = 0;

function activate(context) {
    context.subscriptions.push(
        vscode.commands.registerCommand("pomodoro.start", startPomodoro),
        vscode.commands.registerCommand("pomodoro.stop", stopPomodoro)
    );
}

function startPomodoro() {
    stopPomodoro();

    remainingSeconds = 25 * 60; // 25 минут

    if (!statusBar) {
        statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    }

    statusBar.show();
    vscode.window.showInformationMessage("🍅 Помодоро начат! 25 минут.");

    updateStatusBar(remainingSeconds);

    timer = setInterval(() => {
        remainingSeconds--;

        if (remainingSeconds <= 0) {
            stopPomodoro();
            vscode.window.showInformationMessage("✔ Помодоро завершён!");
            return;
        }

        updateStatusBar(remainingSeconds);
    }, 1000);
}

function stopPomodoro() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }

    if (statusBar) {
        statusBar.hide();
    }
    if (remainingSeconds > 0) {
        vscode.window.showInformationMessage("⏹ Помодоро остановлен.");
    }

    remainingSeconds = 0;
}

function updateStatusBar(seconds) {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    statusBar.text = `🍅 ${m}:${s} (Stop: Ctrl+Shift+P → Pomodoro: Stop)`;
}

function deactivate() {
    stopPomodoro();
}

module.exports = {
    activate,
    deactivate
};