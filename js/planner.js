'use strict';

StudyHub.plannerItems = function plannerItems(limit = Infinity) {
	const events = [...StudyHub.state.events]
		.sort((first, second) => `${first.date}${first.time}`.localeCompare(`${second.date}${second.time}`))
		.slice(0, limit);
	if (!events.length) return '<p class="muted">Your planner is clear. Add a study session when you are ready.</p>';

	return events.map(event => {
		const eventDate = new Date(`${event.date}T12:00:00`);
		const month = eventDate.toLocaleDateString('en-ZA', { month: 'short' }).toUpperCase();
		const day = eventDate.getDate();
		return `
			<article class="event-row">
				<div class="event-date"><span>${month}</span><strong>${day}</strong></div>
				<div class="event-copy">
					<h3>${StudyHub.escapeHTML(event.title)}${event.done ? ' <span aria-label="completed">✓</span>' : ''}</h3>
					<p>${StudyHub.escapeHTML(event.time)} · ${StudyHub.escapeHTML(StudyHub.moduleName(event.module))}</p>
					<small>${event.done ? 'Completed' : 'Planned'} · ${StudyHub.escapeHTML(event.date)}</small>
				</div>
				<div class="item-actions">
					<button class="icon-button" type="button" data-action="toggle-event" data-id="${event.id}" aria-label="${event.done ? 'Reopen' : 'Complete'} ${StudyHub.escapeHTML(event.title)}">${event.done ? 'Reopen' : 'Done'}</button>
					<button class="icon-button" type="button" data-action="edit-event" data-id="${event.id}" aria-label="Edit ${StudyHub.escapeHTML(event.title)}">Edit</button>
					<button class="icon-button danger" type="button" data-action="delete-event" data-id="${event.id}" aria-label="Delete ${StudyHub.escapeHTML(event.title)}">×</button>
				</div>
			</article>`;
	}).join('');
};

StudyHub.renderPlanner = function renderPlanner() {
	return `
		<div class="title-row">
			<div><h1>Study planner</h1><p class="subtitle">Give your next study session a time and a place in your day.</p></div>
			<button class="primary" type="button" data-action="add-event">+ Plan a session</button>
		</div>
		<section class="panel planner-list">${StudyHub.plannerItems()}</section>`;
};
