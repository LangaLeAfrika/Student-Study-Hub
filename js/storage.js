'use strict';

StudyHub.storageKey = 'studentstudy-v1';
StudyHub.storageAvailable = true;
StudyHub.state = StudyHub.defaultState();

StudyHub.loadState = function loadState() {
	try {
		const savedText = window.localStorage.getItem(StudyHub.storageKey);
		if (!savedText) return;

		const savedState = JSON.parse(savedText);
		const requiredLists = ['saved', 'tasks', 'events', 'posts'];
		const validState = savedState && typeof savedState.name === 'string' &&
			requiredLists.every(key => Array.isArray(savedState[key]));

		if (validState) StudyHub.state = { ...StudyHub.defaultState(), ...savedState };
	} catch (error) {
		StudyHub.storageAvailable = false;
		console.warn('StudyHub could not read browser storage.', error);
	}
};

StudyHub.persistState = function persistState() {
	try {
		window.localStorage.setItem(StudyHub.storageKey, JSON.stringify(StudyHub.state));
		return true;
	} catch (error) {
		StudyHub.storageAvailable = false;
		console.warn('StudyHub could not save browser storage.', error);
		return false;
	}
};

StudyHub.loadState();
