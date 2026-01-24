import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '../context/AdminContext';

const EditableText = ({ id, tag: Tag = 'span', className, children, ...props }) => {
    const { editMode, siteContent, updateContent } = useAdmin();
    const [content, setContent] = useState(siteContent[id] || children);
    const elementRef = useRef(null);

    useEffect(() => {
        if (siteContent[id] !== undefined) {
            setContent(siteContent[id]);
        }
    }, [siteContent, id]);

    const handleBlur = () => {
        if (elementRef.current) {
            const newText = elementRef.current.innerText;
            setContent(newText);
            updateContent(id, newText);
        }
    };

    if (!editMode) {
        return <Tag className={className} {...props}>{content}</Tag>;
    }

    return (
        <Tag
            ref={elementRef}
            className={`${className} admin-editable`}
            contentEditable
            suppressContentEditableWarning
            onBlur={handleBlur}
            {...props}
        >
            {content}
        </Tag>
    );
};

export default EditableText;
