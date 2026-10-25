import { useCallback, useRef } from 'react';

/**
 * Hook for registering form fields per tab
 * This is useful for tab-based forms where you want to track which fields belong to which tab
 * 
 * Usage:
 * const tabForm = useTabFormRegister();
 * tabForm.registerField('tabName', 'fieldName');
 */
export const useTabFormRegister = () => {
    const fieldsRef = useRef<Map<string, Set<string>>>(new Map());

    const registerField = useCallback((tabLabel: string, fieldName: string) => {
        if (!fieldsRef.current.has(tabLabel)) {
            fieldsRef.current.set(tabLabel, new Set());
        }
        fieldsRef.current.get(tabLabel)?.add(fieldName);
    }, []);

    const unregisterField = useCallback((fieldName: string) => {
        fieldsRef.current.forEach((fields) => {
            fields.delete(fieldName);
        });
    }, []);

    const getFieldsForTab = useCallback((tabLabel: string) => {
        return Array.from(fieldsRef.current.get(tabLabel) ?? []);
    }, []);

    const getAllTabs = useCallback(() => {
        return Array.from(fieldsRef.current.keys());
    }, []);

    return {
        registerField,
        unregisterField,
        getFieldsForTab,
        getAllTabs,
    };
};
