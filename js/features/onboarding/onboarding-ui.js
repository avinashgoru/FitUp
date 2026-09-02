import { profileService } from '../../services/profile.js';
import { router } from '../../app/router.js';

export function renderOnboarding() {
    const onboardingView = document.getElementById('onboarding-shell');
    onboardingView.innerHTML = `
        <div class="onboarding-container">
            <div class="onboarding-header">
                <h2 class="onboarding-title">Personalize Your FITUP</h2>
                <p class="onboarding-subtitle">Tell us about your fitness journey so we can tailor your experience.</p>
                <div class="onboarding-progress">
                    <span id="onboarding-step-indicator">01 / 03</span>
                </div>
            </div>
            
            <form id="onboarding-form" class="onboarding-form">
                <!-- STEP 1: GOAL -->
                <div class="onboarding-step active-step" id="step-1">
                    <h3>Primary Goal</h3>
                    <div class="selection-grid">
                        <label class="selection-card">
                            <input type="radio" name="goal" value="STRENGTH" required>
                            <div class="selection-content">
                                <h4>Strength</h4>
                                <p>Build a stronger, more capable body.</p>
                            </div>
                        </label>
                        <label class="selection-card">
                            <input type="radio" name="goal" value="WEIGHT_MANAGEMENT">
                            <div class="selection-content">
                                <h4>Weight Management</h4>
                                <p>Build sustainable habits around movement and nutrition.</p>
                            </div>
                        </label>
                        <label class="selection-card">
                            <input type="radio" name="goal" value="MOBILITY">
                            <div class="selection-content">
                                <h4>Mobility</h4>
                                <p>Move with greater freedom, control and confidence.</p>
                            </div>
                        </label>
                        <label class="selection-card">
                            <input type="radio" name="goal" value="GENERAL_FITNESS">
                            <div class="selection-content">
                                <h4>General Fitness</h4>
                                <p>Build a balanced foundation for everyday fitness.</p>
                            </div>
                        </label>
                    </div>
                </div>

                <!-- STEP 2: EXPERIENCE -->
                <div class="onboarding-step" id="step-2">
                    <h3>Experience Level</h3>
                    <div class="selection-grid">
                        <label class="selection-card">
                            <input type="radio" name="experienceLevel" value="BEGINNER" required>
                            <div class="selection-content">
                                <h4>Beginner</h4>
                                <p>Starting fresh or building your foundations.</p>
                            </div>
                        </label>
                        <label class="selection-card">
                            <input type="radio" name="experienceLevel" value="INTERMEDIATE">
                            <div class="selection-content">
                                <h4>Intermediate</h4>
                                <p>Comfortable with regular training and ready to progress.</p>
                            </div>
                        </label>
                        <label class="selection-card">
                            <input type="radio" name="experienceLevel" value="ADVANCED">
                            <div class="selection-content">
                                <h4>Advanced</h4>
                                <p>Experienced and looking for greater challenge.</p>
                            </div>
                        </label>
                    </div>
                </div>

                <!-- STEP 3: ROUTINE -->
                <div class="onboarding-step" id="step-3">
                    <h3>Routine Preference</h3>
                    <div class="selection-grid">
                        <label class="selection-card">
                            <input type="radio" name="routinePreference" value="QUICK" required>
                            <div class="selection-content">
                                <h4>Quick</h4>
                                <p>Short sessions that fit into busy days.</p>
                            </div>
                        </label>
                        <label class="selection-card">
                            <input type="radio" name="routinePreference" value="BALANCED">
                            <div class="selection-content">
                                <h4>Balanced</h4>
                                <p>A sustainable mix of training and recovery.</p>
                            </div>
                        </label>
                        <label class="selection-card">
                            <input type="radio" name="routinePreference" value="DEDICATED">
                            <div class="selection-content">
                                <h4>Dedicated</h4>
                                <p>More time and structure for consistent progress.</p>
                            </div>
                        </label>
                    </div>
                </div>

                <div id="onboarding-error" class="onboarding-error" aria-live="polite"></div>
                
                <div class="onboarding-actions">
                    <button type="button" class="btn btn-outline" id="btn-prev" disabled>Back</button>
                    <button type="button" class="btn btn-primary" id="btn-next">Continue</button>
                    <button type="submit" class="btn btn-primary" id="btn-submit" style="display: none;">Complete Profile</button>
                </div>
            </form>
        </div>
    `;

    // Logic for wizard navigation
    let currentStep = 1;
    const totalSteps = 3;
    const form = document.getElementById('onboarding-form');
    const btnNext = document.getElementById('btn-next');
    const btnPrev = document.getElementById('btn-prev');
    const btnSubmit = document.getElementById('btn-submit');
    const indicator = document.getElementById('onboarding-step-indicator');
    const errorEl = document.getElementById('onboarding-error');

    function updateView() {
        document.querySelectorAll('.onboarding-step').forEach((el, index) => {
            el.classList.toggle('active-step', index + 1 === currentStep);
        });

        indicator.textContent = `0${currentStep} / 0${totalSteps}`;
        
        btnPrev.disabled = currentStep === 1;
        
        if (currentStep === totalSteps) {
            btnNext.style.display = 'none';
            btnSubmit.style.display = 'inline-block';
        } else {
            btnNext.style.display = 'inline-block';
            btnSubmit.style.display = 'none';
        }
        
        errorEl.textContent = '';
    }

    function validateCurrentStep() {
        if (currentStep === 1 && !form.goal.value) return 'Please select a primary goal.';
        if (currentStep === 2 && !form.experienceLevel.value) return 'Please select an experience level.';
        if (currentStep === 3 && !form.routinePreference.value) return 'Please select a routine preference.';
        return null;
    }

    btnNext.addEventListener('click', () => {
        const error = validateCurrentStep();
        if (error) {
            errorEl.textContent = error;
            return;
        }
        if (currentStep < totalSteps) {
            currentStep++;
            updateView();
        }
    });

    btnPrev.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateView();
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const error = validateCurrentStep();
        if (error) {
            errorEl.textContent = error;
            return;
        }

        const data = {
            goal: form.goal.value,
            experienceLevel: form.experienceLevel.value,
            routinePreference: form.routinePreference.value
        };

        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Saving...';

        try {
            await profileService.updateProfile(data);
            onboardingView.innerHTML = `
                <div class="onboarding-success">
                    <h2>Your FITUP profile is ready.</h2>
                    <p>Redirecting to dashboard...</p>
                </div>
            `;
            setTimeout(() => {
                router.redirectTo('/app');
            }, 1500);
        } catch (err) {
            errorEl.textContent = err.message || 'We couldn\'t save your preferences. Please try again.';
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Complete Profile';
        }
    });
}
