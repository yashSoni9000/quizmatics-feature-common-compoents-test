type GetEventHandlers<T extends keyof JSX.IntrinsicElements> = Extract<
    keyof JSX.IntrinsicElements[T],
    `on${string}`
>;

export type EventFor<
    TElement extends keyof JSX.IntrinsicElements,
    THandler extends GetEventHandlers<TElement>,
> = JSX.IntrinsicElements[TElement][THandler] extends
    | ((e: infer TEvent) => any) //eslint-disable-line
    | undefined
    ? TEvent
    : never;

export type ResponseType<Type> = { data: Type };

export type StrapiSingleResponse<Type> = {
    data: {
        id: number;
        attributes: {
            createdAt: string;
            updatedAt: string;
            publishedAt: string;
        } & Type;
    };
    meta: object;
};

export type StrapiMultiResponse<Type> = {
    data: {
        id: number;
        attributes: {
            createdAt: string;
            updatedAt: string;
            publishedAt: string;
        } & Type;
    }[];
    meta: { pagination: { total: number } };
};
