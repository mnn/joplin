// Types related to the NoteEditor

import { CodeMirrorControl } from './CodeMirror/types';

// Controls for the entire editor (including dialogs)
export interface EditorControl extends CodeMirrorControl {
	showLinkDialog(): void;
	hideLinkDialog(): void;
	hideKeyboard(): void;
}

export interface EditorSettings {
    themeData: any;
    katexEnabled: boolean;
}

export interface ChangeEvent {
	// New editor content
	value: string;
}

export interface UndoRedoDepthChangeEvent {
	undoDepth: number;
	redoDepth: number;
}

export interface Selection {
	start: number;
	end: number;
}

export interface SelectionChangeEvent {
	selection: Selection;
}

export interface SearchControl {
    findNext(): void;
    findPrevious(): void;
    replaceCurrent(): void;
    replaceAll(): void;
	setSearchState(state: SearchState): void;

    showSearch(): void;
    hideSearch(): void;
}

export interface SearchState {
	useRegex: boolean;
	caseSensitive: boolean;

	searchText: string;
	replaceText: string;
    dialogVisible: boolean;
}

// Possible types of lists in the editor
export enum ListType {
	CheckList,
	OrderedList,
	UnorderedList,
}
