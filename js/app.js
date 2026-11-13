'use strict';

const app = StudyHub;
const main = document.querySelector('#main');
const dialog = document.querySelector('#dialog');
const dialogContent = document.querySelector('#dialog-content');
const notice = document.querySelector('#notice');
const filters = { query: '', module: '', type: '' };
let currentPage = 'dashboard';
let returnFocus = null;
let noticeTimer;

function getPageFromHash() {
	const [page, queryString = ''] = window.location.hash.slice(1).split('?');
	const validPages = [...app.navigation.map(item => item[0]), 'welcome'];
	currentPage = validPages.includes(page) ? page : (app.state.entered ? 'dashboard' : 'welcome');
	const params = new URLSearchParams(queryString);
	filters.module = params.get('module') || '';
	filters.query = '';
	filters.type = '';
}

function pageHeading(title, subtitle, action = '') {
	return `
		<div class="title-row">
			<div><h1>${title}</h1><p class="subtitle">${subtitle}</p></div>
			${action}
		</div>`;
}

function renderModuleCards() {
	return app.modules.map(module => {
		const count = app.resources.filter(resource => resource.module === module.id).length;
		return `
			<a class="module-card" href="#resources?module=${module.id}">
				<span class="module-icon" aria-hidden="true">${module.icon}</span>
				<h3>${app.escapeHTML(module.name)}</h3>
				<p>${app.escapeHTML(module.code)} · ${count} resource${count === 1 ? '' : 's'} <span aria-hidden="true">↗</span></p>
			</a>`;
	}).join('');
}

function renderDashboard() {
	const completedTopics = app.state.tasks.filter(task => task.done).length;
	return `
		${pageHeading(`Welcome back, ${app.escapeHTML(app.state.name)}.`, 'A little structure. A clearer study day.', `<span class="date-label">${new Date().toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' })}</span>`)}
		<section class="hero">
			<div class="hero-copy">
				<p class="eyebrow">YOUR NEXT CHAPTER</p>
				<h2>Everything you need.<br>Room to focus.</h2>
				<p>Find your notes, plan your next session and pick up right where you left off.</p>
				<a class="primary-link" href="#resources">Explore resources <span aria-hidden="true">↗</span></a>
			</div>
			<div class="hero-art" aria-hidden="true"><div class="orbit"></div><div class="orbit second"></div><div class="book">Small steps.<br>Big ideas.<small>STUDY / GROW</small></div><span class="star">✧</span></div>
		</section>
		<section class="stats" aria-label="Study space summary">
			<div class="stat"><small>My modules</small><strong>${app.modules.length}</strong><span>All in one place</span></div>
			<div class="stat"><small>Resources to explore</small><strong>${app.resources.length}</strong><span>Notes, summaries &amp; practice</span></div>
			<div class="stat"><small>Saved resources</small><strong>${app.state.saved.length}</strong><span>Ready when you need them</span></div>
			<div class="stat"><small>Topics completed</small><strong>${completedTopics}<small> / ${app.state.tasks.length}</small></strong><span>Progress at your own pace</span></div>
		</section>
		<div class="dashboard-columns">
			<div>
				<div class="section-heading"><h2>Start with a resource</h2><a class="text-link" href="#resources">View library →</a></div>
				<section class="panel resource-list">${app.resources.slice(0, 3).map(resource => app.resourceRow(resource)).join('')}</section>
				<div class="section-heading"><h2>My modules</h2><a class="text-link" href="#modules">View all →</a></div>
				<div class="module-grid">${renderModuleCards()}</div>
			</div>
			<div>
				<section class="panel">
					${app.checklistProgress()}
					<div class="checklist-items">${app.checklistItems(3)}</div>
					<a class="text-link" href="#checklist">Open study checklist →</a>
				</section>
				<section class="panel">
					<div class="section-heading"><h2>On your planner</h2><a class="text-link" href="#planner">View all →</a></div>
					<div class="dashboard-events">${app.plannerItems(3)}</div>
					<a class="text-link" href="#planner">+ Plan a study session</a>
				</section>
			</div>
		</div>`;
}

function renderModules() {
	return `${pageHeading('My modules', 'Your subjects, organised in one place.')}<div class="module-grid wide-grid">${renderModuleCards()}</div>`;
}

function renderWelcome() {
	return `
		<section class="panel welcome-panel">
			<p class="eyebrow">WELCOME TO YOUR STUDY SPACE</p>
			<h1>Make room for learning.</h1>
			<p class="muted">Enter a display name to personalise your prototype workspace. This is a demonstration entry screen, not account authentication.</p>
			<form id="welcome-form" class="stack" novalidate>
				<div class="field">
					<label for="welcome-name">Your display name</label>
					<input id="welcome-name" name="name" maxlength="40" autocomplete="given-name" value="${app.escapeHTML(app.state.name)}" required aria-describedby="welcome-error">
				</div>
				<p class="error" id="welcome-error" role="alert"></p>
				<button class="primary" type="submit">Enter study workspace →</button>
			</form>
		</section>`;
}

function renderPage(shouldFocus = true) {
	const activeNavigation = app.navigation.find(item => item[0] === currentPage);
	document.querySelector('#navigation').innerHTML = app.navigation.map(([id, icon, label]) => `
		<a href="#${id}" ${currentPage === id ? 'aria-current="page"' : ''}>
			<span class="nav-icon" aria-hidden="true">${icon}</span>${label}
		</a>`).join('');
	document.querySelector('#breadcrumb').textContent = activeNavigation?.[2] || 'Welcome';
	document.querySelector('#profile-name').textContent = app.state.name;
	document.querySelector('#avatar').textContent = app.state.name.charAt(0).toUpperCase() || 'S';

	const pageContent = {
		dashboard: renderDashboard,
		modules: renderModules,
		resources: () => app.renderResourceLibrary('resources', filters),
		saved: () => app.renderResourceLibrary('saved', filters),
		checklist: app.renderChecklist,
		planner: app.renderPlanner,
		discussions: app.renderDiscussions,
		welcome: renderWelcome
	};
	main.innerHTML = (pageContent[currentPage] || renderDashboard)();
	document.title = `${activeNavigation?.[2] || 'Welcome'} · StudentStudy Hub`;
	if (shouldFocus) main.focus();
}

function showNotice(message) {
	window.clearTimeout(noticeTimer);
	const persistenceMessage = app.storageAvailable
		? ''
		: ' Browser storage is unavailable; changes last only while this page stays open.';
	notice.textContent = `${message}${persistenceMessage}`;
	noticeTimer = window.setTimeout(() => { notice.textContent = ''; }, 6500);
}

function saveAndRender(message, shouldFocus = true) {
	app.persistState();
	renderPage(shouldFocus);
	showNotice(message);
}

function showDialog(content) {
	if (!dialog.open) returnFocus = document.activeElement;
	dialogContent.innerHTML = content;
	if (!dialog.open) dialog.showModal();
	dialog.querySelector('input, select, textarea, button')?.focus();
}

function closeDialog() {
	if (dialog.open) dialog.close();
}

function formError(form, fieldName, message) {
	const field = form.elements.namedItem(fieldName);
	field?.setAttribute('aria-invalid', 'true');
	const error = form.querySelector('[role="alert"]');
	if (error) error.textContent = message;
	field?.focus();
}

function renderItemForm(kind, item = {}) {
	const isTask = kind === 'task';
	const isEvent = kind === 'event';
	const isPost = kind === 'post';
	const itemId = item.id || '';
	const titleLabel = isTask ? 'Study topic' : isEvent ? 'Session title' : 'Discussion title';
	const formTitle = `${item.id ? 'Edit' : 'Add'} ${isTask ? 'study topic' : isEvent ? 'study session' : 'discussion'}`;
	const bodyField = isPost ? `
		<div class="field"><label for="item-body">Your question or idea</label>
			<textarea id="item-body" name="body" maxlength="2000" required aria-describedby="form-error">${app.escapeHTML(item.body || '')}</textarea>
		</div>` : '';
	const dateFields = isEvent ? `
		<div class="field"><label for="item-date">Date</label><input id="item-date" name="date" type="date" required value="${app.escapeHTML(item.date || app.localDate())}" aria-describedby="form-error"></div>
		<div class="field"><label for="item-time">Time</label><input id="item-time" name="time" type="time" required value="${app.escapeHTML(item.time || '18:00')}" aria-describedby="form-error"></div>` : '';

	showDialog(`
		<h2 id="dialog-title">${formTitle}</h2>
		<form id="item-form" class="stack" novalidate data-kind="${kind}" data-id="${itemId}">
			<div class="field"><label for="item-title">${titleLabel}</label>
				<input id="item-title" name="title" maxlength="120" value="${app.escapeHTML(item.title || '')}" required aria-describedby="form-error">
			</div>
			<div class="field"><label for="item-module">Module</label>
				<select id="item-module" name="module">${app.moduleOptions(item.module || 'HCI')}</select>
			</div>
			${dateFields}${bodyField}
			<p class="error" id="form-error" role="alert"></p>
			<div class="dialog-actions">
				<button type="button" data-action="close-dialog">Cancel</button>
				<button class="primary" type="submit">${item.id ? 'Save changes' : `Add ${isTask ? 'topic' : isEvent ? 'session' : 'discussion'}`}</button>
			</div>
		</form>`);
}

function confirmDelete(kind, id) {
	const itemType = kind === 'task' ? 'topic' : kind === 'event' ? 'session' : 'discussion';
	showDialog(`
		<h2 id="dialog-title">Remove this ${itemType}?</h2>
		<p>This item will be removed from your workspace. Choose Cancel to keep it.</p>
		<div class="dialog-actions">
			<button type="button" data-action="close-dialog" autofocus>Cancel</button>
			<button class="danger-button" type="button" data-action="confirm-delete" data-kind="${kind}" data-id="${id}">Remove item</button>
		</div>`);
}

function editItem(kind, id) {
	const listName = { task: 'tasks', event: 'events', post: 'posts' }[kind];
	const item = app.state[listName].find(entry => entry.id === id);
	if (item) renderItemForm(kind, item);
}

function openResource(id) {
	const resource = app.resources.find(item => item.id === id);
	if (resource) showDialog(app.resourceDetail(resource));
}

function handleAction(actionButton) {
	const action = actionButton.dataset.action;
	const id = Number(actionButton.dataset.id);

	if (action === 'close-dialog') closeDialog();
	if (action === 'profile') window.location.hash = 'welcome';
	if (action === 'help') {
		showDialog(`
			<h2 id="dialog-title">Your study space, explained</h2>
			<p>Browse a module or search the library. Open a resource, save it for later, then add its topic to your checklist. Use the planner to schedule a study session.</p>
			<h3>Keyboard navigation</h3>
			<p>Use Tab and Shift+Tab to move, Enter to activate buttons and Escape to close dialogs. The first link skips to the main content.</p>
			<h3>About this prototype</h3>
			<p>Your changes are saved in this browser when storage is available. There is no shared account, real authentication, online moderation or cross-device sync. Discussion examples are fictional.</p>
			<div class="dialog-actions"><button type="button" data-action="profile">Welcome screen</button><button class="primary" type="button" data-action="close-dialog">Got it</button></div>`);
	}
	if (action === 'open-resource') openResource(id);
	if (action === 'save') {
		const dialogWasOpen = dialog.open;
		const alreadySaved = app.state.saved.includes(id);
		app.state.saved = alreadySaved ? app.state.saved.filter(savedId => savedId !== id) : [...app.state.saved, id];
		app.persistState();
		renderPage(false);
		if (dialogWasOpen) {
			openResource(id);
		} else {
			const updatedButton = main.querySelector(`[data-action="save"][data-id="${id}"]`);
			(updatedButton || main).focus();
		}
		showNotice(alreadySaved ? 'Resource removed from saved resources.' : 'Resource saved. Find it in Saved resources.');
	}
	if (action === 'resource-to-task') {
		const resource = app.resources.find(item => item.id === id);
		if (!resource) return;
		if (app.state.tasks.some(task => task.title === resource.title)) {
			showNotice('This resource is already on your checklist.');
			return;
		}
		app.state.tasks.push({ id: Date.now(), title: resource.title, module: resource.module, done: false });
		closeDialog();
		saveAndRender('Topic added to your study checklist.');
	}
	if (action === 'clear-filters') {
		filters.query = '';
		filters.module = '';
		filters.type = '';
		renderPage();
	}
	if (action === 'add-task' || action === 'add-event' || action === 'add-post') renderItemForm(action.slice(4));
	if (action.startsWith('edit-')) editItem(action.slice(5), id);
	if (action.startsWith('delete-')) confirmDelete(action.slice(7), id);
	if (action === 'confirm-delete') {
		const kind = actionButton.dataset.kind;
		const listName = { task: 'tasks', event: 'events', post: 'posts' }[kind];
		app.state[listName] = app.state[listName].filter(item => item.id !== id);
		closeDialog();
		saveAndRender('Item removed.');
	}
	if (action === 'toggle-event') {
		const event = app.state.events.find(item => item.id === id);
		if (!event) return;
		event.done = !event.done;
		saveAndRender(event.done ? 'Study session marked complete.' : 'Study session reopened.');
	}
	if (action === 'reply') {
		showDialog(`
			<h2 id="dialog-title">Add a reply</h2>
			<form id="reply-form" class="stack" novalidate data-id="${id}">
				<div class="field"><label for="reply-body">Your reply</label><textarea id="reply-body" name="body" maxlength="2000" required aria-describedby="form-error"></textarea></div>
				<p class="error" id="form-error" role="alert"></p>
				<div class="dialog-actions"><button type="button" data-action="close-dialog">Cancel</button><button class="primary" type="submit">Add reply locally</button></div>
			</form>`);
	}
	if (action === 'report-post') {
		showDialog(`
			<h2 id="dialog-title">Report discussion</h2>
			<p>This demonstrates reporting. It flags the discussion in this browser only; no moderator is contacted.</p>
			<div class="dialog-actions"><button type="button" data-action="close-dialog">Cancel</button><button class="primary" type="button" data-action="confirm-report" data-id="${id}">Flag locally</button></div>`);
	}
	if (action === 'confirm-report') {
		const post = app.state.posts.find(item => item.id === id);
		if (!post) return;
		post.reported = true;
		closeDialog();
		saveAndRender('Discussion flagged locally. No report was sent.');
	}
}

function handleClick(event) {
	const actionButton = event.target.closest('[data-action]');
	if (actionButton) handleAction(actionButton);
}

function handleChange(event) {
	if (event.target.matches('[data-task-id]')) {
		const task = app.state.tasks.find(item => item.id === Number(event.target.dataset.taskId));
		if (!task) return;
		task.done = event.target.checked;
		saveAndRender(task.done ? 'Topic complete. One more step forward.' : 'Topic marked for further study.', false);
		document.querySelector(`#task-${task.id}`)?.focus();
	}

	if (['module-filter', 'type-filter'].includes(event.target.id)) {
		filters.module = document.querySelector('#module-filter').value;
		filters.type = document.querySelector('#type-filter').value;
		filters.query = document.querySelector('#resource-search').value.trim();
		updateResourceResults();
	}
}

function updateResourceResults() {
	const isSavedPage = currentPage === 'saved';
	const content = app.renderResourceLibrary(isSavedPage ? 'saved' : 'resources', filters);
	const replacement = document.createElement('div');
	replacement.innerHTML = content;
	main.querySelector('#result-count')?.replaceWith(replacement.querySelector('#result-count'));
	main.querySelector('.resource-grid')?.replaceWith(replacement.querySelector('.resource-grid'));
}

function handleSearchInput(event) {
	if (event.target.id !== 'resource-search') return;
	filters.query = event.target.value.trim();
	const cursorPosition = event.target.selectionStart;
	updateResourceResults();
	const search = document.querySelector('#resource-search');
	search?.focus();
	search?.setSelectionRange(cursorPosition, cursorPosition);
}

function handleSubmit(event) {
	const form = event.target;
	if (!form.matches('form')) return;
	event.preventDefault();

	if (form.id === 'search-form') {
		filters.query = form.elements.query.value.trim();
		filters.module = form.elements.module.value;
		filters.type = form.elements.type.value;
		updateResourceResults();
		return;
	}

	if (form.id === 'welcome-form') {
		const name = form.elements.name.value.trim();
		if (!name) return formError(form, 'name', 'Please enter a display name to continue.');
		app.state.name = name;
		app.state.entered = true;
		app.persistState();
		window.location.hash = 'dashboard';
		showNotice(`Welcome, ${name}. Your study space is ready.`);
		return;
	}

	if (form.id === 'item-form') {
		saveItemForm(form);
		return;
	}

	if (form.id === 'reply-form') saveReplyForm(form);
}

function saveItemForm(form) {
	const kind = form.dataset.kind;
	const id = Number(form.dataset.id);
	const title = form.elements.title.value.trim();
	const moduleId = form.elements.module.value;
	if (!title) return formError(form, 'title', `Please enter a ${kind === 'task' ? 'study topic' : kind === 'event' ? 'session title' : 'discussion title'}.`);

	if (kind === 'event') {
		if (!form.elements.date.value) return formError(form, 'date', 'Please choose a date for your session.');
		if (!form.elements.time.value) return formError(form, 'time', 'Please choose a time for your session.');
	}
	if (kind === 'post' && !form.elements.body.value.trim()) return formError(form, 'body', 'Please enter your question or idea.');

	const listName = { task: 'tasks', event: 'events', post: 'posts' }[kind];
	const oldItem = app.state[listName].find(item => item.id === id);
	const item = { ...(oldItem || {}), id: id || Date.now(), title, module: moduleId };
	if (kind === 'task') item.done = oldItem?.done || false;
	if (kind === 'event') {
		item.date = form.elements.date.value;
		item.time = form.elements.time.value;
		item.done = oldItem?.done || false;
	}
	if (kind === 'post') {
		item.body = form.elements.body.value.trim();
		item.author = app.state.name;
		item.own = true;
		item.reported = oldItem?.reported || false;
		item.replies = oldItem?.replies || [];
	}

	if (oldItem) app.state[listName] = app.state[listName].map(existing => existing.id === id ? item : existing);
	else app.state[listName].push(item);
	closeDialog();
	saveAndRender(id ? 'Changes saved.' : kind === 'post' ? 'Discussion added in this browser.' : `Added to your ${kind === 'task' ? 'study checklist.' : 'study planner.'}`);
}

function saveReplyForm(form) {
	const body = form.elements.body.value.trim();
	if (!body) return formError(form, 'body', 'Please enter a reply before adding it.');
	const post = app.state.posts.find(item => item.id === Number(form.dataset.id));
	if (!post) return;
	post.replies.push({ author: app.state.name, body });
	closeDialog();
	saveAndRender('Reply added in this browser.');
}

document.addEventListener('click', handleClick);
document.addEventListener('change', handleChange);
document.addEventListener('input', handleSearchInput);
document.addEventListener('submit', handleSubmit);
dialog.addEventListener('close', () => {
	if (returnFocus?.isConnected) returnFocus.focus();
});
window.addEventListener('hashchange', () => {
	if (dialog.open) closeDialog();
	getPageFromHash();
	renderPage();
});

getPageFromHash();
renderPage(false);
