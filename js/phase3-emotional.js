
'use strict';

/*
 * Part 3 - Emotional UX
 * Celebrates completed study checklist topics.
 */

(function achievementSystem() {
    const container = document.createElement('div');
    container.className = 'achievement-toast-container';
    container.setAttribute('aria-label', 'Study achievements');
    document.body.appendChild(container);

    const encouragements = [
        {
            title: 'Brilliant work!',
            message: 'One step closer to your goal.',
            icon: '🌟'
        },
        {
            title: 'Momentum building!',
            message: 'Keep up this great pace.',
            icon: '🚀'
        },
        {
            title: 'Topic completed!',
            message: 'Take a breath. You earned it.',
            icon: '🎯'
        },
        {
            title: 'Solid progress!',
            message: 'Small steps lead to big results.',
            icon: '📈'
        }
    ];

    function showAchievement() {
        const achievement = encouragements[
            Math.floor(Math.random() * encouragements.length)
        ];

        const toast = document.createElement('div');
        toast.className = 'achievement-toast';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        toast.setAttribute('aria-atomic', 'true');

        const icon = document.createElement('span');
        icon.className = 'achievement-icon';
        icon.setAttribute('aria-hidden', 'true');
        icon.textContent = achievement.icon;

        const text = document.createElement('div');
        text.className = 'achievement-text';

        const title = document.createElement('strong');
        title.textContent = achievement.title;

        const message = document.createElement('span');
        message.textContent = achievement.message;

        text.append(title, message);
        toast.append(icon, text);
        container.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        window.setTimeout(() => {
            toast.classList.remove('show');
            window.setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    document.addEventListener('change', (event) => {
        const checkbox = event.target;

        // Only celebrate completed study checklist topics.
        if (!checkbox.matches('[data-task-id]') || !checkbox.checked) {
            return;
        }

        // app.js re-renders the checklist after saving.
        // Find the newly rendered row for its animation.
        const taskId = checkbox.dataset.taskId;

        window.setTimeout(() => {
            const updatedCheckbox = document.getElementById(`task-${taskId}`);
            const taskRow = updatedCheckbox?.closest('.check-row');

            if (taskRow) {
                taskRow.classList.remove('task-celebrate');
                void taskRow.offsetWidth;
                taskRow.classList.add('task-celebrate');
            }
        }, 0);

        showAchievement();
    });
})();
