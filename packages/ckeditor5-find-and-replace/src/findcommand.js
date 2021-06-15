/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module link/findcommand
*/

import { Command } from 'ckeditor5/src/core';
import { updateFindResultFromRange, findByTextCallback } from './utils';

/**
 * Find command. It is used by the {@link module:findandreplace/findandreplace~FindAndReplace link feature}.
 *
 * @extends module:core/command~Command
 */
export default class FindCommand extends Command {
	/**
	 * Creates a new `FindCommand` instance.
	 *
	 * @param {module:core/editor/editor~Editor} editor Editor on which this command will be used.
	 */
	constructor( editor, state ) {
		super( editor );

		// Find command is always enabled.
		this.isEnabled = true;

		this.state = state;
	}

	/**
	 * Executes the command.
	 *
	 * @param {Function|String} callbackOrText
	 * @fires execute
	 */
	execute( callbackOrText ) {
		const { editor } = this;
		const { model } = editor;

		let findCallback;

		// Allow to execute `find()` on a plugin with a keyword only.
		if ( typeof callbackOrText === 'string' ) {
			findCallback = findByTextCallback( callbackOrText );

			this.state.searchText = callbackOrText;
		} else {
			// @todo: disable callback version
			findCallback = callbackOrText;
		}

		// Initial search is done on all nodes inside content.
		const range = model.createRangeIn( model.document.getRoot() );

		// @todo: fix me
		// this.listenTo( model.document, 'change:data', () => onDocumentChange( results, model, findCallback ) );

		const ret = {
			results: updateFindResultFromRange( range, model, findCallback ),
			findCallback
		};

		if ( ret.results.length ) {
			for ( const item of ret.results ) {
				this.state.results.add( item );
			}
		}

		return ret;
	}
}