import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { createSelector } from '@reduxjs/toolkit';

// Define the base query using fakeBaseQuery since we're using Electron API
const baseQuery = fakeBaseQuery();

// Create the API slice for hymns
export const apiSlice = createApi({
    reducerPath: 'apiSlice',
    baseQuery,
    tagTypes: ['Hymn', 'HymnBook', 'Language'],
    endpoints: (builder) => ({
        getHymnBooks: builder.query({
            async queryFn() {
                try {
                    const hymnbooks = await window.electronAPI.getHymnBooks(); // Electron API call
                    return { data: hymnbooks };
                } catch (error) {
                    return { error: { status: 'CUSTOM_ERROR', message: error.message } };
                }
            },
            providesTags: ['HymnBook'],
        }),
        getLanguages: builder.query({
            async queryFn() {
                try {
                    const languages = await window.electronAPI.getLanguages(); // Electron API call
                    return { data: languages };
                } catch (error) {
                    return { error: { status: 'CUSTOM_ERROR', message: error.message } };
                }
            },
            providesTags: ['Language'],
        }),
        getHymnsByBookAndLanguage: builder.query({
            async queryFn({ hymnbookId, languageId }) {
                try {
                    const hymns = await window.electronAPI.getHymnsByBookAndLanguage(hymnbookId, languageId); // Electron API call
                    return { data: hymns };
                } catch (error) {
                    return { error: { status: 'CUSTOM_ERROR', message: error.message } };
                }
            },
            providesTags: (result, error, { hymnbookId, languageId }) => [
                { type: 'Hymn', hymnbookId, languageId },
            ],
        }),
    }),
});

// Select the result of the `getHymnsByBookAndLanguage` query
export const selectHymnsByBookAndLanguageResult = apiSlice.endpoints.getHymnsByBookAndLanguage.select();

// Memoized selector for hymns data
export const selectHymnsByBookAndLanguageData = createSelector(
    selectHymnsByBookAndLanguageResult,
    (hymnsByBookAndLanguageResult) => hymnsByBookAndLanguageResult.data
);

// Export the hooks for the endpoints
export const {
    useGetHymnBooksQuery,
    useGetHymnsByBookAndLanguageQuery,
    useGetLanguagesQuery,
} = apiSlice;
