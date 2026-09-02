import { router } from '../../app/router.js';
import { yogaService } from '../../services/yoga.js';

export async function renderYogaSession(slug) {
    const container = document.getElementById('yoga-session-shell');
    container.innerHTML = `
        <div class="yoga-session-container">
            <div style="text-align:center; padding: 40px;">Preparing your space...</div>
        </div>
    `;

    try {
        const res = await yogaService.getDetail(slug);
        if (res.status !== 'success') throw new Error('Practice not found');
        
        const practice = res.data;
        const sessionRes = await yogaService.startSession(practice.id);
        
        if (sessionRes.status !== 'success') throw new Error('Could not start session');
        const sessionId = sessionRes.data.id;

        const sessionState = new YogaSessionState(practice, sessionId, container);
        sessionState.start();

    } catch (e) {
        container.innerHTML = `
            <div class="yoga-session-container">
                <div style="text-align:center; color:var(--color-error); padding: 40px;">
                    Failed to start session.
                    <br><br>
                    <button class="btn btn-outline" onclick="window.location.hash='#/app/yoga'">Back to Library</button>
                </div>
            </div>
        `;
    }
}

class YogaSessionState {
    constructor(practice, sessionId, container) {
        this.practice = practice;
        this.sessionId = sessionId;
        this.container = container;
        this.poses = practice.poses || [];
        this.currentIndex = 0;
        
        this.timer = null;
        this.timeRemaining = 0;
        this.isPaused = false;
        
        this.bindEvents = this.bindEvents.bind(this);
        this.tick = this.tick.bind(this);
    }

    start() {
        if (this.poses.length === 0) {
            this.showCompletion();
            return;
        }
        this.loadPose(0);
    }

    loadPose(index) {
        if (index >= this.poses.length) {
            this.completeSession();
            return;
        }
        this.currentIndex = index;
        const currentPose = this.poses[this.currentIndex];
        this.timeRemaining = currentPose.durationSeconds;
        this.isPaused = false;
        
        this.render();
        this.startTimer();
    }

    startTimer() {
        clearInterval(this.timer);
        this.timer = setInterval(this.tick, 1000);
    }

    tick() {
        if (this.isPaused) return;
        
        this.timeRemaining--;
        if (this.timeRemaining <= 0) {
            clearInterval(this.timer);
            this.loadPose(this.currentIndex + 1);
        } else {
            this.updateTimerDisplay();
        }
    }

    formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    updateTimerDisplay() {
        const el = this.container.querySelector('#yoga-timer-val');
        if (el) el.textContent = this.formatTime(this.timeRemaining);
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        const btn = this.container.querySelector('#yoga-pause-btn');
        if (btn) btn.textContent = this.isPaused ? 'Resume' : 'Pause';
    }

    skipPose() {
        clearInterval(this.timer);
        this.loadPose(this.currentIndex + 1);
    }

    async completeSession() {
        clearInterval(this.timer);
        try {
            await yogaService.completeSession(this.sessionId);
            this.showCompletion();
        } catch (e) {
            console.error('Failed to save session completion', e);
            this.showCompletion(true);
        }
    }

    abandonSession() {
        clearInterval(this.timer);
        router.navigate(`/app/yoga/${this.practice.slug}`);
    }

    showCompletion(hasError = false) {
        this.container.innerHTML = `
            <div class="yoga-session-container" style="justify-content: center;">
                <div class="yoga-completion-state">
                    <h2>Namaste</h2>
                    <p>You have completed <strong>${this.practice.name}</strong>.</p>
                    ${hasError ? `<p style="color:var(--color-error); font-size:var(--text-sm);">Note: Could not save progress to server.</p>` : ''}
                    <button id="yoga-finish-btn" class="btn btn-primary">Return to Library</button>
                </div>
            </div>
        `;
        this.container.querySelector('#yoga-finish-btn').addEventListener('click', () => {
            router.navigate('/app/yoga');
        });
    }

    render() {
        const currentPoseData = this.poses[this.currentIndex];
        const poseInfo = currentPoseData.pose;
        
        this.container.innerHTML = `
            <div class="yoga-session-container">
                <div class="yoga-session-header">
                    <button id="yoga-abandon-btn" class="btn btn-ghost" style="color:var(--color-text-light);">End Practice</button>
                    <span class="yoga-session-progress">Pose ${this.currentIndex + 1} of ${this.poses.length}</span>
                </div>
                
                <div class="yoga-pose-display">
                    <div id="yoga-timer-val" class="yoga-pose-timer">${this.formatTime(this.timeRemaining)}</div>
                    <h2 class="yoga-pose-name">${poseInfo.name}</h2>
                    <p class="yoga-pose-cue">${currentPoseData.cue || poseInfo.instructions}</p>
                </div>
                
                <div class="yoga-session-controls">
                    <button id="yoga-pause-btn" class="btn btn-outline">Pause</button>
                    <button id="yoga-skip-btn" class="btn btn-ghost">Skip</button>
                </div>
            </div>
        `;
        this.bindEvents();
    }

    bindEvents() {
        this.container.querySelector('#yoga-pause-btn').addEventListener('click', () => this.togglePause());
        this.container.querySelector('#yoga-skip-btn').addEventListener('click', () => this.skipPose());
        this.container.querySelector('#yoga-abandon-btn').addEventListener('click', () => this.abandonSession());
    }
}
