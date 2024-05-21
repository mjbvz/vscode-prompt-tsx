/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation and GitHub. All rights reserved.
 *--------------------------------------------------------------------------------------------*/

import { PromptElement } from "./promptElement";

/**
 * Represents information about a chat endpoint.
 */
export interface IChatEndpointInfo {
	/**
	 * The maximum number of tokens allowed in the model prompt.
	 */
	readonly modelMaxPromptTokens: number;
}

/**
 * The sizing hint for the prompt element. Prompt elements should take this into account when rendering.
 */
export interface PromptSizing {
	/**
	 * The computed token allocation for this prompt element to adhere to when rendering,
	 * if it specified {@link BasePromptElementProps.flexBasis}.
	 */
	readonly tokenBudget: number;
	/**
	 * Metadata about the endpoint being used.
	 */
	readonly endpoint: IChatEndpointInfo;
}

export interface BasePromptElementProps {
	/**
	 * The absolute priority of the prompt element.
	 *
	 * If the messages to be sent exceed the available token budget, prompt elements will be removed from the rendered result, starting with the element with the lowest priority.
	 */
	priority?: number;
	/**
	 * The proportion of the container's {@link PromptSizing.tokenBudget token budget} that is assigned to this prompt element, based on the total weight requested by the prompt element and all its siblings.
	 *
	 * This is used to compute the {@link PromptSizing.tokenBudget token budget} hint that the prompt element receives.
	 *
	 * If set on a child element, the token budget is calculated with respect to all children under the element's parent, such that a child can never consume more tokens than its parent was allocated.
	 *
	 * Defaults to 1.
	 */
	flexBasis?: number;

	/** @deprecated renamed to {@link flexBasis} */
	flex?: number;

	/**
	 * If set, sibling elements will be rendered first, followed by this element. The remaining {@link PromptSizing.tokenBudget token budget} from the container will be distributed among the elements with `flexGrow` set.
	 *
	 * If multiple elements are present with different values of `flexGrow` set, this process is repeated for each value of `flexGrow` in descending order.
	 */
	flexGrow?: number;

	/**
	 * If set with {@link flexGrow}, this defines the number of tokens this element will reserve of the container {@link PromptSizing.tokenBudget token budget} for sizing purposes in elements rendered before it.
	 */
	flexReserve?: number;
}

export interface PromptElementCtor<P extends BasePromptElementProps, S> {
	isFragment?: boolean;
	new(props: P, ...args: any[]): PromptElement<P, S>;
}

export interface RuntimePromptElementProps {
	children?: PromptPiece[];
}

export type PromptElementProps<T> = T & BasePromptElementProps & RuntimePromptElementProps;

export interface PromptPiece<P extends BasePromptElementProps = any, S = any> {
	ctor: string | PromptElementCtor<P, S>;
	props: P;
	children: PromptPieceChild[];
}

export type PromptPieceChild = number | string | PromptPiece<any> | undefined;
