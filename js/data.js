'use strict';

window.StudyHub = window.StudyHub || {};

StudyHub.modules = [
	{ id: 'HCI', name: 'Human–Computer Interaction', code: 'HCIN6222', icon: '◈' },
	{ id: 'DB', name: 'Database Systems', code: 'DATA6222', icon: '▤' },
	{ id: 'PROG', name: 'Programming', code: 'PROG6212', icon: '⌘' },
	{ id: 'IS', name: 'Information Systems', code: 'IS', icon: '◎' },
	{ id: 'SAD', name: 'Systems Analysis and Design', code: 'SAD', icon: '◇' }
];

StudyHub.resources = [
	{ id: 1, module: 'HCI', title: 'Usability goals at a glance', type: 'Summary', topic: 'Usability', minutes: 5, description: 'Effectiveness, efficiency and the goals behind a useful interface.', sections: [
		['What makes a system usable?', 'Effectiveness means completing the intended task accurately. Efficiency concerns the time and effort needed to complete it. For example, a student should find the correct resource and save it without unnecessary navigation.'],
		['Put the goals into practice', 'Try finding a resource by keyword. Check whether its title and module help you choose correctly. Save it, then open Saved resources to find it again.'],
		['Study prompt', 'Explain the difference between effectiveness and efficiency using a study planner as an example.']
	] },
	{ id: 2, module: 'DB', title: 'SQL joins practice', type: 'Practice', topic: 'SQL joins', minutes: 15, description: 'Practise combining records with INNER JOIN and LEFT JOIN.', sections: [
		['Scenario', 'A Students table contains StudentID and Name. An Enrolments table contains StudentID and ModuleCode.'],
		['Task 1', 'Write an INNER JOIN query that lists each enrolled student and their module code. Join the tables on StudentID.'],
		['Task 2', 'Change your query to a LEFT JOIN starting from Students. Explain why students without enrolments are now included.'],
		['Check your understanding', 'INNER JOIN returns matching rows. LEFT JOIN retains all rows from the left table, with NULL values on the right when no match exists.']
	] },
	{ id: 3, module: 'PROG', title: 'Classes and objects', type: 'Notes', topic: 'Object-oriented programming', minutes: 8, description: 'A short introduction to state, behaviour and object instances.', sections: [
		['Class and object', 'A class defines a type, including its data and operations. An object is an instance of that class. A Student class may define a name and a method for displaying student details.'],
		['Encapsulation', 'Keep internal state private and expose appropriate methods or properties. Validation can protect an object from entering an invalid state.'],
		['Study prompt', 'Design a Book class with a title, author and borrowing status. Which operations should change the borrowing status?']
	] },
	{ id: 4, module: 'HCI', title: 'Design principles checklist', type: 'Checklist', topic: 'Design principles', minutes: 6, description: 'Review consistency, visibility, user control and error recovery.', sections: [
		['Inspect the interface', 'Are navigation labels consistent? Is the active page clear? Does saving a resource produce feedback? Can users cancel a form without changing their work?'],
		['Errors and recovery', 'Use a form with a missing required field. The message should identify the issue and explain how to fix it. Destructive actions should offer an opportunity to cancel.'],
		['Study prompt', 'Choose three principles and describe one observable interface behaviour for each.']
	] },
	{ id: 5, module: 'HCI', title: 'Accessible interface essentials', type: 'Notes', topic: 'Accessibility', minutes: 7, description: 'Explore the perceivable, operable, understandable and robust principles.', sections: [
		['Perceivable', 'Information needs to be available in ways users can perceive. Consider text alternatives, readable contrast and instructions that do not rely on colour alone.'],
		['Operable', 'Users should be able to operate controls with a keyboard. Focus needs to be visible and the navigation order should be logical.'],
		['Understandable and robust', 'Use clear labels and error messages. Semantic headings, buttons and form labels help browsers and assistive technologies interpret the interface.'],
		['Practice', 'Navigate this prototype using Tab, Shift+Tab and Enter. Can you reach and operate the main actions? This exercise alone does not establish WCAG conformance.']
	] },
	{ id: 6, module: 'IS', title: 'Information systems in context', type: 'Summary', topic: 'Systems', minutes: 5, description: 'Connect people, processes, data and technology.', sections: [
		['The bigger picture', 'An information system combines people, processes, data and technology to support activities and decisions.'],
		['Example', 'A library system records books and loans, supports staff procedures and helps readers locate material.'],
		['Study prompt', 'Identify the people, processes, data and technology involved in a student resource platform.']
	] },
	{ id: 7, module: 'SAD', title: 'Writing clear use cases', type: 'Practice', topic: 'Use cases', minutes: 10, description: 'Describe actors, goals, normal flows and alternative flows.', sections: [
		['Start with the goal', 'Name the actor and their goal. For Save resource, the actor is a student who wants quick access to a resource later.'],
		['Describe the flow', 'The student finds a resource, selects Save and receives confirmation. The resource appears in Saved resources.'],
		['Consider alternatives', 'What happens if a resource is already saved? What feedback should appear if saving is unavailable?'],
		['Your task', 'Write a use case for adding a study session to the planner, including an alternative flow for a missing date.']
	] },
	{ id: 8, module: 'DB', title: 'Normalisation revision', type: 'Summary', topic: 'Normalisation', minutes: 9, description: 'Review atomic values, keys and functional dependencies.', sections: [
		['First normal form', 'Store a single value in each field and avoid repeating groups. Identify a key that distinguishes each record.'],
		['Second normal form', 'Meet first normal form and remove partial dependencies of non-key attributes on part of a candidate key.'],
		['Third normal form', 'Consider dependencies carefully so that non-key facts are recorded with the appropriate entity, avoiding problematic transitive dependencies.'],
		['Study prompt', 'Why should a customer address usually be stored with the customer rather than repeated on every order line?']
	] }
];

StudyHub.navigation = [
	['dashboard', '◫', 'Overview'], ['modules', '▦', 'My modules'],
	['resources', '▤', 'Resource library'], ['saved', '♡', 'Saved resources'],
	['checklist', '☑', 'Study checklist'], ['planner', '▣', 'Study planner'],
	['discussions', '☷', 'Discussions']
];

StudyHub.localDate = function localDate(offset = 0) {
	const date = new Date();
	date.setDate(date.getDate() + offset);
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

StudyHub.defaultState = function defaultState() {
	return {
		name: 'BraLux', saved: [1, 4],
		tasks: [
			{ id: 101, title: 'Review usability goals', module: 'HCI', done: true },
			{ id: 102, title: 'Practise SQL joins', module: 'DB', done: false },
			{ id: 103, title: 'Revise classes and objects', module: 'PROG', done: false }
		],
		events: [
			{ id: 201, title: 'HCI revision session', module: 'HCI', date: StudyHub.localDate(), time: '18:00', done: false },
			{ id: 202, title: 'SQL practice', module: 'DB', date: StudyHub.localDate(1), time: '17:30', done: false }
		],
		posts: [{
			id: 301, author: 'Study group · sample', title: 'How do you remember the usability goals?',
			module: 'HCI', body: 'I am using one practical example for each goal. What approach helps you revise?',
			own: false, reported: false,
			replies: [{ author: 'Student · sample', body: 'Try the same task in two interfaces and compare how many steps you need.' }]
		}]
	};
};

StudyHub.escapeHTML = function escapeHTML(value) {
	return String(value ?? '').replace(/[&<>"']/g, character => ({
		'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
	})[character]);
};

StudyHub.moduleName = function moduleName(moduleId) {
	return StudyHub.modules.find(module => module.id === moduleId)?.name || moduleId;
};

StudyHub.moduleOptions = function moduleOptions(selected = '') {
	return StudyHub.modules.map(module =>
		`<option value="${module.id}" ${module.id === selected ? 'selected' : ''}>${StudyHub.escapeHTML(module.name)}</option>`
	).join('');
};
