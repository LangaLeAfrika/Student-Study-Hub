'use strict';

StudyHub.checklistProgress = function checklistProgress() {
	const total = StudyHub.state.tasks.length;
	const completed = StudyHub.state.tasks.filter(task => task.done).length;
	const percent = total ? Math.round(completed / total * 100) : 0;
	return `
		<section class="progress-panel" aria-label="Study progress">
			<div class="section-heading"><h2>Your study progress</h2><strong>${percent}%</strong></div>
			<div class="progress-track" role="progressbar" aria-label="Study topics completed" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}">
				<span style="width: ${percent}%"></span>
			</div>
			<p class="muted">${completed} of ${total} topics complete. Every step counts.</p>
		</section>`;
};

StudyHub.checklistItems = function checklistItems(limit = Infinity) {
	const tasks = StudyHub.state.tasks.slice(0, limit);
	if (!tasks.length) return '<p class="muted">No study topics yet. Add your first topic to get started.</p>';

	return tasks.map(task => `
		<div class="check-row">
			<input type="checkbox" id="task-${task.id}" data-task-id="${task.id}" ${task.done ? 'checked' : ''}>
			<label for="task-${task.id}">
				<span class="task-title">${StudyHub.escapeHTML(task.title)}</span>
				<small>${StudyHub.escapeHTML(StudyHub.moduleName(task.module))}</small>
			</label>
			<div class="item-actions">
				<button class="icon-button" type="button" data-action="edit-task" data-id="${task.id}" aria-label="Edit ${StudyHub.escapeHTML(task.title)}">Edit</button>
				<button class="icon-button danger" type="button" data-action="delete-task" data-id="${task.id}" aria-label="Delete ${StudyHub.escapeHTML(task.title)}">×</button>
			</div>
		</div>`).join('');
};

StudyHub.renderChecklist = function renderChecklist() {
	return `
		<div class="title-row">
			<div><h1>Study checklist</h1><p class="subtitle">Break your revision into small, achievable topics.</p></div>
			<button class="primary" type="button" data-action="add-task">+ Add a topic</button>
		</div>
		<section class="panel">${StudyHub.checklistProgress()}<div class="checklist-items">${StudyHub.checklistItems()}</div></section>`;
};
