'use strict';

StudyHub.resourceTypes = ['Notes', 'Summary', 'Practice', 'Checklist'];

StudyHub.saveButton = function saveButton(resourceId) {
	const resource = StudyHub.resources.find(item => item.id === resourceId);
	const saved = StudyHub.state.saved.includes(resourceId);
	const label = saved ? 'Unsave' : 'Save';
	return `
		<button class="save-button" type="button" data-action="save" data-id="${resourceId}"
			aria-pressed="${saved}" aria-label="${label} ${StudyHub.escapeHTML(resource.title)}">
			${saved ? '✓ Saved' : '+ Save'}
		</button>`;
};

StudyHub.resourceRow = function resourceRow(resource) {
	const iconText = resource.type === 'Practice' ? 'TASK' : 'READ';
	return `
		<div class="resource-row">
			<span class="file-icon" aria-hidden="true">${iconText}</span>
			<div class="resource-info">
				<button class="resource-title-button" type="button" data-action="open-resource" data-id="${resource.id}">${StudyHub.escapeHTML(resource.title)}</button>
				<small>${StudyHub.escapeHTML(StudyHub.moduleName(resource.module))} · ${resource.type}</small>
			</div>
			${StudyHub.saveButton(resource.id)}
		</div>`;
};

StudyHub.filteredResources = function filteredResources(page, filters) {
	const query = filters.query.trim().toLowerCase();
	return StudyHub.resources.filter(resource => {
		const isSaved = page !== 'saved' || StudyHub.state.saved.includes(resource.id);
		const matchesModule = !filters.module || resource.module === filters.module;
		const matchesType = !filters.type || resource.type === filters.type;
		const searchableText = [resource.title, resource.topic, resource.description, StudyHub.moduleName(resource.module)]
			.join(' ').toLowerCase();
		return isSaved && matchesModule && matchesType && searchableText.includes(query);
	});
};

StudyHub.renderResourceLibrary = function renderResourceLibrary(page, filters) {
	const isSavedPage = page === 'saved';
	const results = StudyHub.filteredResources(page, filters);
	const emptyTitle = isSavedPage && StudyHub.state.saved.length === 0
		? 'Your saved collection starts here.'
		: 'No matching resources.';
	const emptyMessage = isSavedPage && StudyHub.state.saved.length === 0
		? 'Save a useful resource from the library to find it here.'
		: 'Try a different keyword or clear your filters.';
	const moduleOptions = StudyHub.moduleOptions(filters.module);
	const typeOptions = StudyHub.resourceTypes.map(type => `
		<option value="${type}" ${filters.type === type ? 'selected' : ''}>${type}</option>`).join('');

	return `
		<div class="title-row">
			<div>
				<h1>${isSavedPage ? 'Saved resources' : 'Resource library'}</h1>
				<p class="subtitle">${isSavedPage ? 'Your useful finds, ready for your next session.' : 'Find something useful. Make it part of your study routine.'}</p>
			</div>
		</div>
		<form class="toolbar" id="search-form">
			<div class="field">
				<label for="resource-search">Search resources</label>
				<input id="resource-search" name="query" type="search" value="${StudyHub.escapeHTML(filters.query)}" placeholder="Try usability, SQL or classes…">
			</div>
			<div class="field">
				<label for="module-filter">Module</label>
				<select id="module-filter" name="module"><option value="">All modules</option>${moduleOptions}</select>
			</div>
			<div class="field">
				<label for="type-filter">Resource type</label>
				<select id="type-filter" name="type"><option value="">All types</option>${typeOptions}</select>
			</div>
			<button class="primary" type="submit">Search</button>
		</form>
		<p class="count" id="result-count" role="status">${results.length} resource${results.length === 1 ? '' : 's'} found</p>
		<div class="resource-grid">
			${results.map(resource => `
				<article class="resource-card">
					<div class="card-top"><span class="file-icon" aria-hidden="true">${resource.type === 'Practice' ? 'TASK' : 'READ'}</span><span class="tag">${resource.type}</span></div>
					<small>${StudyHub.escapeHTML(StudyHub.moduleName(resource.module))} · ${resource.minutes} min</small>
					<h2>${StudyHub.escapeHTML(resource.title)}</h2>
					<p>${StudyHub.escapeHTML(resource.description)}</p>
					<div class="actions">
						<button type="button" data-action="open-resource" data-id="${resource.id}">Open resource</button>
						${StudyHub.saveButton(resource.id)}
					</div>
				</article>`).join('') || `
				<div class="empty-state">
					<h2>${emptyTitle}</h2><p>${emptyMessage}</p>
					<button type="button" data-action="clear-filters">Clear filters</button>
					<a href="#resources">Browse library</a>
				</div>`}
		</div>`;
};

StudyHub.resourceDetail = function resourceDetail(resource) {
	const sections = resource.sections.map(([title, text]) => `
		<section class="article-section"><h3>${StudyHub.escapeHTML(title)}</h3><p>${StudyHub.escapeHTML(text)}</p></section>`).join('');
	return `
		<h2 id="dialog-title">${StudyHub.escapeHTML(resource.title)}</h2>
		<p class="muted">${StudyHub.escapeHTML(StudyHub.moduleName(resource.module))} · ${resource.type} · ${resource.minutes} min</p>
		<div class="article-content">${sections}</div>
		<p class="muted">Prototype study sample. Use your official course material alongside these prompts.</p>
		<div class="dialog-actions">
			${StudyHub.saveButton(resource.id)}
			<button type="button" data-action="resource-to-task" data-id="${resource.id}">Add topic to checklist</button>
			<button class="primary" type="button" data-action="close-dialog">Close</button>
		</div>`;
};
