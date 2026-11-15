'use strict';

/*
 * StudentStudy Hub - Part 3 enhancements
 * Adds user-controlled display preferences and supportive study feedback.
 * Preferences are stored locally in this browser only.
 */
(function partThreeEnhancements() {
	const preferenceKey = 'studentstudy-part3-preferences';
	const defaults = { largeText: false, highContrast: false };
	let preferences = { ...defaults };

	try {
		const stored = JSON.parse(localStorage.getItem(preferenceKey) || '{}');
		preferences = { ...defaults, ...stored };
	} catch (error) {
		console.warn('Part 3 preferences could not be loaded.', error);
	}

	function applyPreferences() {
		document.documentElement.classList.toggle('large-text', preferences.largeText);
		document.documentElement.classList.toggle('high-contrast', preferences.highContrast);
	}

	function savePreferences() {
		try {
			localStorage.setItem(preferenceKey, JSON.stringify(preferences));
		} catch (error) {
			console.warn('Part 3 preferences could not be saved.', error);
		}
		applyPreferences();
	}

	function addAccessibilityControls() {
		const topbar = document.querySelector('.topbar-actions');
		if (!topbar || document.querySelector('#accessibility-controls')) return;

		const controls = document.createElement('div');
		controls.id = 'accessibility-controls';
		controls.className = 'accessibility-controls';
		controls.setAttribute('aria-label', 'Display preferences');
		controls.innerHTML = `
			<button type="button" data-part3="text" aria-pressed="${preferences.largeText}"
				aria-label="Toggle larger text" title="Toggle larger text">A+</button>
			<button type="button" data-part3="contrast" aria-pressed="${preferences.highContrast}"
				aria-label="Toggle high contrast" title="Toggle high contrast">◐</button>`;

		topbar.prepend(controls);
	}

	function addEncouragementPanel() {
		const main = document.querySelector('#main');
		if (!main || !window.StudyHub || !window.StudyHub.state) return;
		const heading = main.querySelector('.title-row');
		if (!heading || main.querySelector('.encouragement-panel')) return;
		if (!window.location.hash.startsWith('#dashboard') &&
			window.location.hash !== '' && !window.location.hash.startsWith('#')) return;

		const tasks = StudyHub.state.tasks || [];
		const completed = tasks.filter(task => task.done).length;
		const percentage = tasks.length ? Math.round(completed / tasks.length * 100) : 0;
		let message = 'Start with one small task. You do not have to do everything at once.';
		let headingText = 'Your progress matters';

		if (tasks.length && completed === tasks.length) {
			headingText = 'Look how far you have come!';
			message = 'You have completed every topic on your current checklist. Take a moment to recognise that achievement.';
		} else if (completed > 0) {
			headingText = 'You are making progress';
			message = `${completed} of ${tasks.length} topics completed. Keep your momentum going, one manageable step at a time.`;
		} else if (tasks.length) {
			headingText = 'Every journey starts somewhere';
			message = 'Choose one topic from your checklist and give it your attention. Small steps build confidence.';
		}

		const panel = document.createElement('section');
		panel.className = 'encouragement-panel';
		panel.setAttribute('aria-labelledby', 'encouragement-title');
		panel.innerHTML = `
			<div class="encouragement-icon" aria-hidden="true">✦</div>
			<div class="encouragement-copy">
				<h2 id="encouragement-title">${headingText}</h2>
				<p>${message}</p>
				<p class="encouragement-progress">Current checklist progress: <strong>${percentage}%</strong></p>
			</div>`;
		heading.insertAdjacentElement('afterend', panel);
	}

	document.addEventListener('click', event => {
		const button = event.target.closest('[data-part3]');
		if (!button) return;

		if (button.dataset.part3 === 'text') {
			preferences.largeText = !preferences.largeText;
		} else if (button.dataset.part3 === 'contrast') {
			preferences.highContrast = !preferences.highContrast;
		}

		button.setAttribute('aria-pressed',
			String(button.dataset.part3 === 'text' ? preferences.largeText : preferences.highContrast));
		savePreferences();
	});

	applyPreferences();
	addAccessibilityControls();
	addEncouragementPanel();

	const main = document.querySelector('#main');
	if (main) {
		new MutationObserver(() => {
			addEncouragementPanel();
		}).observe(main, { childList: true });
	}
})();