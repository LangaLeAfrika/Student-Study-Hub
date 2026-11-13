'use strict';

StudyHub.renderDiscussions = function renderDiscussions() {
	const posts = StudyHub.state.posts.map(post => `
		<article class="discussion-post">
			<div class="section-heading"><span class="tag">${StudyHub.escapeHTML(StudyHub.moduleName(post.module))}</span><small>${StudyHub.escapeHTML(post.author)}</small></div>
			<h2>${StudyHub.escapeHTML(post.title)}</h2>
			<p class="post-body">${StudyHub.escapeHTML(post.body)}</p>
			<div class="replies">
				${post.replies.map(reply => `
					<div class="reply"><small>${StudyHub.escapeHTML(reply.author)}</small><p>${StudyHub.escapeHTML(reply.body)}</p></div>`).join('')}
			</div>
			<div class="actions">
				<button type="button" data-action="reply" data-id="${post.id}">Reply (${post.replies.length})</button>
				<div class="item-actions">
					${post.own ? `
						<button class="icon-button" type="button" data-action="edit-post" data-id="${post.id}">Edit</button>
						<button class="icon-button danger" type="button" data-action="delete-post" data-id="${post.id}">Delete</button>` : ''}
					<button class="icon-button" type="button" data-action="report-post" data-id="${post.id}" ${post.reported ? 'aria-pressed="true"' : ''}>${post.reported ? 'Reported locally' : 'Report'}</button>
				</div>
			</div>
		</article>`).join('');

	return `
		<div class="title-row">
			<div><h1>Study discussions</h1><p class="subtitle">Ask a question. Share an approach. Learn together.</p></div>
			<button class="primary" type="button" data-action="add-post">+ Start a discussion</button>
		</div>
		<p class="notice-inline">Discussion demo: posts and replies are stored in this browser only. Sample students are fictional; no messages are sent to other people.</p>
		<details class="guidelines">
			<summary>Community guidelines and reporting</summary>
			<p>Keep discussions relevant to learning. Be respectful, credit shared sources and avoid posting personal information. Reports here demonstrate the interaction only; there is no moderator service.</p>
		</details>
		${posts || '<div class="empty-state"><h2>No discussions yet.</h2><p>Start a study question when you are ready.</p></div>'}`;
};
